import { motion } from "framer-motion";
import { Bed, Shirt, Coffee } from "lucide-react";

export default function CamaMesaBanho() {
    return (
        <section id="cama-mesa-banho" className="py-24 bg-brand-800 text-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-extrabold mb-8 text-center"
                >
                    Cama, Mesa e Banho: Conforto e Elegância no Dia a Dia
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-lg max-w-3xl mx-auto text-center mb-8"
                >
                    Complete a decoração da sua casa com nossa linha premium de cama, mesa e banho, desenvolvida para quem valoriza conforto, qualidade e bom gosto.
                </motion.p>
                <ul className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <li className="flex flex-col items-center text-center">
                        <Bed size={48} className="mb-4 text-brand-300" />
                        <span className="font-semibold">Lençóis e Jogos de Cama</span>
                    </li>
                    <li className="flex flex-col items-center text-center">
                        <Shirt size={48} className="mb-4 text-brand-300" />
                        <span className="font-semibold">Toalhas Macias e Duráveis</span>
                    </li>
                    <li className="flex flex-col items-center text-center">
                        <Coffee size={48} className="mb-4 text-brand-300" />
                        <span className="font-semibold">Itens Decorativos para Mesa</span>
                    </li>
                </ul>
            </div>
        </section>
    );
}
