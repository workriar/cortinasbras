'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LeadCard from '@/components/LeadCard';
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
            router.push('/login');
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
                <h1 className="text-2xl font-black text-brand-700 tracking-tight uppercase">Dashboard</h1>
                <p className="text-brand-900/60 text-sm mt-1">Bem-vindo, <span className="text-brand-900 font-bold">{session?.user?.name || session?.user?.email}</span>. Aqui está o resumo operacional.</p>
            </div>

            {/* Stats Cards - Refined and Subtle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-700 border border-brand-100">
                            <Users size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-brand-700/60 uppercase tracking-widest leading-none">Total de Leads</p>
                        <p className="text-2xl font-black text-brand-700 mt-1.5">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500 border border-brand-100">
                            <UserPlus size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-brand-700/60 uppercase tracking-widest leading-none">Novos</p>
                        <p className="text-2xl font-black text-brand-700 mt-1.5">{stats.new}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100/50">
                            <PhoneCall size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-brand-700/60 uppercase tracking-widest leading-none">Em Contato</p>
                        <p className="text-2xl font-black text-brand-700 mt-1.5">{stats.contacted}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 border border-brand-100">
                            <FileText size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-brand-700/60 uppercase tracking-widest leading-none">Propostas</p>
                        <p className="text-2xl font-black text-brand-700 mt-1.5">{stats.proposal}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                            <CheckCircle2 size={20} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-brand-700/60 uppercase tracking-widest leading-none">Fechados</p>
                        <p className="text-2xl font-black text-brand-700 mt-1.5">{stats.won}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Distribuição por Status" type="status" />
                <ChartCard title="Conversão por Origem" type="source" />
            </div>

            {/* Recent Leads */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-bold text-gray-800 uppercase tracking-widest">Leads Recentes</h2>
                    <Link href="/dashboard/crm" className="group flex items-center gap-1.5 text-[10px] font-bold text-stone-500 hover:text-stone-800 uppercase tracking-widest transition-colors">
                        Ver tudo
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leads.length === 0 ? (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-50 rounded-xl">
                            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Nenhum registro recente</p>
                        </div>
                    ) : (
                        leads.map((lead) => (
                            <div key={lead.id} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-white rounded-full border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase">
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 uppercase tracking-tight leading-none mb-1">{lead.name}</p>
                                        <p className="text-[10px] text-gray-400 leading-none">{lead.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{lead.status}</span>
                                    <span className="text-[9px] text-gray-300 uppercase tracking-widest">
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
