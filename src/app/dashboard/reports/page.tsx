'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChartCard from '@/components/ChartCard';

export default function ReportsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, proposal: 0, won: 0, lost: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchStats();
        }
    }, [status]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/reports/stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const conversionRate = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Relatórios e Análises</h1>
                <p className="text-gray-600 mt-1">Acompanhe o desempenho do seu funil de vendas</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total de Leads</p>
                            <p className="text-3xl font-bold mt-1">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Taxa de Conversão</p>
                            <p className="text-3xl font-bold mt-1">{conversionRate}%</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Leads Ativos</p>
                            <p className="text-3xl font-bold mt-1">{stats.new + stats.contacted + stats.proposal}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Vendas Fechadas</p>
                            <p className="text-3xl font-bold mt-1">{stats.won}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Distribuição por Status" type="status" />
                <ChartCard title="Origem dos Leads" type="source" />
            </div>

            <div className="glass-card p-6 rounded-xl">
                <ChartCard title="Novos Leads (Últimos 7 dias)" type="weekly" />
            </div>

            {/* Detailed Stats Table */}
            <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Detalhamento por Status</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentual</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Novos</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.new}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {stats.total > 0 ? ((stats.new / stats.total) * 100).toFixed(1) : 0}%
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Em Contato</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.contacted}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {stats.total > 0 ? ((stats.contacted / stats.total) * 100).toFixed(1) : 0}%
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Proposta</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.proposal}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {stats.total > 0 ? ((stats.proposal / stats.total) * 100).toFixed(1) : 0}%
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">Fechados</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.won}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : 0}%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
