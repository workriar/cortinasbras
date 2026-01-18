"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/components/providers/socket-provider";
import { useSession } from "next-auth/react";
import { Send, User, MessageCircle, Phone, Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Message {
    id: number;
    content: string;
    senderId: number;
    createdAt: string;
    sender: {
        name: string;
        email: string;
    };
    isMe?: boolean;
}

export default function ChatPage() {
    const { socket, isConnected } = useSocket();
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Auto-scroll
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!socket || !isConnected) return;

        // Join general channel
        socket.emit("join-room", "general");

        // Listen for new messages
        socket.on("new-message", (message: Message) => {
            const isMe = session?.user?.email === message.sender.email;
            setMessages((prev) => [...prev, { ...message, isMe }]);
        });

        return () => {
            socket.off("new-message");
        };
    }, [socket, isConnected, session]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !socket) return;

        const messageData = {
            content: inputMessage,
            // @ts-ignore - session id might be string/int mismatch, assuming logic holds
            senderId: session?.user?.role === 'ADMIN' ? 1 : 2, // Mock ID for now, real implementation needs correct user ID from session
            roomId: "general",
            type: "INTERNAL"
        };

        socket.emit("send-message", messageData);
        setInputMessage("");
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* Sidebar de Contatos (Esquerda) */}
            <Card className="w-80 hidden md:flex flex-col bg-white border-brand-100 shadow-sm">
                <div className="p-4 border-b border-brand-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar conversas..." className="pl-9 bg-brand-50/50 border-brand-100" />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-2">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-50 border border-brand-100 cursor-pointer">
                            <Avatar>
                                <AvatarFallback className="bg-brand-200 text-brand-700">GC</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-brand-900 text-sm">Geral - Equipe</span>
                                    <span className="text-[10px] text-brand-400">09:41</span>
                                </div>
                                <p className="text-xs text-brand-500 truncate">Discussões gerais do time...</p>
                            </div>
                        </div>

                        {/* Placeholder items */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer opacity-60">
                                <Avatar>
                                    <AvatarFallback>U{i}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-stone-700 text-sm">Vendedor {i}</span>
                                    </div>
                                    <p className="text-xs text-stone-400 truncate">Offline</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* Chat Principal (Direita) */}
            <Card className="flex-1 flex flex-col bg-white border-brand-100 shadow-sm overflow-hidden">
                {/* Header do Chat */}
                <div className="p-4 border-b border-brand-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-brand-100">
                            <AvatarFallback className="bg-brand-500 text-white font-bold">#</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-bold text-brand-800">Chat Geral</h2>
                            <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-xs text-stone-500">
                                    {isConnected ? 'Conectado em tempo real' : 'Desconectado...'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Phone size={20} className="text-brand-400" />
                    </Button>
                </div>

                {/* Área de Mensagens */}
                <ScrollArea className="flex-1 p-4 bg-stone-50/30">
                    <div className="space-y-4 max-w-3xl mx-auto">
                        <div className="flex justify-center my-4">
                            <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">Hoje</span>
                        </div>

                        {messages.length === 0 && (
                            <div className="text-center py-10 text-stone-400">
                                <MessageCircle size={48} className="mx-auto mb-3 opacity-20" />
                                <p>Nenhuma mensagem ainda.</p>
                                <p className="text-sm">Seja o primeiro a enviar algo!</p>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                {!msg.isMe && (
                                    <Avatar className="h-8 w-8 mt-1">
                                        <AvatarFallback className="bg-stone-200 text-xs">{msg.sender.name?.[0] || '?'}</AvatarFallback>
                                    </Avatar>
                                )}

                                <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${msg.isMe
                                        ? 'bg-brand-500 text-white rounded-tr-none'
                                        : 'bg-white border border-stone-100 text-stone-800 rounded-tl-none'
                                    }`}>
                                    {!msg.isMe && (
                                        <p className="text-[10px] font-bold text-brand-600 mb-1">{msg.sender.name}</p>
                                    )}
                                    <p>{msg.content}</p>
                                    <span className={`text-[10px] block text-right mt-1 ${msg.isMe ? 'text-brand-100' : 'text-stone-400'
                                        }`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Área de Input via Sticky Footer */}
                <div className="p-4 bg-white border-t border-brand-100">
                    <form onSubmit={sendMessage} className="flex gap-3 items-end max-w-3xl mx-auto">
                        <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="bg-stone-50 border-stone-200 focus-visible:ring-brand-500"
                        />
                        <Button
                            type="submit"
                            disabled={!inputMessage.trim() || !isConnected}
                            className="bg-brand-600 hover:bg-brand-700 h-10 w-10 p-0 rounded-lg shrink-0 transition-all hover:scale-105"
                        >
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
