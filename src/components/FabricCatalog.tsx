"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Check, Sparkles, ExternalLink } from 'lucide-react';

export default function FabricCatalog() {
    const [fabrics, setFabrics] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('Linho');
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const categories = ['Linho', 'Voil', 'Blackout', 'Oxford', 'Forro'];

    useEffect(() => {
        setMounted(true);
        fetchFabrics();
    }, []);

    async function fetchFabrics() {
        try {
            const res = await fetch('/api/fabrics');
            const data = await res.json();

            if (data && data.length > 0) {
                // Formata os dados do banco
                const formatted = data.map((f: any) => ({
                    ...f,
                    colors: f.colors ? f.colors.split(',') : [],
                    benefits: f.benefits ? f.benefits.split(',') : []
                }));
                setFabrics(formatted);
            } else {
                // Fallback para o arquivo local se o banco estiver vazio
                const { fabrics: defaultFabrics } = await import('@/lib/fabrics');
                setFabrics(defaultFabrics);
            }
        } catch (e) {
            console.error('Failed to fetch fabrics, using fallback:', e);
            const { fabrics: defaultFabrics } = await import('@/lib/fabrics');
            setFabrics(defaultFabrics);
        } finally {
            setLoading(false);
        }
    }

    const filteredFabrics = fabrics.filter(f => f.category === activeCategory);

    if (!mounted) return null;

    return (
        <section id="catalogo" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-600 text-xs font-bold uppercase tracking-widest mb-6 border border-brand-200"
                    >
                        <Sparkles size={14} />
                        <span>Curadoria de Materiais</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-brand-800 mb-6 tracking-tight"
                    >
                        Catálogo de Tecidos <span className="text-brand-500">Premium</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 font-medium leading-relaxed"
                    >
                        A escolha do tecido é a alma de cada projeto. Nossa seleção rigorosa de fibras
                        naturais e sintéticas de alta performance garante a exclusividade e o caimento perfeito.
                    </motion.p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full font-bold transition-all duration-500 ease-out ${
                                activeCategory === cat
                                ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/40 scale-110'
                                : 'bg-white text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredFabrics.map((fabric) => (
                                <motion.div
                                    key={fabric.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={fabric.placeholderImage}
                                            alt={fabric.altText}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                        {fabric.exclusive && (
                                            <div className="absolute top-4 right-4">
                                                <span className="text-[10px] font-black uppercase bg-brand-500 text-white px-3 py-1 rounded-full shadow-lg">
                                                    Exclusivo
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-bold text-brand-800 mb-3 group-hover:text-brand-600 transition-colors">
                                            {fabric.name}
                                        </h3>

                                        <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">
                                            {fabric.description}
                                        </p>

                                        <div className="space-y-6 mb-8">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-3 tracking-widest">Cores Disponíveis</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {fabric.colors.map((color: string) => (
                                                        <span key={color} className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-md border border-slate-200">
                                                            {color}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-3 tracking-widest">Diferenciais</span>
                                                <ul className="grid grid-cols-1 gap-2">
                                                    {fabric.benefits.map((benefit: string, idx: number) => (
                                                        <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                            <Check size={14} className="text-brand-500" /> {benefit}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <a
                                                href={`https://wa.me/5511992891070?text=Olá! Gostaria de mais informações sobre o tecido ${fabric.name}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-3 w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95 group/btn"
                                            >
                                                <MessageCircle size={20} />
                                                <span>Solicitar Amostra</span>
                                                <ExternalLink size={16} className="opacity-50 group-hover/btn:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100/40 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-100 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-s-none" />
            </div>
        </section>
    );
}
