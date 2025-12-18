"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-extrabold text-brand-700 mb-6">Ambientes Inspiradores</h2>
                        <p className="text-lg text-brand-700/80">
                            Veja alguns de nossos projetos recentes onde a harmonia entre tecidos e iluminação cria experiências únicas.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <motion.a
                            href="https://instagram.com/cortinasbras"
                            target="_blank"
                            whileHover={{ scale: 1.05 }}
                            className="px-6 py-3 border border-brand-500 text-brand-500 rounded-full font-bold hover:bg-brand-500 hover:text-white transition-all"
                        >
                            Ver mais no Instagram
                        </motion.a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[800px] md:h-[600px]">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative overflow-hidden rounded-3xl group cursor-pointer ${img.span}`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                <div className="text-white">
                                    <p className="text-sm font-medium uppercase tracking-wider mb-1">Projeto</p>
                                    <p className="text-xl font-bold">{img.alt}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
