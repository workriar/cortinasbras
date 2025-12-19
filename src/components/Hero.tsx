"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

const slides = [
    "/static/hero-bg-1.jpg",
    "/static/hero-bg-2.jpg",
    "/static/hero-bg-3.jpg",
];

const promos = [
    "/static/promo2.jpg",
    "/static/promo1.jpg",
    "/static/promo3.jpg",
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
        <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-20">
            {/* Background Carousel */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[currentSlide]})` }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            <div className="container mx-auto px-6 pt-24 pb-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-brand-300 text-sm font-semibold border border-white/10">
                        <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                        Tradição com estilo para o seu ambiente
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                        Transforme seu ambiente —{" "}
                        <span className="text-brand-300 relative">
                            cortinas sob medida
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-xl text-gray-200 max-w-lg leading-relaxed">
                        Renove sua casa com cortinas sob medida, feitas para você.
                        Especialistas com mais de 20 anos em São Paulo:
                        Atendimento personalizado, fabricação própria e instalação especializada.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <motion.a
                            href="#contato"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary flex items-center gap-2 px-8 py-4"
                        >
                            Solicitar Orçamento <ArrowRight size={20} />
                        </motion.a>
                        <motion.button
                            onClick={handleGeneratePdf}
                            disabled={loading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary flex items-center gap-2 px-8 py-4"
                        >
                            {loading ? 'Processando...' : 'Gerar PDF & Email'}
                        </motion.button>
                        <motion.a
                            href="https://wa.me/5511992891070"
                            target="_blank"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-whatsapp flex items-center gap-2 px-8 py-4"
                        >
                            <MessageCircle size={20} /> WhatsApp Direto
                        </motion.a>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8">
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

                {/* Promo Carousel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-[4/5] max-w-md mx-auto w-full lg:ml-auto"
                >
                    <div className="absolute -inset-4 bg-brand-500/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative h-full bg-white/5 backdrop-blur-sm p-4 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPromo}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="relative h-full w-full"
                            >
                                <Image
                                    src={promos[currentPromo]}
                                    alt="Oferta Especial"
                                    fill
                                    className="object-cover rounded-2xl"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Indicators */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                            {promos.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === currentPromo ? "w-8 bg-brand-500" : "w-2 bg-white/20"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
