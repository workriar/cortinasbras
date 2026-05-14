"use client";

import { motion } from "framer-motion";
import { Scissors, Home, Bed, Check, ArrowRight } from "lucide-react";

const products = [
    {
        title: "CORTINAS PRONTAS",
        description: "Soluções de elegância imediata. Modelos selecionados com dimensões padrão que unem a agilidade da entrega com a qualidade inquestionável de nossa fabricação própria.",
        icon: Home,
        image: "https://images.unsplash.com/photo-1513694203237-462467AspNetCore-dfdf788689?q=80&w=600&auto=format&fit=crop",
        alt: "Cortinas prontas de luxo para sala e quarto - Cortinas Brás",
        features: ["Entrega imediata", "Curadoria de cores exclusivas", "Tamanhos padrão de alta qualidade"],
        ctaLabel: "Ver Modelos",
        ctaLink: "#catalogo",
        delay: 0.1,
    },
    {
        title: "CORTINAS SOB MEDIDA",
        description: "A nossa maior especialidade. Projetos milimetricamente planejados para cada janela, utilizando os tecidos mais nobres do mundo para transformar seu ambiente em um refúgio de luxo.",
        icon: Scissors,
        image: "https://images.unsplash.com/photo-1617103233985-160a32 la-fdfdf788689?q=80&w=600&auto=format&fit=crop",
        alt: "Cortinas sob medida de alto padrão em São Paulo - Cortinas Brás",
        features: ["Projetos Exclusivos e Personalizados", "Tecidos Premium Importados", "Instalação Especializada e Impecável"],
        ctaLabel: "Solicitar Projeto",
        ctaLink: "#contato",
        delay: 0.2,
    },
    {
        title: "CAMA • MESA • BANHO",
        description: "Enxovais de luxo que elevam a experiência do lar. Algodão egípcio e tramas nobres que proporcionam o máximo de conforto, durabilidade e sofisticação.",
        icon: Bed,
        image: "https://images.unsplash.com/photo-1522771739773-599c5a5fL-fdfdf788689?q=80&w=600&auto=format&fit=crop",
        alt: "Enxovais de luxo algodão egípcio cama mesa e banho - Cortinas Brás",
        features: ["Fios Egípcios Autênticos", "Toque de Seda Natural", "Acabamento Nobre e Duradouro"],
        ctaLabel: "Explorar Linha",
        ctaLink: "https://wa.me/5511992891070",
        delay: 0.3,
    },
];

export default function Products() {
    return (
        <section id="produtos" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-600 text-xs font-bold uppercase tracking-widest mb-6 border border-brand-200"
                    >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                        </span>
                        Especialidades
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-brand-800 mb-6 tracking-tight"
                    >
                        Excelência em <span className="text-brand-500">Cada Detalhe</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 font-medium leading-relaxed"
                    >
                        Combinamos a tradição do Brás com a sofisticação da alta decoração.
                        Escolha a solução que melhor se adapta ao seu conceito de luxo.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {products.map((product, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: product.delay, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.alt}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl text-brand-600 shadow-lg">
                                    <product.icon size={24} />
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-2xl font-bold text-brand-800 mb-4 group-hover:text-brand-600 transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-3">
                                    {product.description}
                                </p>

                                <ul className="space-y-3 mb-10">
                                    {product.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                            <Check size={16} className="text-brand-500" /> {feature}
                                        </li>
                                    ))}
                                </ul>

                                <motion.a
                                    href={product.ctaLink}
                                    target={product.ctaLink.startsWith("http") ? "_blank" : undefined}
                                    rel={product.ctaLink.startsWith("http") ? "noopener noreferrer" : undefined}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95 group/link"
                                >
                                    {product.ctaLabel}
                                    <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                                </motion.a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />
        </section>
    );
}
