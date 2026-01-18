"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical, User, Mail, MapPin, Paperclip, Smile } from "lucide-react";
import { useSocket } from "@/components/providers/socket-provider";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
    id: number;
    content: string;
    createdAt: string;
    senderId: number | null;
    sender: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    } | null;
}

interface Lead {
    id: number;
    name: string;
    phone: string;
    email?: string;
    status: string;
    source: string;
    city?: string;
    owner: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    } | null;
}

interface MessageThreadProps {
    leadId: number;
}

export function MessageThread({ leadId }: MessageThreadProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [inputMessage, setInputMessage] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (leadId) {
            fetchMessages();
        }
    }, [leadId]);

    useEffect(() => {
        if (!socket || !isConnected || !leadId) return;

        // Join room específico do lead
        socket.emit("join-room", `whatsapp-${leadId}`);

        // Listen for new WhatsApp messages
        socket.on("new-whatsapp-message", (message: Message) => {
            if (message) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.off("new-whatsapp-message");
        };
    }, [socket, isConnected, leadId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/whatsapp/messages/${leadId}`);
            const data = await response.json();

            if (response.ok) {
                setMessages(data.messages || []);
                setLead(data.lead || null);
            }
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || sending) return;

        try {
            setSending(true);
            const response = await fetch(`/api/whatsapp/messages/${leadId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: inputMessage,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages((prev) => [...prev, data.message]);
                setInputMessage("");
            } else {
                alert(data.error || "Erro ao enviar mensagem");
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            alert("Erro ao enviar mensagem");
        } finally {
            setSending(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            NEW: "bg-blue-500",
            CONTACTED: "bg-yellow-500",
            PROPOSAL: "bg-purple-500",
            NEGOTIATION: "bg-orange-500",
            WON: "bg-green-500",
            LOST: "bg-red-500",
        };
        return colors[status] || "bg-gray-500";
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            NEW: "Novo",
            CONTACTED: "Contatado",
            PROPOSAL: "Proposta",
            NEGOTIATION: "Negociação",
            WON: "Ganho",
            LOST: "Perdido",
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-stone-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando conversa...</p>
                </div>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="flex items-center justify-center h-full bg-stone-50">
                <div className="text-center text-muted-foreground">
                    <Phone className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="font-medium">Lead não encontrado</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-brand-100 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-brand-100">
                            <AvatarImage src={lead.owner?.avatar} />
                            <AvatarFallback className="bg-brand-200 text-brand-700 font-bold">
                                {getInitials(lead.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-bold text-brand-900">{lead.name}</h2>
                            <div className="flex items-center gap-2 text-xs text-brand-500">
                                <Phone className="h-3 w-3" />
                                <span>{lead.phone}</span>
                                {lead.email && (
                                    <>
                                        <span>•</span>
                                        <Mail className="h-3 w-3" />
                                        <span>{lead.email}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge
                                    variant="secondary"
                                    className={`${getStatusColor(lead.status)} text-white text-[10px] px-2 py-0`}
                                >
                                    {getStatusLabel(lead.status)}
                                </Badge>
                                {lead.city && (
                                    <span className="text-[10px] text-brand-400 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {lead.city}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs">
                            <span
                                className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                            ></span>
                            <span className="text-muted-foreground">
                                {isConnected ? "Online" : "Offline"}
                            </span>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4 text-brand-600" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Video className="h-4 w-4 text-brand-600" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4 text-brand-600" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-stone-50/30">
                <div className="space-y-4 max-w-4xl mx-auto">
                    {messages.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Phone className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p className="font-medium">Nenhuma mensagem ainda</p>
                            <p className="text-sm mt-1">Inicie a conversa enviando uma mensagem</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isFromCustomer = !msg.senderId;
                            const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${isFromCustomer ? "justify-start" : "justify-end"}`}
                                >
                                    {isFromCustomer && showAvatar && (
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                                                {getInitials(lead.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    {isFromCustomer && !showAvatar && <div className="w-8"></div>}

                                    <div
                                        className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${isFromCustomer
                                                ? "bg-white border border-stone-200 text-stone-800 rounded-tl-none"
                                                : "bg-green-500 text-white rounded-tr-none"
                                            }`}
                                    >
                                        {msg.sender && !isFromCustomer && showAvatar && (
                                            <p className="text-[10px] font-bold text-green-100 mb-1">
                                                {msg.sender.name}
                                            </p>
                                        )}
                                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                        <span
                                            className={`text-[10px] block text-right mt-1 ${isFromCustomer ? "text-stone-400" : "text-green-100"
                                                }`}
                                        >
                                            {formatDistanceToNow(new Date(msg.createdAt), {
                                                addSuffix: true,
                                                locale: ptBR,
                                            })}
                                        </span>
                                    </div>

                                    {!isFromCustomer && showAvatar && msg.sender && (
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarImage src={msg.sender.avatar} />
                                            <AvatarFallback className="bg-brand-200 text-brand-700 text-xs">
                                                {getInitials(msg.sender.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    {!isFromCustomer && !showAvatar && <div className="w-8"></div>}
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-brand-100">
                <form onSubmit={sendMessage} className="flex gap-3 items-end max-w-4xl mx-auto">
                    <Button type="button" variant="ghost" size="icon" className="shrink-0">
                        <Paperclip className="h-5 w-5 text-brand-400" />
                    </Button>
                    <div className="flex-1 relative">
                        <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="bg-stone-50 border-stone-200 focus-visible:ring-brand-500 pr-10"
                            disabled={sending || !isConnected}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        >
                            <Smile className="h-4 w-4 text-brand-400" />
                        </Button>
                    </div>
                    <Button
                        type="submit"
                        disabled={!inputMessage.trim() || sending || !isConnected}
                        className="bg-green-600 hover:bg-green-700 h-10 w-10 p-0 rounded-lg shrink-0 transition-all hover:scale-105"
                    >
                        {sending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <Send size={18} />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
