"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Package, X, Save } from "lucide-react";

interface Fabric {
    id: number;
    name: string;
    category: string;
    description: string;
    altText: string;
    colors: string;
    benefits: string;
    exclusive: boolean;
    placeholderImage: string;
}

export default function CatalogPage() {
    const [fabrics, setFabrics] = useState<Fabric[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        category: "Linho",
        description: "",
        altText: "",
        colors: "",
        benefits: "",
        exclusive: false,
        placeholderImage: "",
    });

    useEffect(() => {
        fetchFabrics();
    }, []);

    async function fetchFabrics() {
        setLoading(true);
        try {
            const res = await fetch('/api/fabrics');
            const data = await res.json();
            setFabrics(data);
        } catch (e) {
            console.error("Error fetching fabrics:", e);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const method = editingFabric ? 'PUT' : 'POST';
            const url = editingFabric ? `/api/fabrics/${editingFabric.id}` : '/api/fabrics';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingFabric(null);
                setFormData({ name: "", category: "Linho", description: "", altText: "", colors: "", benefits: "", exclusive: false, placeholderImage: "" });
                await fetchFabrics();
            }
        } catch (e) {
            console.error("Error saving fabric:", e);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Tem certeza que deseja excluir este tecido?")) return;
        try {
            const res = await fetch(`/api/fabrics/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchFabrics();
            }
        } catch (e) {
            console.error("Error deleting fabric:", e);
        }
    }

    const openAddModal = () => {
        setEditingFabric(null);
        setFormData({ name: "", category: "Linho", description: "", altText: "", colors: "", benefits: "", exclusive: false, placeholderImage: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (fabric: Fabric) => {
        setEditingFabric(fabric);
        setFormData({ ...fabric });
        setIsModalOpen(true);
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-brand-900 uppercase tracking-tight">Catálogo de Tecidos</h1>
                    <p className="text-slate-500 font-medium">Gerencie a curadoria de materiais premium do site</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 active:scale-95"
                >
                    <Plus size={20} /> Adicionar Tecido
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {fabrics.map((fabric) => (
                        <motion.div
                            key={fabric.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-900">{fabric.name}</h3>
                                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{fabric.category}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(fabric)} className="p-2 text-slate-400 hover:text-brand-600 transition-colors rounded-lg hover:bg-brand-50">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(fabric.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{fabric.description}</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-brand-500" />
                                <span className="text-xs font-medium text-slate-600">{fabric.exclusive ? 'Exclusivo' : 'Regular'}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h2 className="text-xl font-bold text-brand-900">
                                    {editingFabric ? 'Editar Tecido' : 'Novo Tecido'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Nome do Tecido</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                        placeholder="Ex: Linho Premium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Categoria</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                    >
                                        <option value="Linho">Linho</option>
                                        <option value="Voil">Voil</option>
                                        <option value="Blackout">Blackout</option>
                                        <option value="Oxford">Oxford</option>
                                        <option value="Forro">Forro</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Descrição</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                        placeholder="Descreva a textura, caimento e indicação de uso..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Alt Text (SEO)</label>
                                    <input
                                        required
                                        value={formData.altText}
                                        onChange={e => setFormData({ ...formData, altText: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                        placeholder="Ex: Tecido linho branco para cortinas"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Imagem (Caminho)</label>
                                    <input
                                        required
                                        value={formData.placeholderImage}
                                        onChange={e => setFormData({ ...formData, placeholderImage: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                        placeholder="/images/tecidos/exemplo.jpg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Cores (separadas por vírgula)</label>
                                    <input
                                        value={formData.colors}
                                        onChange={e => setFormData({ ...formData, colors: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                        placeholder="Branco, Off-White, Bege"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Benefícios (separados por vírgula)</label>
                                    <input
                                        value={formData.benefits}
                                        onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                        placeholder="Não encolhe, Alta durabilidade"
                                    />
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 md:col-span-2">
                                    <input
                                        type="checkbox"
                                        id="exclusive"
                                        checked={formData.exclusive}
                                        onChange={e => setFormData({ ...formData, exclusive: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                    />
                                    <label htmlFor="exclusive" className="text-sm font-bold text-slate-700 cursor-pointer">Marcar como Tecido Exclusivo</label>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 active:scale-95"
                                    >
                                        <Save size={18} /> {editingFabric ? 'Salvar Alterações' : 'Cadastrar Tecido'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </motion la-fdfdf788689>
            </AnimatePresence>
        </div>
    );
}
