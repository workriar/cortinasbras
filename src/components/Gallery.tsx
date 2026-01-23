"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";


const images = [
    { src: "/static/cortina-wave-1.jpg", alt: "Cortina Wave 1", span: "row-span-2" },
    { src: "/static/cortina-wave-2.jpg", alt: "Cortina Wave 2", span: "" },
    { src: "/static/enxoval-cama.jpg", alt: "Enxoval Premium", span: "col-span-1" },
    { src: "/static/hero-bg-2.jpg", alt: "Showroom", span: "col-span-2" },
];

export default function Gallery() {
    return (
        <section className="py-24 bg-brand-50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-700 mb-4 md:mb-6">Ambientes Inspiradores</h2>
                        <p className="text-base sm:text-lg text-brand-700/80">
                            Veja alguns de nossos projetos recentes onde a harmonia entre tecidos e iluminação cria experiências únicas.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.a
                            href="https://instagram.com/cortinasbras"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                            aria-label="Ver mais no Instagram"
                        >
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center">
                                <Instagram size={14} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Ver mais no Instagram</span>
                        </motion.a>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px] sm:auto-rows-[300px]">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.6 }}
                            className={`relative overflow-hidden rounded-3xl group cursor-pointer ${img.span} shadow-lg hover:shadow-2xl hover:shadow-brand-500/20 transition-all duration-500`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Gold Border Reveal */}
                            <div className="absolute inset-0 border-2 border-brand-300/0 group-hover:border-brand-300/100 transition-colors duration-500 rounded-3xl z-20 pointer-events-none" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300 mb-2">Projeto Exclusivo</p>
                                    <p className="text-2xl font-serif italic">{img.alt}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
