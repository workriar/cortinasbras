"use client";

import { motion } from "framer-motion";
import { History, Award, Users } from "lucide-react";

const stats = [
    { icon: History, label: "20+", description: "Anos de Experiência" },
    { icon: Award, label: "100%", description: "Produção Própria" },
    { icon: Users, label: "5.000+", description: "Clientes Satisfeitos" },
];

export default function About() {
    return (
        <section id="sobre" className="py-24 bg-brand-700 text-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-brand-300">Sobre a BIAESTRELAR</h2>
                        <div className="space-y-4 sm:space-y-6 text-brand-100 text-base sm:text-lg leading-relaxed">
                            <p>
                                Desde 2003, a <strong>CORTINAS BRÁS</strong> é sinônimo de excelência em decoração de ambientes. Fundada como empresa familiar no tradicional bairro do Brás, em São Paulo, crescemos junto com nossos clientes, sempre mantendo nossos valores de qualidade, honestidade e dedicação.
                            </p>
                        </div>
                        <div className="space-y-4 sm:space-y-6 text-brand-100 text-base sm:text-lg leading-relaxed">
                            <p>
                                Sendo,<strong>sinônimo de excelência</strong>em decoração de ambientes. Fundada como empresa familiar no tradicional bairro do Brás, em São Paulo, crescemos junto com nossos clientes, sempre mantendo nossos valores de qualidade, honestidade e dedicação.
                            </p>
                            <p>
                                Com produção 100% própria e equipe especializada, transformamos cada projeto em uma experiência única, do primeiro contato até a entrega final.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm">
                                    <stat.icon className="text-brand-300 mb-4" size={32} />
                                    <p className="font-bold text-xl mb-1">{stat.label}</p>
                                    <p className="text-xs text-brand-100/60">{stat.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-square bg-brand-500/20 rounded-full blur-3xl absolute inset-0 animate-pulse" />
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                            <img
                                src="/static/hero-bg-3.jpg"
                                alt="Equipe Cortinas Brás"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-brand-500/20 mix-blend-overlay" />
                        </div>
                        {/* Quote badge */}
                        <div className="absolute -bottom-6 -left-6 bg-brand-500 p-8 rounded-2xl shadow-xl z-20 hidden md:block max-w-[240px]">
                            <p className="text-sm italic font-medium">
                                "Não vendemos apenas cortinas, criamos o ambiente perfeito para seus melhores momentos."
                            </p>
                            <p className="text-xs mt-4 font-bold uppercase tracking-widest text-brand-100">Cortinas Brás</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>
        </section>
    );
}
