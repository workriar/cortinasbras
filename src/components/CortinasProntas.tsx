import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CortinasProntas() {
    return (
        <section id="cortinas-prontas" className="py-24 bg-brand-900 text-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-extrabold mb-8 text-center"
                >
                    Cortinas Prontas com Entrega Rápida
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg max-w-3xl mx-auto text-center mb-8"
                >
                    Precisa de praticidade? Conheça nossa linha de cortinas prontas, ideais para quem deseja renovar o ambiente com rapidez, qualidade e excelente custo‑benefício.
                </motion.p>
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-brand-500 rounded-full" /> Modelos modernos e versáteis
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-brand-500 rounded-full" /> Blackout, voil e tecidos decorativos
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-brand-500 rounded-full" /> Diversos tamanhos e cores
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-brand-500 rounded-full" /> Diversas Opções
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-brand-500 rounded-full" /> Entrega rápida
                    </li>
                </ul>
                <motion.a
                    href="#contato"
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 rounded-full font-semibold"
                >
                    Ver cortinas prontas disponíveis <ArrowRight size={20} />
                </motion.a>
            </div>
        </section>
    );
}
