�M"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    Users,
    TrendingUp,
    Download,
    Calendar,
    Phone,
    Search,
    ChevronRight,
    RefreshCw
} from "lucide-react";
import axios from "axios";

export default function AdminLeads() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/admin/leads");
            setLeads(data);
        } catch (error) {
            console.error("Erro ao buscar leads", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const stats = [
        { label: "Total de Leads", value: leads.length, icon: Users, color: "bg-brand-500" },
        { label: "Hoje", value: leads.filter(l => new Date(l.criado_em).toDateString() === new Date().toDateString()).length, icon: Calendar, color: "bg-green-500" },
        { label: "Conversão", value: "85%", icon: TrendingUp, color: "bg-blue-500" },
    ];

    const filteredLeads = leads.filter(l =>
        l.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.telefone?.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Sidebar / Header */}
            <header className="bg-white border-b border-gray-200 py-4 px-8 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Image src="/static/logo.png" alt="Logo" width={40} height={40} className="w-10 h-auto" />
                    <h1 className="text-xl font-bold text-brand-700">Dashboard de Leads</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={fetchLeads} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">
                        A
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{s.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
                                </div>
                                <div className={`${s.color} p-4 rounded-xl text-white shadow-lg`}>
                                    <s.icon size={24} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-gray-900">Solicitações Recentes</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou tel..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-500 transition-all w-full md:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Medidas</th>
                                    <th className="px-6 py-4">Tecido</th>
                                    <th className="px-6 py-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-6 h-12 bg-gray-50/50"></td>
                                        </tr>
                                    ))
                                ) : filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Nenhum lead encontrado.</td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-6">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {new Date(lead.criado_em).toLocaleDateString("pt-BR")}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(lead.criado_em).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 font-bold text-xs">
                                                        {lead.nome?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{lead.nome}</p>
                                                        <p className="text-xs text-brand-500 flex items-center gap-1">
                                                            <Phone size={10} /> {lead.telefone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <p className="text-sm text-gray-700">{lead.largura_parede}m x {lead.altura_parede}m</p>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold">
                                                    {lead.tecido || "Padrão"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-brand-500 transition-colors" title="Exportar PDF">
                                                        <Download size={18} />
                                                    </button>
                                                    <a
                                                        href={`https://wa.me/55${lead.telefone?.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                                                    >
                                                        <ChevronRight size={18} />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
�M"(3aaa15f6da881e5e1c3f791e24c6d9b44e38731222file:///root/next-app/src/app/admin/leads/page.tsx:file:///root