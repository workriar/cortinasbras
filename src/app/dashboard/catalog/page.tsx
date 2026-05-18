"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
    Plus, Pencil, Trash2, Package, X, Save, FileDown, 
    Search, Check, Eye, Grid, 
    LayoutList, Loader2, Sparkles, ChevronRight,
    ImageIcon, Video
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
    videoUrl?: string;
}

type ViewMode = 'grid' | 'list' | 'focus';

export default function CatalogPage() {
    const router = useRouter();
    const [fabrics, setFabrics] = useState<Fabric[]>([]);
    const [selectedFabrics, setSelectedFabrics] = useState<number[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // Filtros e Busca
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
    const [onlyExclusive, setOnlyExclusive] = useState(false);

    // Estado do Gerador de PDF
    const [pdfState, setPdfState] = useState<'idle' | 'preparing' | 'layout' | 'generating' | 'downloading' | 'success' | 'error'>('idle');
    const [pdfProgress, setPdfProgress] = useState(0);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'image') setUploadingImage(true);
        else setUploadingVideo(true);

        try {
            const data = new FormData();
            data.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                const result = await res.json();
                if (type === 'image') {
                    setFormData(prev => ({ ...prev, placeholderImage: result.url }));
                } else {
                    setFormData(prev => ({ ...prev, videoUrl: result.url }));
                }
            } else {
                alert('Erro ao enviar arquivo para o servidor.');
            }
        } catch (err) {
            console.error('Error uploading:', err);
            alert('Falha crítica na conexão ao fazer upload.');
        } finally {
            if (type === 'image') setUploadingImage(false);
            else setUploadingVideo(false);
        }
    };

    const categories = ["Todos", "Linho", "Voil", "Blackout", "Oxford", "Forro"];

    const [formData, setFormData] = useState({
        name: "",
        category: "Linho",
        description: "",
        altText: "",
        colors: "",
        benefits: "",
        exclusive: false,
        placeholderImage: "",
        videoUrl: "",
    });

    useEffect(() => {
        fetchFabrics();
        try {
            const saved = localStorage.getItem("selected_fabrics");
            if (saved) {
                setSelectedFabrics(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Error loading selection:", e);
        }
    }, []);

    async function fetchFabrics() {
        setLoading(true);
        try {
            const res = await fetch('/api/fabrics');
            const data = await res.json();
            
            if (Array.isArray(data) && data.length > 0) {
                setFabrics(data);
            } else {
                const { fabrics: defaultFabrics } = await import('@/lib/fabrics');
                const formattedFallback = defaultFabrics.map(f => ({
                    ...f,
                    colors: Array.isArray(f.colors) ? f.colors.join(', ') : f.colors,
                    benefits: Array.isArray(f.benefits) ? f.benefits.join(', ') : f.benefits,
                }));
                setFabrics(formattedFallback as any);
            }
        } catch (e) {
            console.error("Error fetching fabrics, using fallback:", e);
            const { fabrics: defaultFabrics } = await import('@/lib/fabrics');
            const formattedFallback = defaultFabrics.map(f => ({
                ...f,
                colors: Array.isArray(f.colors) ? f.colors.join(', ') : f.colors,
                benefits: Array.isArray(f.benefits) ? f.benefits.join(', ') : f.benefits,
            }));
            setFabrics(formattedFallback as any);
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
                setIsDrawerOpen(false);
                setEditingFabric(null);
                setFormData({ name: "", category: "Linho", description: "", altText: "", colors: "", benefits: "", exclusive: false, placeholderImage: "", videoUrl: "" });
                await fetchFabrics();
            }
        } catch (e) {
            console.error("Error saving fabric:", e);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Deseja realmente remover este tecido de luxo de seu showroom?")) return;
        try {
            const res = await fetch(`/api/fabrics/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchFabrics();
            }
        } catch (e) {
            console.error("Error deleting fabric:", e);
        }
    }

    const openAddDrawer = () => {
        setEditingFabric(null);
        setFormData({ name: "", category: "Linho", description: "", altText: "", colors: "", benefits: "", exclusive: false, placeholderImage: "", videoUrl: "" });
        setIsDrawerOpen(true);
    };

    const openEditDrawer = (fabric: Fabric) => {
        setEditingFabric(fabric);
        setFormData({
            name: fabric.name,
            category: fabric.category,
            description: fabric.description,
            altText: fabric.altText || "",
            colors: fabric.colors || "",
            benefits: fabric.benefits || "",
            exclusive: fabric.exclusive || false,
            placeholderImage: fabric.placeholderImage || "",
            videoUrl: fabric.videoUrl || "",
        });
        setIsDrawerOpen(true);
    };

    const handleSelectFabric = (id: number) => {
        setSelectedFabrics(prev => {
            const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
            try {
                localStorage.setItem("selected_fabrics", JSON.stringify(updated));
            } catch (e) {
                console.error("Error saving selection:", e);
            }
            return updated;
        });
    };

    const handleGeneratePdf = async () => {
        // Simulação elegante de progresso comercial
        setPdfState('preparing');
        setPdfProgress(15);
        
        setTimeout(() => {
            setPdfState('layout');
            setPdfProgress(40);
        }, 1200);

        setTimeout(() => {
            setPdfState('generating');
            setPdfProgress(75);
        }, 2500);

        setTimeout(async () => {
            setPdfState('downloading');
            setPdfProgress(90);
            
            try {
                // Link de download do catálogo completo de tecidos nativo (PDFKit)
                window.open('/api/catalog', '_blank');
                setPdfState('success');
                setPdfProgress(100);
            } catch {
                setPdfState('error');
            }

            setTimeout(() => {
                setPdfState('idle');
                setPdfProgress(0);
            }, 3000);
        }, 4000);
    };

    // Filtragem de tecidos com robustez
    const filteredFabrics = fabrics.filter(fabric => {
        const matchesSearch = fabric.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             fabric.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Todos" || fabric.category === selectedCategory;
        const matchesExclusive = !onlyExclusive || fabric.exclusive;
        return matchesSearch && matchesCategory && matchesExclusive;
    });

    return (
        <div className="p-4 md:p-8 space-y-10 min-h-screen transition-colors duration-500 bg-brand-50 dark:bg-baroque-bg text-brand-900 dark:text-baroque-text">
            
            {/* Header de Showroom Editorial */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-brand-200/40 dark:border-baroque-border pb-8">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600 dark:text-baroque-gold flex items-center gap-2 mb-2">
                        <Sparkles size={12} /> Alta Costura & Tecidos Nobres
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black font-serif text-brand-900 dark:text-baroque-text tracking-tight uppercase leading-none">
                        Showroom <span className="font-light italic text-brand-600 dark:text-baroque-gold">Digital</span>
                    </h1>
                    <p className="text-slate-500 dark:text-baroque-muted font-medium text-sm md:text-base mt-2">
                        Gerencie texturas nobres e exporte o catálogo de produtos de alta gama em PDF.
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleGeneratePdf}
                        disabled={pdfState !== 'idle'}
                        className="flex items-center gap-2.5 px-6 py-3.5 bg-brand-500 dark:bg-baroque-gold text-brand-950 border border-transparent rounded-xl font-bold hover:bg-brand-400 dark:hover:bg-baroque-gold/90 transition-all active:scale-[0.98] shadow-lg shadow-brand-950/10 text-xs tracking-widest uppercase font-serif disabled:opacity-50"
                    >
                        {pdfState === 'idle' ? (
                            <>
                                <FileDown size={16} /> Gerar Catálogo PDF
                            </>
                        ) : (
                            <>
                                <Loader2 size={16} className="animate-spin" /> {pdfProgress}%
                            </>
                        )}
                    </button>

                    <button
                        onClick={openAddDrawer}
                        className="flex items-center gap-2.5 px-6 py-3.5 bg-brand-900 dark:bg-baroque-surface text-white dark:text-baroque-gold border border-transparent dark:border-baroque-border rounded-xl font-bold hover:bg-brand-800 dark:hover:bg-baroque-bg transition-all active:scale-[0.98] shadow-lg shadow-brand-950/10 text-xs tracking-widest uppercase font-serif"
                    >
                        <Plus size={16} /> Inserir Novo Tecido
                    </button>
                </div>
            </div>

            {/* Barra de Filtros Editoriais & Visão de Visualização */}
            <div className="bg-white/60 dark:bg-baroque-surface/50 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-baroque-border flex flex-col xl:flex-row gap-6 justify-between items-center transition-all duration-300">
                
                {/* Categorias - Pílulas elegantes */}
                <div className="flex gap-1.5 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 custom-scrollbar scroll-smooth">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border whitespace-nowrap ${
                                selectedCategory === cat
                                    ? "bg-brand-900 dark:bg-baroque-gold text-white dark:text-baroque-bg border-brand-900 dark:border-baroque-gold"
                                    : "bg-white dark:bg-baroque-surface text-stone-500 dark:text-baroque-muted border-gray-100 dark:border-baroque-border hover:bg-stone-50 dark:hover:bg-baroque-bg"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Filtros Complementares */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    {/* Busca */}
                    <div className="relative w-full sm:w-64 group">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-baroque-muted" />
                        <input
                            type="text"
                            placeholder="Buscar textura..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-white dark:bg-baroque-bg border border-gray-100 dark:border-baroque-border rounded-xl outline-none focus:border-brand-500 dark:focus:border-baroque-gold focus:ring-1 focus:ring-brand-500 transition-all text-brand-900 dark:text-baroque-text placeholder-stone-400"
                        />
                    </div>

                    {/* Exclusivos Switch */}
                    <button
                        onClick={() => setOnlyExclusive(!onlyExclusive)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${
                            onlyExclusive
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-900"
                                : "bg-white dark:bg-baroque-bg text-stone-500 dark:text-baroque-muted border-gray-100 dark:border-baroque-border hover:bg-stone-50"
                        }`}
                    >
                        <Sparkles size={14} className={onlyExclusive ? "animate-pulse" : ""} />
                        Apenas Exclusivos
                    </button>

                    {/* Modo de Visualização */}
                    <div className="bg-stone-100 dark:bg-baroque-bg p-1 rounded-xl flex items-center gap-1 border border-transparent dark:border-baroque-border">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-baroque-surface shadow-sm text-brand-900 dark:text-baroque-gold' : 'text-stone-400 hover:text-stone-600'}`}
                            title="Visualização em Grade"
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-baroque-surface shadow-sm text-brand-900 dark:text-baroque-gold' : 'text-stone-400 hover:text-stone-600'}`}
                            title="Visualização Detalhada"
                        >
                            <LayoutList size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('focus')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'focus' ? 'bg-white dark:bg-baroque-surface shadow-sm text-brand-900 dark:text-baroque-gold' : 'text-stone-400 hover:text-stone-600'}`}
                            title="Foco Visual"
                        >
                            <Eye size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Principal do Showroom */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white dark:bg-baroque-surface rounded-3xl p-6 border border-gray-100 dark:border-baroque-border space-y-4 animate-pulse">
                            <div className="h-64 bg-stone-100 dark:bg-baroque-bg rounded-2xl w-full" />
                            <div className="h-4 bg-stone-100 dark:bg-baroque-bg rounded w-1/3" />
                            <div className="h-6 bg-stone-100 dark:bg-baroque-bg rounded w-3/4" />
                            <div className="h-4 bg-stone-100 dark:bg-baroque-bg rounded w-full" />
                        </div>
                    ))}
                </div>
            ) : filteredFabrics.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-baroque-surface/30 backdrop-blur-md rounded-3xl border border-dashed border-stone-200 dark:border-baroque-border text-center max-w-xl mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-baroque-bg flex items-center justify-center text-brand-600 dark:text-baroque-gold">
                        <Package size={20} />
                    </div>
                    <h3 className="text-xl font-bold font-serif text-brand-900 dark:text-baroque-text">Sem texturas correspondentes</h3>
                    <p className="text-stone-400 dark:text-baroque-muted text-xs leading-relaxed max-w-xs">
                        Refine seus filtros editoriais ou crie uma nova curadoria de tecidos no botão superior.
                    </p>
                </div>
            ) : (
                <div className={`grid gap-8 ${
                    viewMode === 'list' 
                        ? 'grid-cols-1' 
                        : viewMode === 'focus'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                    {filteredFabrics.map((fabric) => {
                        const isSelected = selectedFabrics.includes(fabric.id);
                        return (
                            <motion.div
                                key={fabric.id}
                                layout
                                className={`group relative bg-white dark:bg-baroque-surface rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col ${
                                    isSelected 
                                        ? 'border-brand-600 dark:border-baroque-gold ring-2 ring-brand-500/20 dark:ring-baroque-gold/20' 
                                        : 'border-stone-100 dark:border-baroque-border hover:shadow-2xl hover:shadow-brand-950/5 hover:-translate-y-1'
                                } ${viewMode === 'list' ? 'md:flex-row h-auto md:h-72' : ''}`}
                            >
                                {/* Imagem e Badge de Seleção */}
                                <div className={`relative bg-stone-50 dark:bg-baroque-bg overflow-hidden ${
                                    viewMode === 'list' 
                                        ? 'w-full md:w-[35%] h-64 md:h-full shrink-0' 
                                        : 'h-64 w-full'
                                }`}>
                                    <img 
                                        src={fabric.placeholderImage} 
                                        alt={fabric.altText || fabric.name}
                                        onClick={() => router.push(`/dashboard/catalog/${fabric.id}`)}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
                                    />
                                    
                                    {/* Glass Overlay Superior */}
                                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                                        <span className="px-3 py-1 bg-white/90 dark:bg-baroque-surface/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-brand-700 dark:text-baroque-gold tracking-widest border border-brand-100/20 dark:border-baroque-border shadow-sm">
                                            {fabric.category}
                                        </span>
                                        {fabric.exclusive && (
                                            <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase text-white tracking-widest shadow-sm">
                                                Exclusivo
                                            </span>
                                        )}
                                    </div>

                                    {/* Selectable Checkbox - Luxo */}
                                    <button
                                        onClick={() => handleSelectFabric(fabric.id)}
                                        className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                            isSelected 
                                                ? 'bg-brand-900 dark:bg-baroque-gold text-white dark:text-baroque-bg scale-110 shadow-lg' 
                                                : 'bg-white/80 hover:bg-white dark:bg-baroque-surface/85 dark:hover:bg-baroque-surface text-stone-400 hover:text-brand-900 shadow-md backdrop-blur-sm'
                                        }`}
                                    >
                                        {isSelected ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
                                    </button>

                                    {/* Ações Rápidas (Editar/Remover) */}
                                    <div className="absolute bottom-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <button 
                                            onClick={() => router.push(`/dashboard/catalog/${fabric.id}`)} 
                                            className="p-2 bg-white/95 hover:bg-brand-900 dark:bg-baroque-surface/95 dark:hover:bg-baroque-gold text-stone-700 hover:text-white dark:text-baroque-gold dark:hover:text-baroque-bg rounded-lg shadow-lg border border-transparent dark:border-baroque-border transition-all duration-300"
                                            title="Visualizar Tecido"
                                        >
                                            <Eye size={12} />
                                        </button>
                                        <button 
                                            onClick={() => openEditDrawer(fabric)} 
                                            className="p-2 bg-white/95 hover:bg-brand-900 dark:bg-baroque-surface/95 dark:hover:bg-baroque-gold text-stone-700 hover:text-white dark:text-baroque-gold dark:hover:text-baroque-bg rounded-lg shadow-lg border border-transparent dark:border-baroque-border transition-all duration-300"
                                            title="Editar Tecido"
                                        >
                                            <Pencil size={12} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(fabric.id)} 
                                            className="p-2 bg-white/95 hover:bg-red-600 dark:bg-baroque-surface/95 dark:hover:bg-red-950/40 text-stone-700 hover:text-white dark:text-baroque-gold dark:hover:text-red-400 rounded-lg shadow-lg border border-transparent dark:border-baroque-border transition-all duration-300"
                                            title="Remover Tecido"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>

                                {/* Conteúdo Editorial */}
                                {viewMode !== 'focus' && (
                                    <div className="p-6 flex-1 flex flex-col justify-between bg-white dark:bg-baroque-surface">
                                        <div className="space-y-3">
                                            <h3 
                                                onClick={() => router.push(`/dashboard/catalog/${fabric.id}`)}
                                                className="text-xl font-bold font-serif text-brand-900 dark:text-baroque-text hover:text-brand-600 dark:hover:text-baroque-gold transition-colors leading-tight cursor-pointer"
                                            >
                                                {fabric.name}
                                            </h3>
                                            <p className="text-xs text-stone-400 dark:text-baroque-muted font-medium line-clamp-3 leading-relaxed">
                                                {fabric.description}
                                            </p>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-stone-50 dark:border-baroque-border flex items-center justify-between">
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 dark:text-baroque-muted leading-none block">Cores</span>
                                                <span className="text-xs font-semibold text-stone-600 dark:text-baroque-text line-clamp-1">{fabric.colors}</span>
                                            </div>
                                            <button 
                                                onClick={() => router.push(`/dashboard/catalog/${fabric.id}`)}
                                                className="text-[10px] font-bold text-brand-600 dark:text-baroque-gold flex items-center gap-1 hover:underline"
                                            >
                                                {fabric.exclusive ? 'Alta Curadoria' : 'Disponível'} <ChevronRight size={10} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* BARRA FIXA DE CONVERSÃO COMERCIAL (Sticky PDF Generator) */}
            <AnimatePresence>
                {selectedFabrics.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-brand-950/95 dark:bg-baroque-surface/95 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-baroque-border shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 z-40"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-500/10 dark:bg-baroque-gold/10 border border-brand-500/20 dark:border-baroque-gold/20 flex items-center justify-center text-brand-400 dark:text-baroque-gold">
                                <Sparkles size={16} className="animate-spin" style={{ animationDuration: '4s' }} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold font-serif text-white tracking-wide uppercase">
                                    Catálogo em Construção
                                </h4>
                                <p className="text-[10px] text-brand-200 dark:text-baroque-muted font-medium mt-0.5 leading-none">
                                    {selectedFabrics.length} {selectedFabrics.length === 1 ? 'tecido selecionado' : 'tecidos selecionados'} • Capa & layout de luxo integrados.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => {
                                    setSelectedFabrics([]);
                                    try {
                                        localStorage.removeItem("selected_fabrics");
                                    } catch (e) {
                                        console.error("Error clearing selection:", e);
                                    }
                                }}
                                className="px-4 py-3 rounded-xl text-stone-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-all w-1/2 md:w-auto"
                            >
                                Limpar
                            </button>

                            <button
                                onClick={handleGeneratePdf}
                                disabled={pdfState !== 'idle'}
                                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all relative overflow-hidden ${
                                    pdfState === 'idle'
                                        ? 'bg-brand-500 dark:bg-baroque-gold text-brand-950 hover:bg-brand-400 shadow-lg'
                                        : 'bg-stone-800 text-stone-400 border border-stone-700'
                                }`}
                            >
                                {pdfState === 'idle' && (
                                    <>
                                        <FileDown size={14} /> Gerar Catálogo Premium
                                    </>
                                )}
                                {pdfState === 'preparing' && (
                                    <>
                                        <Loader2 size={14} className="animate-spin text-brand-500" /> Preparando curadoria...
                                    </>
                                )}
                                {pdfState === 'layout' && (
                                    <>
                                        <Loader2 size={14} className="animate-spin text-brand-500" /> Organizando páginas...
                                    </>
                                )}
                                {pdfState === 'generating' && (
                                    <>
                                        <Loader2 size={14} className="animate-spin text-brand-500" /> Tecendo PDF...
                                    </>
                                )}
                                {pdfState === 'downloading' && (
                                    <>
                                        <Loader2 size={14} className="animate-spin text-brand-500" /> Baixando catálogo...
                                    </>
                                )}
                                {pdfState === 'success' && (
                                    <>
                                        <Check size={14} className="text-emerald-500 animate-bounce" /> Catálogo Pronto!
                                    </>
                                )}

                                {/* Barra de Progresso Real */}
                                {pdfProgress > 0 && pdfState !== 'success' && (
                                    <div 
                                        className="absolute bottom-0 left-0 h-1 bg-brand-500 dark:bg-baroque-gold transition-all duration-500" 
                                        style={{ width: `${pdfProgress}%` }}
                                    />
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SIDEBAR DRAWER - CADASTRO / EDIÇÃO DE LUXO */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        {/* Backdrop de vidro */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Painel Lateral Deslizante */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white dark:bg-baroque-surface z-50 shadow-2xl border-l border-brand-100/20 dark:border-baroque-border p-8 flex flex-col justify-between overflow-y-auto"
                        >
                            <div className="space-y-8">
                                {/* Top Header */}
                                <div className="flex justify-between items-center border-b border-brand-100/20 dark:border-baroque-border pb-4">
                                    <div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-500 dark:text-baroque-gold">Painel Curatorial</span>
                                        <h2 className="text-2xl font-bold font-serif text-brand-900 dark:text-baroque-text mt-1">
                                            {editingFabric ? 'Editar Fibra Nobre' : 'Inserir Nova Fibra'}
                                        </h2>
                                    </div>
                                    <button 
                                        onClick={() => setIsDrawerOpen(false)} 
                                        className="p-2 text-stone-400 hover:text-brand-900 dark:hover:text-white rounded-lg transition-colors border border-transparent hover:border-stone-100 dark:hover:border-baroque-border"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} id="fabric-form" className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-widest leading-none block">Nome do Material</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-baroque-border bg-white dark:bg-baroque-bg focus:ring-1 focus:ring-brand-500 outline-none transition-all text-xs font-semibold text-brand-900 dark:text-baroque-text"
                                            placeholder="Ex: Slub Linho Premium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-widest leading-none block">Família / Categoria</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-baroque-border bg-white dark:bg-baroque-bg focus:ring-1 focus:ring-brand-500 outline-none transition-all text-xs font-semibold text-brand-900 dark:text-baroque-text"
                                            >
                                                <option value="Linho">Linho</option>
                                                <option value="Voil">Voil</option>
                                                <option value="Blackout">Blackout</option>
                                                <option value="Oxford">Oxford</option>
                                                <option value="Forro">Forro</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-widest leading-none block">SEO Alt Text</label>
                                            <input
                                                required
                                                value={formData.altText}
                                                onChange={e => setFormData({ ...formData, altText: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-baroque-border bg-white dark:bg-baroque-bg focus:ring-1 focus:ring-brand-500 outline-none transition-all text-xs font-semibold text-brand-900 dark:text-baroque-text"
                                                placeholder="Ex: Tecido linho marrom..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-widest leading-none block">Descrição Sensorial & Comercial</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-baroque-border bg-white dark:bg-baroque-bg focus:ring-1 focus:ring-brand-500 outline-none transition-all text-xs font-semibold text-brand-900 dark:text-baroque-text leading-relaxed"
                                            placeholder="Descreva o toque, trama, caimento natural da fibra..."
                                        />
                                    </div>

                                    {/* Uploader de Imagem Premium */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-widest leading-none block">Imagem da Fibra Nobre (Showroom & PDF)</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="border-2 border-dashed border-stone-200 dark:border-baroque-border rounded-xl p-4 flex flex-col items-center justify-center bg-stone-50/50 dark:bg-baroque-bg/50 relative overflow-hidden transition-all hover:border-brand-500 dark:hover:border-baroque-gold">
                                                {formData.placeholderImage ? (
                                                    <div className="w-full h-24 relative rounded-lg overflow-hidden group">
                                                        <img src={formData.placeholderImage} alt="Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="text-[8px] font-bold text-white uppercase tracking-wider">Alterar</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center py-2 text-stone-400 dark:text-baroque-muted">
                                                        <ImageIcon size={20} className="mb-1" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wider">Carregar Foto HD</span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => handleFileUpload(e, 'image')}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    disabled={uploadingImage}
                                                />
                                                {uploadingImage && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                        <Loader2 size={16} className="animate-spin text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2 flex flex-col justify-center">
                                                <input
                                                    required
                                                    value={formData.placeholderImage}
                                                    onChange={e => setFormData({ ...formData, placeholderImage: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-baroque-border bg-white dark:bg-baroque-bg focus:ring-1 focus:ring-brand-500 outline-none transition-all text-xs font-semibold text-brand-900 dark:text-baroque-text"
                                                    placeholder="URL ou Caminho da Imagem"
                                                />
                                                <span className="text-[8px] font-medium text-stone-400 block">Arraste a foto acima ou digite/cole o caminho estático.</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Uploader de Vídeo Premium */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-widest leading-none block">Vídeo de Caimento Real (Loop Showroom)</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="border-2 border-dashed border-stone-200 dark:border-baroque-border rounded-xl p-4 flex flex-col items-center justify-center bg-stone-50/50 dark:bg-baroque-bg/50 relative overflow-hidden transition-all hover:border-brand-500 dark:hover:border-baroque-gold">
                                                {formData.videoUrl ? (
                                                    <div className="w-full h-24 relative rounded-lg overflow-hidden group">
                                                        <video src={formData.videoUrl} loop muted autoPlay className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="text-[8px] font-bold text-white uppercase tracking-wider">Alterar</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center py-2 text-stone-400 dark:text-baroque-muted">
                                                        <Video size={20} className="mb-1" />
                                                        <span className="text-[9px] font-bold uppercase tracking-wider">Carregar Vídeo Showroom</span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={e => handleFileUpload(e, 'video')}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    disabled={uploadingVideo}
                                                />
                                                {uploadingVideo && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                        <Loader2 size={16} className="animate-spin text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2 flex flex-col justify-center">
                                                <input
                                                    value={formData.videoUrl}
                                                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-baroque-border bg-white dark:bg-baroque-bg focus:ring-1 focus:ring-brand-500 outline-none transition-all text-xs font-semibold text-brand-900 dark:text-baroque-text"
                                                    placeholder="URL ou Caminho do Vídeo"
                                                />
                                                <span className="text-[8px] font-medium text-stone-400 block">Envie o arquivo MP4/WebM do caimento ou cole um link externo.</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-widest leading-none block">Cores Disponíveis (separadas por vírgula)</label>
                                            <input
                                                value={formData.colors}
                                                onChange={e => setFormData({ ...formData, colors: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-baroque-border bg-white dark:bg-baroque-bg focus:ring-1 focus:ring-brand-500 outline-none transition-all text-xs font-semibold text-brand-900 dark:text-baroque-text"
                                                placeholder="Branco, Palha, Off-White"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase text-stone-400 dark:text-baroque-muted tracking-widest leading-none block">Diferenciais (separados por vírgula)</label>
                                            <input
                                                value={formData.benefits}
                                                onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-baroque-border bg-white dark:bg-baroque-bg focus:ring-1 focus:ring-brand-500 outline-none transition-all text-xs font-semibold text-brand-900 dark:text-baroque-text"
                                                placeholder="Caimento Fluido, Toque Suave"
                                            />
                                        </div>
                                    </div>

                                    {/* Toggle Exclusivo */}
                                    <div 
                                        onClick={() => setFormData({ ...formData, exclusive: !formData.exclusive })}
                                        className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                            formData.exclusive 
                                                ? 'bg-amber-500/10 border-amber-300 dark:border-amber-900 text-amber-600 dark:text-amber-400' 
                                                : 'bg-stone-50 dark:bg-baroque-bg border-stone-200 dark:border-baroque-border text-stone-500 dark:text-baroque-muted'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Sparkles size={16} />
                                            <span className="text-xs font-bold uppercase tracking-wider">Peça Rara & Exclusiva</span>
                                        </div>
                                        <div className={`w-10 h-6 rounded-full p-1 transition-all ${formData.exclusive ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'}`}>
                                            <div className={`w-4 h-4 rounded-full bg-white transition-all ${formData.exclusive ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Bottom CTA */}
                            <div className="border-t border-brand-100/20 dark:border-baroque-border pt-6 mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="px-6 py-3 rounded-xl text-stone-500 hover:text-brand-900 dark:hover:text-white text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    Descartar
                                </button>
                                <button
                                    type="submit"
                                    form="fabric-form"
                                    className="flex items-center gap-2 px-8 py-3.5 bg-brand-900 dark:bg-baroque-gold text-white dark:text-baroque-bg border border-transparent dark:border-baroque-border rounded-xl font-bold hover:bg-brand-800 dark:hover:bg-baroque-bg shadow-lg shadow-brand-950/10 text-xs tracking-widest uppercase transition-all"
                                >
                                    <Save size={14} /> {editingFabric ? 'Confirmar Ajustes' : 'Salvar no Showroom'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
