'use client';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

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

interface KanbanColumnProps {
    id: string;
    title: string;
    color: string;
    count: number;
    leads: Lead[];
}

export default function KanbanColumn({ id, title, color, count, leads }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`flex-shrink-0 w-[85vw] sm:w-80 lg:w-96 bg-gray-50/50 rounded-2xl p-4 transition-all border border-transparent snap-center flex flex-col h-full ${isOver ? 'bg-gray-100/80 border-gray-200' : ''
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-1 shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-6 rounded-full ${color}`}></div>
                    <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500">{title}</h3>
                </div>
                <span className="bg-white border border-gray-100 px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-400 shadow-sm">
                    {count}
                </span>
            </div>

            {/* Cards Container */}
            <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4 min-h-0 flex-1 overflow-y-auto custom-scrollbar pr-2 pt-2">
                    {leads.map((lead) => (
                        <KanbanCard key={lead.id} lead={lead} />
                    ))}
                    {count === 0 && !isOver && (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                Sem registros
                            </p>
                        </div>
                    )}
                    {isOver && count === 0 && (
                        <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl bg-white/50 animate-pulse" />
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
