'use client';
import { useState, useEffect } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
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

const COLUMNS = [
    { id: 'NEW', title: 'Novos', color: 'bg-stone-300' },
    { id: 'CONTACTED', title: 'Em Contato', color: 'bg-amber-200' },
    { id: 'PROPOSAL', title: 'Proposta Enviada', color: 'bg-indigo-200' },
    { id: 'CLOSED_WON', title: 'Fechados', color: 'bg-emerald-200' },
    { id: 'CLOSED_LOST', title: 'Arquivados', color: 'bg-gray-300' },
];

export default function KanbanBoard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/leads');
            const data = await res.json();
            setLeads(data.leads || data || []);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Erro ao carregar leads:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const leadId = active.id as number;
        let newStatus = over.id as string;

        // Verify if dropped on a column or another card
        // We use toString() for robust comparison between numbers and strings
        const isColumn = COLUMNS.some(col => col.id.toString() === over.id.toString());

        if (!isColumn) {
            // If not a column, it must be a card
            const overLead = leads.find(l => l.id.toString() === over.id.toString());
            if (overLead) {
                newStatus = overLead.status;
            } else {
                // Invalid drop target (neither column nor known lead)
                setActiveId(null);
                return;
            }
        }

        const lead = leads.find(l => l.id === leadId);
        if (!lead || lead.status === newStatus) {
            setActiveId(null);
            return;
        }

        // Store previous leads for potential revert
        const previousLeads = [...leads];

        // Atualizar localmente de forma otimista
        setLeads((prevLeads) =>
            prevLeads.map((l) =>
                l.id === leadId ? { ...l, status: newStatus } : l
            )
        );

        setActiveId(null);

        // Atualizar no servidor
        try {
            const res = await fetch(`/api/leads/${leadId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.details || 'Falha ao atualizar');
            }

        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('[Kanban] Erro na atualização:', error);
            }
            // Reverter estado visualmente
            setLeads(previousLeads);
            alert('Não foi possível salvar a alteração. O lead voltou ao estado anterior.');
        }
    };

    const getLeadsByStatus = (status: string) => {
        return leads.filter((lead) => lead.status === status);
    };

    const activeLead = leads.find((lead) => lead.id === activeId);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400"></div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 custom-scrollbar h-[calc(100dvh-180px)] md:h-[calc(100vh-220px)] min-h-[400px] md:min-h-[500px] snap-x snap-mandatory px-0.5 items-stretch">
                {COLUMNS.map((column) => {
                    const columnLeads = getLeadsByStatus(column.id);
                    return (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            color={column.color}
                            count={columnLeads.length}
                            leads={columnLeads}
                        />
                    );
                })}
            </div>

            <DragOverlay dropAnimation={null}>
                {activeLead ? (
                    <div className="rotate-3 scale-105 transition-transform">
                        <KanbanCard lead={activeLead} isDragging />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
