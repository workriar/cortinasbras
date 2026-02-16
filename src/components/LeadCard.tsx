'use client';
import { User, ChevronRight } from 'lucide-react';
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

interface LeadCardProps {
    lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
    const statusLabels = {
        NEW: 'Novo',
        CONTACTED: 'Em Contato',
        PROPOSAL: 'Proposta',
        CLOSED_WON: 'Fechado',
        CLOSED_LOST: 'Arquivado',
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-brand-100 hover:border-brand-primary/20 transition-all hover:shadow-lg hover:shadow-gray-100 group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center text-brand-400 group-hover:text-brand-primary transition-colors">
                    <User size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-brand-900 uppercase tracking-tight leading-none mb-1">{lead.name}</h3>
                    <p className="text-[11px] text-brand-800 font-bold leading-none">{lead.phone}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {lead.city && (
                    <span className="hidden md:block text-[10px] font-black text-brand-400 uppercase tracking-widest">{lead.city}</span>
                )}
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-brand-800 bg-brand-50 px-2.5 py-1 rounded border border-brand-100">
                        {statusLabels[lead.status as keyof typeof statusLabels] || lead.status}
                    </span>
                    <Link
                        href={`/dashboard/crm`}
                        scroll={false}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-brand-300 group-hover:bg-brand-50 group-hover:text-brand-900 transition-all"
                    >
                        <ChevronRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
