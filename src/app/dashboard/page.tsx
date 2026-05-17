'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChartCard from '@/components/ChartCard';
import { Users, UserPlus, PhoneCall, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Lead {
    id: number;
    name: string;
    phone: string;
    email?: string;
    city?: string;
    status: string;
    source: string;
    createdAt: string;
}

interface Stats {
    total: number;
    new: number;
    contacted: number;
    proposal: number;
    won: number;
}

export default function DashboardHome() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, new: 0, contacted: 0, proposal: 0, won: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login', { scroll: false });
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchDashboardData();
        }
    }, [status]);

    const fetchDashboardData = async () => {
        try {
            const leadsRes = await fetch('/api/leads?limit=5');
            const leadsData = await leadsRes.json();
            setLeads(leadsData.leads || []);

            const statsRes = await fetch('/api/reports/stats');
            const statsData = await statsRes.json();
            setStats(statsData);
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-brand-700 dark:text-baroque-gold tracking-tight uppercase">Dashboard</h1>
                <p className="text-brand-900/60 dark:text-baroque-muted text-sm mt-1">Bem-vindo, <span className="text-brand-900 dark:text-baroque-text font-bold">{session?.user?.name || session?.user?.email}</span>. Aqui está o resumo operacional.</p>
            </div>

            {/* Stats Cards - Refined and Subtle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-baroque-surface p-5 rounded-2xl border border-gray-100 dark:border-baroque-border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-stone-50 dark:bg-baroque-bg rounded-xl flex items-center justify-center text-stone-500 dark:text-baroque-gold border border-stone-100 dark:border-baroque-border">
                            <Users size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-stone-400 dark:text-baroque-muted uppercase tracking-widest leading-none">Total de Leads</p>
                        <p className="text-2xl font-black text-gray-800 dark:text-baroque-text mt-1.5">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-baroque-surface p-5 rounded-2xl border border-gray-100 dark:border-baroque-border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-stone-50 dark:bg-baroque-bg rounded-xl flex items-center justify-center text-stone-500 dark:text-baroque-gold border border-stone-100 dark:border-baroque-border">
                            <UserPlus size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-stone-400 dark:text-baroque-muted uppercase tracking-widest leading-none">Novos</p>
                        <p className="text-2xl font-black text-gray-800 dark:text-baroque-text mt-1.5">{stats.new}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-baroque-surface p-5 rounded-2xl border border-gray-100 dark:border-baroque-border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-stone-50 dark:bg-baroque-bg rounded-xl flex items-center justify-center text-stone-500 dark:text-baroque-gold border border-stone-100 dark:border-baroque-border">
                            <PhoneCall size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-stone-400 dark:text-baroque-muted uppercase tracking-widest leading-none">Em Contato</p>
                        <p className="text-2xl font-black text-gray-800 dark:text-baroque-text mt-1.5">{stats.contacted}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-baroque-surface p-5 rounded-2xl border border-gray-100 dark:border-baroque-border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-stone-50 dark:bg-baroque-bg rounded-xl flex items-center justify-center text-stone-500 dark:text-baroque-gold border border-stone-100 dark:border-baroque-border">
                            <FileText size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-stone-400 dark:text-baroque-muted uppercase tracking-widest leading-none">Propostas</p>
                        <p className="text-2xl font-black text-gray-800 dark:text-baroque-text mt-1.5">{stats.proposal}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-baroque-surface p-5 rounded-2xl border border-gray-100 dark:border-baroque-border shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-stone-50 dark:bg-baroque-bg rounded-xl flex items-center justify-center text-stone-500 dark:text-baroque-gold border border-stone-100 dark:border-baroque-border">
                            <CheckCircle2 size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-stone-400 dark:text-baroque-muted uppercase tracking-widest leading-none">Fechados</p>
                        <p className="text-2xl font-black text-gray-800 dark:text-baroque-text mt-1.5">{stats.won}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Distribuição por Status" type="status" />
                <ChartCard title="Conversão por Origem" type="source" />
            </div>

            {/* Recent Leads */}
            <div className="bg-white dark:bg-baroque-surface p-6 rounded-2xl border border-gray-100 dark:border-baroque-border shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-bold text-gray-800 dark:text-baroque-text uppercase tracking-widest">Leads Recentes</h2>
                    <Link href="/dashboard/crm" scroll={false} className="group flex items-center gap-1.5 text-[10px] font-bold text-stone-500 dark:text-baroque-muted hover:text-stone-800 dark:hover:text-baroque-gold uppercase tracking-widest transition-colors">
                        Ver tudo
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.length === 0 ? (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-50 dark:border-baroque-border rounded-xl">
                            <p className="text-xs font-bold text-gray-300 dark:text-baroque-muted uppercase tracking-widest">Nenhum registro recente</p>
                        </div>
                    ) : (
                        leads.map((lead) => (
                            <div key={lead.id} className="bg-gray-50/50 dark:bg-baroque-bg p-4 rounded-xl border border-gray-100 dark:border-baroque-border hover:border-gray-200 dark:hover:border-baroque-gold/50 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-white dark:bg-baroque-surface rounded-full border border-gray-100 dark:border-baroque-border flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-baroque-gold uppercase">
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 dark:text-baroque-text uppercase tracking-tight leading-none mb-1">{lead.name}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-baroque-muted leading-none">{lead.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-baroque-border">
                                    <span className="text-[9px] font-bold text-stone-400 dark:text-baroque-muted uppercase tracking-widest">{lead.status}</span>
                                    <span className="text-[9px] text-gray-300 dark:text-baroque-muted uppercase tracking-widest">
                                        {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
