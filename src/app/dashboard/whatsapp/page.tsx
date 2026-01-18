"use client";

import { useState } from "react";
import { ConversationList } from "@/components/whatsapp/conversation-list";
import { MessageThread } from "@/components/whatsapp/message-thread";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, BarChart3, Settings, FileText } from "lucide-react";
import Link from "next/link";

export default function WhatsAppPage() {
    const [selectedLeadId, setSelectedLeadId] = useState<number | undefined>();

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-900 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                            <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        WhatsApp Business
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie todas as conversas do WhatsApp em um só lugar
                    </p>
                </div>

                <div className="flex gap-2">
                    <Link href="/dashboard/whatsapp/analytics">
                        <Button variant="outline" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Métricas
                        </Button>
                    </Link>
                    <Link href="/dashboard/whatsapp/templates">
                        <Button variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Templates
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="outline" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Configurações
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <Card className="flex-1 flex overflow-hidden border-brand-100 shadow-sm">
                <div className="w-96 border-r border-brand-100">
                    <ConversationList
                        onSelectConversation={setSelectedLeadId}
                        selectedLeadId={selectedLeadId}
                    />
                </div>

                <div className="flex-1">
                    {selectedLeadId ? (
                        <MessageThread leadId={selectedLeadId} />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-stone-50/30">
                            <div className="text-center text-muted-foreground max-w-md">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mx-auto mb-6">
                                    <MessageCircle className="h-12 w-12 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-900 mb-2">
                                    WhatsApp Business
                                </h3>
                                <p className="text-sm mb-4">
                                    Selecione uma conversa à esquerda para começar a interagir com seus clientes
                                </p>
                                <div className="bg-white border border-brand-100 rounded-lg p-4 text-left">
                                    <h4 className="font-semibold text-brand-900 mb-2 text-sm">
                                        💡 Dicas rápidas:
                                    </h4>
                                    <ul className="text-xs space-y-1 text-brand-600">
                                        <li>• Use templates para respostas rápidas</li>
                                        <li>• Todas as mensagens são sincronizadas em tempo real</li>
                                        <li>• Você pode anexar arquivos e imagens</li>
                                        <li>• Acompanhe métricas de desempenho</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
