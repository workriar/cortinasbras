/**
 * Socket.IO Emitter Helper
 * 
 * Este módulo fornece uma forma de emitir eventos Socket.IO de dentro de Route Handlers
 * do Next.js. Como os Route Handlers não têm acesso direto à instância do Socket.IO,
 * usamos uma abordagem de singleton global.
 */

import { Server as SocketIOServer } from "socket.io";

// Global singleton para armazenar a instância do Socket.IO
let globalSocketIO: SocketIOServer | null = null;

/**
 * Define a instância global do Socket.IO
 * Deve ser chamado no server.ts quando o servidor Socket.IO é inicializado
 */
export function setGlobalSocketIO(io: SocketIOServer) {
    globalSocketIO = io;
    console.log("[Socket Helper] Global Socket.IO instance set");
}

/**
 * Retorna a instância global do Socket.IO
 */
export function getGlobalSocketIO(): SocketIOServer | null {
    return globalSocketIO;
}

/**
 * Emite um evento para uma sala específica
 */
export function emitToRoom(room: string, event: string, data: any) {
    if (globalSocketIO) {
        globalSocketIO.to(room).emit(event, data);
        console.log(`[Socket Helper] Emitted '${event}' to room '${room}'`);
        return true;
    } else {
        console.warn("[Socket Helper] Socket.IO instance not available");
        return false;
    }
}

/**
 * Emite um evento para todos os clientes conectados
 */
export function emitToAll(event: string, data: any) {
    if (globalSocketIO) {
        globalSocketIO.emit(event, data);
        console.log(`[Socket Helper] Emitted '${event}' to all clients`);
        return true;
    } else {
        console.warn("[Socket Helper] Socket.IO instance not available");
        return false;
    }
}

/**
 * Emite uma notificação para administradores
 */
export function notifyAdmins(notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
}) {
    return emitToRoom("admins", "notification", notification);
}

/**
 * Emite uma nova mensagem do WhatsApp para a sala do lead
 */
export function notifyNewWhatsAppMessage(leadId: number, message: any) {
    emitToRoom(`whatsapp-${leadId}`, "new-whatsapp-message", message);
    emitToRoom(`lead-${leadId}`, "new-whatsapp-message", message);

    // Também notifica admins
    notifyAdmins({
        type: "WHATSAPP_MESSAGE",
        title: "Nova mensagem WhatsApp",
        message: `Mensagem recebida do lead #${leadId}`,
        data: { leadId, messagePreview: message.content?.substring(0, 50) }
    });
}
