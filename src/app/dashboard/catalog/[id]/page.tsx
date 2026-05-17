"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, Sparkles, Check, Plus, Play, Pause, 
    Image as ImageIcon, Video, Layers, ShieldCheck
} from "lucide-react";

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

export default function FabricDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const fabricId = resolvedParams.id;

    const [fabric, setFabric] = useState<Fabric | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeMedia, setActiveMedia] = useState<'image' | 'video'>('image');
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedFabrics, setSelectedFabrics] = useState<number[]>([]);

    useEffect(() => {
        // Obter seleção atual do localStorage (para manter sincronia com o dashboard)
        try {
            const saved = localStorage.getItem("selected_fabrics");
            if (saved) {
                setSelectedFabrics(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Error loading selection:", e);
        }

        fetchFabricDetails();
    }, [fabricId]);

    async function fetchFabricDetails() {
        setLoading(true);
        try {
            // Tenta buscar da API
            const res = await fetch(`/api/fabrics/${fabricId}`);
            if (res.ok) {
                const data = await res.json();
                setFabric(data);
            } else {
                await fetchFallbackFabric();
            }
        } catch (e) {
            console.error("Error fetching fabric details, using fallback:", e);
            await fetchFallbackFabric();
        } finally {
            setLoading(false);
        }
    }

    async function fetchFallbackFabric() {
        // Fallback para o arquivo local se a API falhar
        const { fabrics: defaultFabrics } = await import('@/lib/fabrics');
        // A chave no fallback pode ser string (ex: 'linho-cru-premium') ou número. Buscamos por match aproximado.
        const found = defaultFabrics.find(f => String(f.id) === String(fabricId) || f.name.toLowerCase().includes(String(fabricId).toLowerCase()));
        
        if (found) {
            setFabric({
                id: Number(found.id) || 999,
                name: found.name,
                category: found.category,
                description: found.description,
                altText: found.altText,
                colors: Array.isArray(found.colors) ? found.colors.join(', ') : String(found.colors),
                benefits: Array.isArray(found.benefits) ? found.benefits.join(', ') : String(found.benefits),
                exclusive: found.exclusive || false,
                placeholderImage: found.placeholderImage,
            });
        }
    }

    const isSelected = fabric ? selectedFabrics.includes(fabric.id) : false;

    const handleToggleSelection = () => {
        if (!fabric) return;
        let updated: number[];
        if (isSelected) {
            updated = selectedFabrics.filter(id => id !== fabric.id);
        } else {
            updated = [...selectedFabrics, fabric.id];
        }
        setSelectedFabrics(updated);
        try {
            localStorage.setItem("selected_fabrics", JSON.stringify(updated));
        } catch (e) {
            console.error("Error saving selection:", e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-55 dark:bg-baroque-bg flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
                <p className="text-xs font-serif uppercase tracking-widest text-slate-400 dark:text-baroque-muted">Carregando Showroom Sensorial...</p>
            </div>
        );
    }

    if (!fabric) {
        return (
            <div className="min-h-screen bg-brand-55 dark:bg-baroque-bg flex flex-col items-center justify-center p-6 text-center space-y-6">
                <h2 className="text-3xl font-serif text-brand-900 dark:text-baroque-text">Fibra não encontrada</h2>
                <p className="text-slate-500 dark:text-baroque-muted max-w-sm text-sm">Este tecido nobre pode ter sido removido do catálogo ou está sob curadoria restrita.</p>
                <button 
                    onClick={() => router.push('/dashboard/catalog')}
                    className="px-6 py-3 bg-brand-900 dark:bg-baroque-surface text-white dark:text-baroque-gold border border-brand-800 dark:border-baroque-border text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-800 transition-all"
                >
                    Retornar ao Showroom
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 min-h-screen bg-brand-50 dark:bg-baroque-bg text-brand-900 dark:text-baroque-text transition-colors duration-500">
            {/* Header / Botão de Voltar */}
            <div className="mb-8 flex justify-between items-center">
                <button
                    onClick={() => router.push('/dashboard/catalog')}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-baroque-muted hover:text-brand-900 dark:hover:text-baroque-gold transition-colors duration-300"
                >
                    <ChevronLeft size={16} /> Voltar ao Catálogo
                </button>

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500 dark:text-baroque-gold bg-brand-100/50 dark:bg-baroque-surface/50 border border-brand-200/20 dark:border-baroque-border px-3 py-1.5 rounded-full">
                    Material Ref: #{fabric.id}
                </span>
            </div>

            {/* Split Grid Editorial */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                
                {/* Lado Esquerdo - Galeria de Mídia de Luxo */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-stone-100 dark:bg-baroque-surface border border-stone-200/25 dark:border-baroque-border group shadow-2xl">
                        
                        <AnimatePresence mode="wait">
                            {activeMedia === 'image' ? (
                                <motion.img
                                    key="image"
                                    src={fabric.placeholderImage}
                                    alt={fabric.altText}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                                />
                            ) : (
                                <motion.div
                                    key="video"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full relative"
                                >
                                    {/* Vídeo Simulando loop de caimento de tecido luxuoso */}
                                    <div className="absolute inset-0 bg-black/30 z-10 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white mb-4"
                                        >
                                            {isPlaying ? <Pause size={24} className="animate-pulse" /> : <Play size={24} />}
                                        </motion.div>
                                        <p className="text-white text-xs font-bold uppercase tracking-widest drop-shadow-md">
                                            {isPlaying ? 'Amostra em Movimento (Looping)' : 'Ver caimento da Cortina'}
                                        </p>
                                        <p className="text-white/70 text-[10px] mt-1 max-w-xs drop-shadow">
                                            Simulação de movimento e textura em luz natural de showroom.
                                        </p>
                                    </div>

                                    {/* Video Loop Element */}
                                    <video
                                        autoPlay={isPlaying}
                                        loop
                                        muted
                                        playsInline
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-full h-full object-cover cursor-pointer"
                                    >
                                        <source src="https://assets.mixkit.co/videos/preview/mixkit-womans-hands-choosing-fabrics-in-a-store-41584-large.mp4" type="video/mp4" />
                                    </video>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Badges de Destaque sobre imagem */}
                        <div className="absolute bottom-6 left-6 z-20 flex gap-2">
                            <span className="px-3 py-1 bg-white/95 dark:bg-baroque-surface/95 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-brand-900 dark:text-baroque-gold tracking-widest border border-brand-200/20 dark:border-baroque-border shadow">
                                {fabric.category}
                            </span>
                            {fabric.exclusive && (
                                <span className="px-3 py-1 bg-amber-500/95 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-white tracking-widest shadow">
                                    Edição Rara
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Controles do Carrossel de Mídia */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => { setActiveMedia('image'); setIsPlaying(false); }}
                            className={`flex-1 p-4 rounded-2xl border flex items-center gap-3 transition-all duration-300 ${
                                activeMedia === 'image'
                                    ? 'bg-brand-900 dark:bg-baroque-gold text-white dark:text-baroque-bg border-brand-900 dark:border-baroque-gold shadow-md'
                                    : 'bg-white dark:bg-baroque-surface text-stone-500 dark:text-baroque-muted border-stone-200/30 dark:border-baroque-border hover:bg-stone-50'
                            }`}
                        >
                            <ImageIcon size={16} />
                            <div className="text-left">
                                <p className="text-xs font-bold uppercase tracking-wider">Fotografia HD</p>
                                <p className="text-[9px] opacity-75 mt-0.5 leading-none">Visão macro de trama</p>
                            </div>
                        </button>

                        <button
                            onClick={() => { setActiveMedia('video'); setIsPlaying(true); }}
                            className={`flex-1 p-4 rounded-2xl border flex items-center gap-3 transition-all duration-300 ${
                                activeMedia === 'video'
                                    ? 'bg-brand-900 dark:bg-baroque-gold text-white dark:text-baroque-bg border-brand-900 dark:border-baroque-gold shadow-md'
                                    : 'bg-white dark:bg-baroque-surface text-stone-500 dark:text-baroque-muted border-stone-200/30 dark:border-baroque-border hover:bg-stone-50'
                            }`}
                        >
                            <Video size={16} />
                            <div className="text-left">
                                <p className="text-xs font-bold uppercase tracking-wider">Showroom em Vídeo</p>
                                <p className="text-[9px] opacity-75 mt-0.5 leading-none">Estudo de caimento fluido</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Lado Direito - Detalhes Editoriais e Ações */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                    
                    <div className="space-y-6">
                        {/* Título de Prestígio */}
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500 dark:text-baroque-gold flex items-center gap-2 mb-2">
                                <Sparkles size={12} /> Alta Curadoria São Paulo
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black font-serif text-brand-900 dark:text-baroque-text tracking-tight uppercase leading-none">
                                {fabric.name}
                            </h1>
                            <div className="w-12 h-[2px] bg-brand-500 dark:bg-baroque-gold mt-4"></div>
                        </div>

                        {/* Descrição Comercial */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-widest">
                                Descrição Sensorial & Trama
                            </h3>
                            <p className="text-sm text-stone-600 dark:text-baroque-text font-medium leading-relaxed">
                                {fabric.description}
                            </p>
                        </div>

                        {/* Cores e Detalhes Técnicos */}
                        <div className="grid grid-cols-2 gap-6 bg-white dark:bg-baroque-surface p-6 rounded-3xl border border-stone-100 dark:border-baroque-border shadow-sm">
                            <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 dark:text-baroque-muted leading-none block">Cores Nobres</span>
                                <span className="text-xs font-semibold text-stone-700 dark:text-baroque-text">{fabric.colors}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 dark:text-baroque-muted leading-none block">Categoria</span>
                                <span className="text-xs font-semibold text-stone-700 dark:text-baroque-text">{fabric.category}</span>
                            </div>
                        </div>

                        {/* Benefícios / Diferenciais */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-widest">
                                Diferenciais e Benefícios Premium
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {fabric.benefits.split(',').map((benefit, index) => (
                                    <span 
                                        key={index}
                                        className="px-3.5 py-2 bg-stone-100 dark:bg-baroque-bg border border-stone-200/30 dark:border-baroque-border rounded-xl text-xs font-semibold text-stone-600 dark:text-baroque-text flex items-center gap-1.5"
                                    >
                                        <Check size={12} className="text-brand-500 dark:text-baroque-gold" /> {benefit.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ações Comerciais Principais */}
                    <div className="space-y-4 pt-6 border-t border-stone-200/40 dark:border-baroque-border">
                        <button
                            onClick={handleToggleSelection}
                            className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-300 ${
                                isSelected
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-900 shadow-inner'
                                    : 'bg-brand-900 dark:bg-baroque-gold text-white dark:text-baroque-bg hover:bg-brand-800 shadow-lg hover:shadow-brand-950/20 active:scale-[0.98]'
                            }`}
                        >
                            {isSelected ? (
                                <>
                                    <Check size={14} strokeWidth={3} /> Adicionado à Curadoria
                                </>
                            ) : (
                                <>
                                    <Plus size={14} /> Selecionar para Catálogo Comercial
                                </>
                            )}
                        </button>

                        <div className="flex gap-4">
                            <div className="flex-1 flex items-center gap-2.5 p-3.5 bg-stone-50 dark:bg-baroque-surface/50 border border-stone-200/25 dark:border-baroque-border rounded-xl">
                                <ShieldCheck size={16} className="text-brand-500 dark:text-baroque-gold shrink-0" />
                                <div className="leading-none">
                                    <p className="text-[9px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-wider">Tecido Anti-Encolhimento</p>
                                    <p className="text-[8px] text-stone-500 dark:text-baroque-muted mt-0.5">Estabilidade térmica testada.</p>
                                </div>
                            </div>

                            <div className="flex-1 flex items-center gap-2.5 p-3.5 bg-stone-50 dark:bg-baroque-surface/50 border border-stone-200/25 dark:border-baroque-border rounded-xl">
                                <Layers size={16} className="text-brand-500 dark:text-baroque-gold shrink-0" />
                                <div className="leading-none">
                                    <p className="text-[9px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-wider">Alta Gramatura</p>
                                    <p className="text-[8px] text-stone-500 dark:text-baroque-muted mt-0.5">Excelente bloqueio visual.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}
