import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CortinasSobMedida() {
    return (
        <section id="cortinas-sob-medida" className="py-24 bg-brand-800 text-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-extrabold mb-8 text-center"
                >
                    Cortinas Sob Medida para Ambientes Elegantes
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg max-w-3xl mx-auto text-center mb-8"
                >
                    Cada ambiente merece um projeto exclusivo. Nossas cortinas sob medida são desenvolvidas com tecidos selecionados, acabamento premium e medidas exatas para valorizar salas, quartos, escritórios e espaços comerciais.
                </motion.p>
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-brand-500 rounded-full" /> Medição profissional
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-brand-500 rounded-full" /> Tecidos nobres: voil, linho, blackout e wave
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-brand-500 rounded-full" /> Acabamento impecável
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-brand-500 rounded-full" /> Projeto personalizado para seu ambiente
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-brand-500 rounded-full" /> Atendimento Exclusivo
                    </li>
                </ul>
                <motion.a
                    href="#contato"
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 rounded-full font-semibold"
                >
                    Solicitar cortina sob medida <ArrowRight size={20} />
                </motion.a>
            </div>
        </section>
    );
}
