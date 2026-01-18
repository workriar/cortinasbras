'use client';
// import { useSession } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import KanbanBoard from '@/components/KanbanBoard';
import LeadForm from '@/components/LeadForm';
import { Plus, X, ListFilter } from 'lucide-react';

function CRMContent() {
    // const { data: session, status } = useSession(); // Removido: usando Auth Admin via Cookie
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showForm, setShowForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    // Simular status authenticated para não quebrar lógica visual se houver
    const status = 'authenticated';

    useEffect(() => {
        if (searchParams?.get('new') === 'true') {
            setShowForm(true);
        }
    }, [searchParams]);

    /* Removido redirect do NextAuth - Middleware cuida disso agora
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);
    */

    const handleLeadCreated = () => {
        setShowForm(false);
        setRefreshKey((prev) => prev + 1);
    };

    /* Removido loading state do NextAuth
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400"></div>
            </div>
        );
    }
    */

    return (
        <div className="space-y-4 h-full flex flex-col">
            {/* Header */}
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm order-first"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">{showForm ? 'Fechar' : 'Novo Registro'}</span>
                            <span className="sm:hidden">Novo</span>
                        </button>

                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight uppercase hidden sm:block">CRM</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            <ListFilter size={18} />
                            Filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Modal - More Elegant */}
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

            {/* Kanban Board Container */}
            <div className="overflow-hidden">
                <KanbanBoard key={refreshKey} />
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
