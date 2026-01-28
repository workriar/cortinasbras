"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

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
    const router = useRouter();

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
                console.error(`Failed to generate PDF: ${res.status} ${res.statusText}`, errorData);
            } else {
                console.log('PDF generated and email sent');
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentPromo, setCurrentPromo] = useState(0);

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
        <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-16">
            {/* Background Carousel with Parallax */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.7, scale: 1 }}
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
                            quality={85}
                        />
                    </motion.div>
                </AnimatePresence>
                {/* Gradient Overlay with Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-900/20" />

                {/* Decorative Elements - Simulating Fabric Texture */}
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                    <div className="absolute inset-0 animate-fabric-wave"
                        style={{
                            background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(212, 169, 62, 0.1) 10px, rgba(212, 169, 62, 0.1) 11px)'
                        }}
                    />
                </div>
            </div>

            <div className="container mx-auto px-6 pt-32 pb-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 1,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="space-y-8"
                >
                    {/* Badge with Gentle Float */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-brand-300 text-sm font-semibold border border-white/20 shadow-premium animate-gentle-float"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                        Atendimento em toda São Paulo e região metropolitana
                    </motion.div>

                    {/* Title with Shimmer Effect - SEO Optimized H1 */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="block"
                        >
                            Cortinas Sob Medida em São Paulo
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="relative inline-block text-shimmer text-brand-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                        >
                            e Fábrica no Brás
                            <svg className="absolute -bottom-2 left-0 w-full opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <motion.path
                                    d="M0 5 Q 25 0, 50 5 T 100 5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
                                />
                            </svg>
                        </motion.span>
                    </h1>

                    {/* Description with Fade In - Local SEO Keywords */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="text-base sm:text-lg md:text-xl text-white !text-white font-medium max-w-lg leading-relaxed"
                    >
                        Especialistas em cortinas sob medida, cortinas prontas e enxovais de luxo com <strong className="text-brand-300">mais de 20 anos de tradição em São Paulo</strong>.
                        Atendemos toda a <strong className="text-brand-300">capital paulista e região metropolitana</strong> incluindo Zona Leste, Zona Sul, Zona Norte, Zona Oeste, ABC Paulista e Grande São Paulo.
                        Showroom no Brás com fabricação própria e entrega rápida.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4">
                        <motion.a
                            href="#contato"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
                        >
                            Solicitar Orçamento <ArrowRight size={20} />
                        </motion.a>
                        <motion.button
                            onClick={handleGeneratePdf}
                            disabled={loading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
                        >
                            {loading ? 'Processando...' : 'Gerar PDF & Email'}
                        </motion.button>
                        <motion.a
                            href="https://wa.me/5511992891070"
                            target="_blank"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-whatsapp flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
                        >
                            <MessageCircle size={20} /> WhatsApp Direto
                        </motion.a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-8">
                        {[
                            "Fabricação própria",
                            "Entrega em até 48h",
                            "Materiais de alta qualidade",
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-white/80 text-sm font-medium">
                                <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                                </div>
                                {feature}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Promo Carousel - Premium Design */}
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
                    {/* Animated Glow Background */}
                    <div className="absolute -inset-6 bg-gradient-to-r from-brand-500/20 via-brand-300/20 to-brand-500/20 blur-3xl rounded-full animate-luxury-glow" />

                    {/* Decorative Ring */}
                    <div className="absolute -inset-2 border-2 border-brand-300/20 rounded-3xl animate-delicate-rotate"
                        style={{ animationDuration: '30s' }}
                    />

                    {/* Main Card */}
                    <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/20 overflow-hidden shadow-premium-lg">
                        {/* Shimmer Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[silk-shimmer_4s_linear_infinite]" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPromo}
                                initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                                transition={{
                                    duration: 0.7,
                                    ease: [0.43, 0.13, 0.23, 0.96]
                                }}
                                className="relative h-full w-full"
                            >
                                <Image
                                    src={promos[currentPromo].src}
                                    alt="Oferta Especial"
                                    fill
                                    className="object-cover rounded-2xl shadow-2xl"
                                    priority
                                />

                                {/* Subtle Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Elegant Indicators */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                            {promos.map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`h-2 rounded-full transition-all duration-500 ${i === currentPromo
                                        ? "w-10 bg-brand-500 shadow-lg shadow-brand-500/50"
                                        : "w-2 bg-white/30 hover:bg-white/50"
                                        }`}
                                    whileHover={{ scale: 1.2 }}
                                    onClick={() => setCurrentPromo(i)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
