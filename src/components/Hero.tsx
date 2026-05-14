"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

const slides = [
    { src: "/static/hero-bg-1.jpg" },
    { src: "/static/hero-bg-2.jpg" },
    { src: "/static/hero-bg-3.jpg" }
];

const promos = [
    { src: "/static/promo2.jpg" },
    { src: "/static/promo1.jpg" },
    { src: "/static/promo3.jpg" }
];

export default function Hero() {
    const [loading, setLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentPromo, setCurrentPromo] = useState(0);

    const handleGeneratePdf = async () => {
        setLoading(true);
        const lead = {
            nome: "Teste",
            telefone: "11999999999",
            id: 123,
            largura_parede: 2,
            altura_parede: 2.5,
            tecido: "Algodão",
            instalacao: "Sim",
            observacoes: "Nenhuma",
        };
        try {
            const res = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lead),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                if (process.env.NODE_ENV === 'development') {
                    console.error(`Failed to generate PDF: ${res.status} ${res.statusText}`, errorData);
                }
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentPromo((prev) => (prev + 1) % promos.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-20">
            {/* Background Carousel with Luxury Parallax */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.8, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                            duration: 2,
                            ease: [0.43, 0.13, 0.23, 0.96]
                        }}
                        className="absolute inset-0 bg-cover bg-center"
                    >
                        <Image
                            src={slides[currentSlide].src}
                            alt="Cortinas de Luxo"
                            fill
                            className="object-cover"
                            priority
                            quality={90}
                        />
                    </motion.div>
                </AnimatePresence>
                {/* High-End Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Subtile Fabric Texture Overlay */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
                    style={{
                        backgroundImage: 'url("https://www.transparenttextures.com/patterns/linen.png")',
                        backgroundSize: '300px'
                    }}
                />
            </div>

            <div className="container mx-auto px-6 pt-20 pb-12 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 1,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="space-y-10"
                >
                    {/* Premium Badge */}
                    <motion.div
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl text-brand-300 text-xs font-bold uppercase tracking-widest border border-white/20 shadow-2xl animate-gentle-float"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Sparkles size={14} className="text-brand-400" />
                        Referência em Luxo e Sofisticação
                    </motion.div>

                    {/* Typography Masterpiece */}
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight"
                        >
                            Cortinas <span className="text-brand-400">Sob Medida</span> <br />
                            <span className="text-white/70 font-light italic">em São Paulo</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="h-1 w-32 bg-brand-500 rounded-full"
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="text-lg md:text-xl text-white/80 font-light max-w-xl leading-relaxed"
                    >
                        Transformamos ambientes com a nobreza dos tecidos e a precisão do corte.
                        <strong className="text-white font-semibold"> Mais de 20 anos de tradição no Brás</strong>, entregando a exclusividade que seu lar merece.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                        <motion.a
                            href="#contato"
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(212 169 62 / 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-700 transition-all shadow-xl"
                        >
                            Solicitar Orçamento <ArrowRight size={18} />
                        </motion.a>
                        <motion.a
                            href="/catalog.pdf"
                            download="catalogo-cortinas-bras.pdf"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
                        >
                            <Sparkles size={18} /> Baixar Catálogo
                        </motion.a>
                        <motion.a
                            href="https://wa.me/5511992891070"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
                        >
                            <MessageCircle size={18} /> WhatsApp
                        </motion.a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-white/10">
                        {[
                            { label: "Fabricação", val: "Própria" },
                            { label: "Entrega", val: "Rápida" },
                            { label: "Qualidade", val: "Premium" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{item.label}</span>
                                <span className="text-white font-medium">{item.val}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Promo Gallery - Curated Look */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 1.2,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="relative aspect-[4/5] max-w-md mx-auto w-full lg:ml-auto"
                >
                    <div className="absolute -inset-4 bg-brand-500/10 blur-3xl rounded-full" />
                    <div className="absolute -inset-1 border border-brand-400/30 rounded-[2.5rem] animate-pulse" />

                    <div className="relative h-full bg-slate-900 p-3 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPromo}
                                initial={{ opacity: 0, scale: 1.1, rotate: 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.9, rotate: -2 }}
                                transition={{ duration: 0.8 }}
                                className="relative h-full w-full rounded-[2rem] overflow-hidden"
                            >
                                <Image
                                    src={promos[currentPromo].src}
                                    alt="Promoção de Luxo"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </motion.div>
                        </AnimatePresence>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                            {promos.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPromo(i)}
                                    className={`h-1.5 transition-all duration-500 rounded-full ${i === currentPromo ? "w-8 bg-brand-400" : "w-1.5 bg-white/30 hover:bg-white/60"}`}
                                />
                            ))}
                        </div
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
