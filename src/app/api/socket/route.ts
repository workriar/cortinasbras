// src/app/api/socket/route.ts
import { Server as IOServer } from "socket.io";
import type { NextApiResponse } from "next";
import type { NextRequest } from "next/server";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextRequest, res: NextApiResponse) {
    // Initialize Socket.IO only once
    if (!res.socket?.server?.io) {
        const httpServer = res.socket?.server as any;
        const io = new IOServer(httpServer, {
            path: "/api/socket/io",
            cors: { origin: "*", methods: ["GET", "POST"] },
        });
        httpServer.io = io;

        io.on("connection", (socket) => {
            console.log("🔌 Socket.IO client connected:", socket.id);
            socket.emit("welcome", { msg: "Socket.IO ready!" });
            socket.on("disconnect", () => {
                console.log("❌ Socket.IO client disconnected:", socket.id);
            });
        });
    }

    // End the HTTP response – the socket server runs in the background
    res.end();
}
