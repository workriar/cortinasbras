'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Phone, Mail, MapPin, MessageCircle, ExternalLink, Calendar } from 'lucide-react';

interface Lead {
    id: number;
    name: string;
    phone: string;
    email?: string;
    city?: string;
    status: string;
    source: string;
    notes?: string;
    createdAt: string;
}

interface KanbanCardProps {
    lead: Lead;
    isDragging?: boolean;
}

const sourceLabels = {
    SITE: 'Site',
    WHATSAPP: 'WhatsApp',
    ADVERTISEMENT: 'Anúncio',
    MANUAL: 'Manual',
};

export default function KanbanCard({ lead, isDragging }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${isDragging ? 'shadow-xl ring-1 ring-gray-200' : ''
                }`}
        >
            {/* Header */}
            <div className="mb-3">
                <h4 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-black transition-colors uppercase tracking-tight">
                    {lead.name}
                </h4>
                <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Phone size={12} strokeWidth={2} />
                        <span className="font-medium">{lead.phone}</span>
                    </div>
                    {lead.email && (
                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                            <Mail size={12} strokeWidth={2} />
                            <span className="truncate">{lead.email}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* City */}
            {lead.city && (
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded w-fit mb-3">
                    <MapPin size={10} strokeWidth={2.5} />
                    <span>{lead.city}</span>
                </div>
            )}

            {/* Notes Preview */}
            {lead.notes && (
                <p className="text-[11px] text-gray-500 mb-4 line-clamp-2 leading-relaxed italic border-l-2 border-gray-100 pl-2">
                    "{lead.notes}"
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                        {sourceLabels[lead.source as keyof typeof sourceLabels] || lead.source}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-300 font-medium">
                    <Calendar size={10} />
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </div>
            </div>

            {/* Hidden Quick Actions on Default, show on hover? No, keep it clean. */}
            {/* Visual Action Indicators */}
            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                    href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onPointerDown={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-lg border border-emerald-100/50 hover:bg-emerald-100 transition-colors"
                >
                    <MessageCircle size={12} />
                    WhatsApp
                </a>
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded-lg border border-gray-200/50 hover:bg-gray-100 transition-colors"
                >
                    <ExternalLink size={12} />
                    Abrir
                </button>
            </div>
        </div>
    );
}
