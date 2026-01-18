import { motion } from "framer-motion";

export default function GuiaRapido() {
    return (
        <section id="guia-rapido" className="py-24 bg-brand-700 text-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-extrabold mb-8"
                >
                    Como Escolher a Cortina Ideal?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg max-w-3xl mx-auto mb-8"
                >
                    Escolher a cortina certa faz toda a diferença no ambiente:
                </motion.p>
                <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
                    <li className="flex items-start gap-2">
                        <span className="mt-1 w-2 h-2 bg-brand-500 rounded-full" />
                        <span><strong>Blackout:</strong> controle total da luz e mais conforto térmico</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1 w-2 h-2 bg-brand-500 rounded-full" />
                        <span><strong>Voil:</strong> leveza, luminosidade e sofisticação</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1 w-2 h-2 bg-brand-500 rounded-full" />
                        <span><strong>Linho:</strong> elegância natural e textura refinada</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1 w-2 h-2 bg-brand-500 rounded-full" />
                        <span><strong>Wave:</strong> visual moderno e contemporâneo</span>
                    </li>
                </ul>
                <motion.a
                    href="#contato"
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-brand-600 hover:bg-brand-500 rounded-full font-semibold"
                >
                    Nossa equipe ajuda você a escolher a melhor opção
                </motion.a>
            </div>
        </section>
    );
}
