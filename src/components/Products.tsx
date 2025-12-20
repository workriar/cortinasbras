"use client";

import { motion } from "framer-motion";
import { Scissors, Home, Bed, Check } from "lucide-react";

const products = [
    {
        title: "CORTINAS PRONTAS",
        description: "Modelos variados em tamanhos padrão, prontos para levar. Ideal para quem tem pressa e busca qualidade.",
        icon: Home,
        features: ["Entrega imediata", "Várias cores", "Modelos variados"],
        delay: 0.1,
    },
    {
        title: "CORTINAS SOB MEDIDA",
        description: "Nossa especialidade. Gaze de Linho, Blackout, Voil e mais. Projetos exclusivos para cada janela do seu lar.",
        icon: Scissors,
        features: ["Gaze de Linho", "Blackout", "Voil"],
        delay: 0.2,
    },
    {
        title: "CAMA • MESA • BANHO",
        description: "Enxovais premium que completam a decoração. Jogos de cama com fios egípcios e toalhas de alta absorção.",
        icon: Bed,
        features: ["Lençóis Premium", "Jogos de Cama", "Acessórios Nobres"],
        delay: 0.3,
    },
];

export default function Products() {
    return (
        <section id="produtos" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-extrabold text-brand-700 mb-6"
                    >
                        NOSSOS PRODUTOS
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-brand-700/80"
                    >
                        Escolha a solução ideal para seu espaço: <br />Tecidos, modelos e acabamentos pensados para você.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {products.map((product, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: product.delay }}
                            whileHover={{ y: -10 }}
                            className="bg-brand-50 p-8 rounded-3xl border border-brand-100 group transition-all hover:shadow-2xl hover:shadow-brand-500/10"
                        >
                            <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-brand-500/20">
                                <product.icon size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-brand-700 mb-4">{product.title}</h3>
                            <p className="text-brand-700/70 mb-8 min-h-[80px]">
                                {product.description}
                            </p>

                            <ul className="space-y-3 mb-8">
                                {product.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm font-medium text-brand-700">
                                        <Check size={16} className="text-brand-500" /> {feature}
                                    </li>
                                ))}
                            </ul>

                            <motion.a
                                href="#contato"
                                whileHover={{ gap: "12px" }}
                                className="flex items-center gap-2 font-bold text-brand-500 py-2 group/link"
                            >
                                Quero um orçamento
                                <div className="h-0.5 w-8 bg-brand-500 rounded-full transition-all group-hover/link:w-12" />
                            </motion.a>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl -ml-48 -mb-48" />
        </section>
    );
}
