"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, MessageCircle, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Conversation {
    leadId: number;
    name: string;
    phone: string;
    email?: string;
    status: string;
    source: string;
    owner: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    } | null;
    lastMessage: {
        id: number;
        content: string;
        createdAt: string;
        sender: {
            id: number;
            name: string;
        } | null;
    } | null;
    unreadCount: number;
    updatedAt: string;
}

interface ConversationListProps {
    onSelectConversation: (leadId: number) => void;
    selectedLeadId?: number;
}

export function ConversationList({ onSelectConversation, selectedLeadId }: ConversationListProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "active">("all");

    useEffect(() => {
        fetchConversations();
    }, [filter, search]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filter !== "all") params.set("filter", filter);
            if (search) params.set("search", search);

            const response = await fetch(`/api/whatsapp/conversations?${params}`);
            const data = await response.json();

            if (response.ok) {
                setConversations(data.conversations || []);
            }
        } catch (error) {
            console.error("Erro ao buscar conversas:", error);
        } finally {
            setLoading(false);
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

    return (
        <div className="flex flex-col h-full bg-white border-r border-brand-100">
            {/* Header */}
            <div className="p-4 border-b border-brand-100">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-brand-900 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-brand-600" />
                        WhatsApp
                    </h2>
                    <Badge variant="secondary" className="bg-brand-100 text-brand-700">
                        {conversations.length}
                    </Badge>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome ou telefone..."
                        className="pl-9 bg-brand-50/50 border-brand-100"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("all")}
                        className={filter === "all" ? "bg-brand-600 hover:bg-brand-700" : ""}
                    >
                        Todas
                    </Button>
                    <Button
                        variant={filter === "unread" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("unread")}
                        className={filter === "unread" ? "bg-brand-600 hover:bg-brand-700" : ""}
                    >
                        Não lidas
                    </Button>
                    <Button
                        variant={filter === "active" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("active")}
                        className={filter === "active" ? "bg-brand-600 hover:bg-brand-700" : ""}
                    >
                        Ativas
                    </Button>
                </div>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1">
                {loading ? (
                    <div className="p-4 text-center text-muted-foreground">
                        Carregando conversas...
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">Nenhuma conversa encontrada</p>
                        <p className="text-sm mt-1">
                            {search ? "Tente outro termo de busca" : "Aguardando mensagens do WhatsApp"}
                        </p>
                    </div>
                ) : (
                    <div className="p-2 space-y-1">
                        {conversations.map((conv) => (
                            <div
                                key={conv.leadId}
                                onClick={() => onSelectConversation(conv.leadId)}
                                className={`
                                    flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all
                                    hover:bg-brand-50 border
                                    ${selectedLeadId === conv.leadId
                                        ? "bg-brand-50 border-brand-200"
                                        : "bg-white border-transparent hover:border-brand-100"
                                    }
                                `}
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={conv.owner?.avatar} />
                                        <AvatarFallback className="bg-brand-200 text-brand-700 font-semibold">
                                            {getInitials(conv.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    {conv.unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-white">
                                            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-brand-900 text-sm truncate">
                                            {conv.name}
                                        </span>
                                        <span className="text-[10px] text-brand-400 ml-2 shrink-0">
                                            {conv.lastMessage
                                                ? formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                                                    addSuffix: true,
                                                    locale: ptBR,
                                                })
                                                : ""}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-1">
                                        <Phone className="h-3 w-3 text-brand-400" />
                                        <span className="text-xs text-brand-500">{conv.phone}</span>
                                    </div>

                                    {conv.lastMessage && (
                                        <p className="text-xs text-brand-600 truncate">
                                            {conv.lastMessage.sender
                                                ? `${conv.lastMessage.sender.name}: `
                                                : "Cliente: "}
                                            {conv.lastMessage.content}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge
                                            variant="secondary"
                                            className={`${getStatusColor(conv.status)} text-white text-[10px] px-2 py-0`}
                                        >
                                            {getStatusLabel(conv.status)}
                                        </Badge>
                                        {conv.owner && (
                                            <span className="text-[10px] text-brand-400">
                                                👤 {conv.owner.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
