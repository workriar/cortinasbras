ƒ%"use client";

import { motion } from "framer-motion";
import { Scissors, Home, Bed, Check } from "lucide-react";

const products = [
    {
        title: "CORTINAS PRONTAS",
        description: "Modelos variados em tamanhos padr√£o, prontos para levar e instalar. Ideal para quem tem pressa e busca qualidade.",
        icon: Home,
        features: ["Entrega imediata", "V√°rias cores", "Modelos variados"],
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
        title: "CAMA ‚Ä¢ MESA ‚Ä¢ BANHO",
        description: "Enxovais premium que completam a decora√ß√£o. Jogos de cama com fios eg√≠pcios e toalhas de alta absor√ß√£o.",
        icon: Bed,
        features: ["Len√ß√≥is Premium", "Jogos de Cama", "Acess√≥rios Nobres"],
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
                        Escolha a solu√ß√£o ideal para seu espa√ßo: <br />Tecidos, modelos e acabamentos pensados para voc√™.
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
                                Quero um or√ßamento
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
á áã*cascade08
ãå åç*cascade08
çé éê*cascade08
êë ëì*cascade08
ìî îï*cascade08
ïñ ñó*cascade08
óí íï*cascade08
ïñ ñó*cascade08
óò òô*cascade08
ôö öú*cascade08
úù ùû*cascade08
û£ £•*cascade08
•¶ ¶®*cascade08
®© ©´*cascade08
´Ø Ø±*cascade08
±Æ Æ≈*cascade08
≈« «…*cascade08
…   À*cascade08
ÀÃ Ã–*cascade08
–‘ ‘÷*cascade08
÷Ÿ Ÿ‹*cascade08
‹ﬁ ﬁﬂ*cascade08
ﬂ‡ ‡·*cascade08
·‚ ‚‰*cascade08
‰Â ÂÊ*cascade08
Ê€ €‹*cascade08
‹› ›‡*cascade08
‡· ·‰*cascade08
‰Â ÂÈ*cascade08
ÈÓ ÓÒ*cascade08
ÒÚ ÚÙ*cascade08
Ù¯ ¯˘*cascade08
˘˚ ˚Ä*cascade08
ÄÇ ÇÉ*cascade08
ÉÖ Öá*cascade08
áâ âä*cascade08
äã ãé*cascade08
éè èê*cascade08
êë ëì*cascade08
ìï ïú*cascade08
úû û¢*cascade08
¢§ §®*cascade08
®© ©™*cascade08
™´ ´Ø*cascade08
Ø≥ ≥π*cascade08
πª ªº*cascade08
ºø ø¿*cascade08
¿¬ ¬√*cascade08
√ƒ ƒ∆*cascade08
∆« « *cascade08
 Ã Ã“*cascade08
“ƒ% "(3aaa15f6da881e5e1c3f791e24c6d9b44e38731221file:///root/next-app/src/components/Products.tsx:file:///root