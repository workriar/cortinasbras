"use client";

import { motion } from "framer-motion";
import { Bed, Sparkles, Heart } from "lucide-react";

export default function Enxovais() {
    return (
        <section id="enxovais" className="py-24 bg-gradient-to-b from-white to-brand-50/30 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-extrabold text-brand-700 mb-6"
                    >
                        Enxovais Premium (Cama, Mesa e Banho)
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-brand-900/80 font-medium"
                    >
                        Transforme sua casa com enxovais de alta qualidade. Lençóis com fios egípcios,
                        toalhas de banho premium e jogos de cama que unem conforto e sofisticação.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Bed,
                            title: "Jogos de Cama",
                            description: "Lençóis com fios egípcios de alta contagem, proporcionando maciez e durabilidade incomparáveis.",
                            features: ["Fios Egípcios", "Alta Durabilidade", "Cores Variadas"]
                        },
                        {
                            icon: Sparkles,
                            title: "Toalhas Premium",
                            description: "Toalhas de banho com alta absorção e toque aveludado, perfeitas para o seu conforto diário.",
                            features: ["Alta Absorção", "Toque Macio", "Secagem Rápida"]
                        },
                        {
                            icon: Heart,
                            title: "Mesa Posta",
                            description: "Toalhas de mesa e guardanapos que elevam a elegância das suas refeições especiais.",
                            features: ["Design Exclusivo", "Tecidos Nobres", "Acabamento Perfeito"]
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-3xl border border-brand-100 group transition-all hover:shadow-2xl hover:shadow-brand-500/10"
                        >
                            <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-brand-500/20">
                                <item.icon size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-brand-700 mb-4">{item.title}</h3>
                            <p className="text-brand-700/70 mb-6 min-h-[80px]">
                                {item.description}
                            </p>

                            <ul className="space-y-2 mb-6">
                                {item.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm font-medium text-brand-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <motion.a
                                href="https://wa.me/5511992891070"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ gap: "12px" }}
                                className="flex items-center gap-2 font-bold text-brand-500 py-2 group/link"
                            >
                                Falar no WhatsApp
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
