'use client';
import { useState } from 'react';

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

interface LeadTableProps {
    leads: Lead[];
    onUpdate: () => void;
}

export default function LeadTable({ leads, onUpdate }: LeadTableProps) {
    const [deleting, setDeleting] = useState<number | null>(null);

    const statusColors = {
        NEW: 'bg-blue-100 text-blue-800',
        CONTACTED: 'bg-yellow-100 text-yellow-800',
        PROPOSAL: 'bg-orange-100 text-orange-800',
        CLOSED_WON: 'bg-green-100 text-green-800',
        CLOSED_LOST: 'bg-red-100 text-red-800',
    };

    const statusLabels = {
        NEW: 'Novo',
        CONTACTED: 'Em Contato',
        PROPOSAL: 'Proposta',
        CLOSED_WON: 'Fechado',
        CLOSED_LOST: 'Perdido',
    };

    const sourceLabels = {
        SITE: 'Site',
        WHATSAPP: 'WhatsApp',
        ADVERTISEMENT: 'Anúncio',
        MANUAL: 'Manual',
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este lead?')) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
            if (res.ok) {
                onUpdate();
            }
        } catch (error) {
            console.error('Erro ao excluir lead:', error);
        } finally {
            setDeleting(null);
        }
    };

    if (leads.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum lead encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">Comece criando um novo lead.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lead
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Origem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                            {lead.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                        {lead.city && <div className="text-sm text-gray-500">{lead.city}</div>}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{lead.phone}</div>
                                {lead.email && <div className="text-sm text-gray-500">{lead.email}</div>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                    {sourceLabels[lead.source as keyof typeof sourceLabels] || lead.source}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[lead.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                                    {statusLabels[lead.status as keyof typeof statusLabels] || lead.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a
                                    href={`/dashboard/crm/${lead.id}`}
                                    className="text-purple-600 hover:text-purple-900 mr-4"
                                >
                                    Ver
                                </a>
                                <button
                                    onClick={() => handleDelete(lead.id)}
                                    disabled={deleting === lead.id}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                    {deleting === lead.id ? 'Excluindo...' : 'Excluir'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
