'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import KanbanBoard from '@/components/KanbanBoard';
import LeadForm from '@/components/LeadForm';
import { Plus, X, ListFilter, MessageSquare, Instagram, Facebook, Send, Users, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Stats {
    total: number;
    new: number;
    contacted: number;
    converted: number;
    responseTime: string;
}

function CRMContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showForm, setShowForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        new: 0,
        contacted: 0,
        converted: 0,
        responseTime: '0min'
    });
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const status = 'authenticated';

    useEffect(() => {
        if (searchParams?.get('new') === 'true') {
            setShowForm(true);
        }
        fetchStats();
    }, [searchParams]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/leads/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    const handleLeadCreated = () => {
        setShowForm(false);
        setRefreshKey((prev) => prev + 1);
        fetchStats();
    };

    const channels = [
        { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'text-green-600', bgColor: 'bg-green-50', count: stats.new },
        { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600', bgColor: 'bg-pink-50', count: 0 },
        { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bgColor: 'bg-blue-50', count: 0 },
        { id: 'tiktok', name: 'TikTok', icon: Send, color: 'text-gray-900', bgColor: 'bg-gray-50', count: 0 },
    ];

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header com Stats */}
            <div className="flex flex-col gap-6">
                {/* Top Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">{showForm ? 'Fechar' : 'Novo Lead'}</span>
                            <span className="sm:hidden">Novo</span>
                        </button>

                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight uppercase hidden sm:block">
                                CRM Multi-Canal
                            </h1>
                            <p className="text-xs text-gray-500 hidden md:block">Gestão integrada de leads e atendimento</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveFilter(activeFilter === 'all' ? 'today' : 'all')}
                            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            <ListFilter size={18} />
                            {activeFilter === 'all' ? 'Todos' : 'Hoje'}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Leads</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Users className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Novos</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.new}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <TrendingUp className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Em Contato</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.contacted}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                                <MessageSquare className="text-amber-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tempo Resp.</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.responseTime}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Clock className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Canais de Atendimento */}
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Canais de Atendimento</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {channels.map((channel) => {
                            const Icon = channel.icon;
                            return (
                                <button
                                    key={channel.id}
                                    className={`${channel.bgColor} rounded-lg p-4 hover:shadow-md transition-all group relative`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={channel.color} size={20} />
                                        <div className="text-left">
                                            <p className="text-xs font-medium text-gray-700">{channel.name}</p>
                                            <p className={`text-lg font-bold ${channel.color}`}>{channel.count}</p>
                                        </div>
                                    </div>
                                    {channel.count > 0 && (
                                        <Badge className="absolute top-2 right-2" variant="destructive">
                                            {channel.count}
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-base font-bold text-gray-800 uppercase tracking-widest">Novo Lead</h2>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Preencha os dados do cliente</p>
                            </div>
                            <button
                                onClick={() => setShowForm(false)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <LeadForm onSuccess={handleLeadCreated} onCancel={() => setShowForm(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            <div className="flex-1 overflow-hidden">
                <KanbanBoard key={refreshKey} filter={activeFilter} />
            </div>
        </div>
    );
}

export default function CRMPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400"></div>
            </div>
        }>
            <CRMContent />
        </Suspense>
    );
}
