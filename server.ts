import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { setGlobalSocketIO } from "./src/lib/socket-emitter";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const prisma = new PrismaClient(); // Instância separada para o server

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url!, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error("Error occurred handling", req.url, err);
            res.statusCode = 500;
            res.end("internal server error");
        }
    });

    const io = new Server(server, {
        path: "/api/socket/io",
        addTrailingSlash: false,
        cors: {
            origin: "*",
        },
    });

    // Registrar instância global para uso em Route Handlers
    setGlobalSocketIO(io);

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Join room (lead or general chat)
        socket.on("join-room", (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });

        // Send message event
        socket.on("send-message", async (data) => {
            // Data expected: { content, senderId, leadId?, type? }
            try {
                console.log("Received message:", data);

                // Persist to DB using Prisma
                const savedMessage = await prisma.message.create({
                    data: {
                        content: data.content,
                        senderId: data.senderId,
                        leadId: data.leadId ? parseInt(data.leadId) : null,
                        type: data.type || "INTERNAL",
                        read: false
                    },
                    include: {
                        sender: {
                            select: { name: true, email: true, role: true }
                        }
                    }
                });

                // Broadcast to relevant rooms
                const room = data.leadId ? `lead-${data.leadId}` : "general";
                io.to(room).emit("new-message", savedMessage);

                // Notify admins if it's a new lead message
                io.to("admins").emit("notification", {
                    type: "NEW_MESSAGE",
                    message: `Nova mensagem em #${data.leadId}`,
                    data: savedMessage
                });

            } catch (error) {
                console.error("Error saving message:", error);
                socket.emit("error", "Failed to send message");
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
        console.log(`> Socket.io ready on http://${hostname}:${port}/api/socket/io`);
    });
});
