ª"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function PromoPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const hasSeen = localStorage.getItem("hasSeenPromo");
            if (!hasSeen) {
                setIsOpen(true);
            }
        }, 5000); // Mostra ap√≥s 5 segundos
        return () => clearTimeout(timer);
    }, []);

    const close = () => {
        setIsOpen(false);
        localStorage.setItem("hasSeenPromo", "true");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
                    >
                        <button
                            onClick={close}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-brand-700 hover:bg-brand-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative aspect-video">
                            <img
                                src="/static/promo2.jpg"
                                alt="Promo√ß√£o Especial"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                                <div className="text-white">
                                    <h3 className="text-2xl font-extrabold mb-2">Oferta Exclusiva!</h3>
                                    <p className="text-brand-300 font-bold">10% OFF no PIX (Cupom: Cliente10)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <p className="text-brand-700/70 mb-6">
                                Aproveite nossa condi√ß√£o especial para cortinas sob medida. 10% na primeira compra com pagamento no PIX!
                            </p>
                            <button
                                onClick={close}
                                className="w-full btn-primary py-4"
                            >
                                Garantir meu Desconto
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
ï ïò*cascade08
òô ôõ*cascade08
õú úû*cascade08
ûÚ ÚÛ*cascade08
Û˘ ˘ˇ*cascade08
ˇÄ ÄÑ*cascade08
ÑÖ Öá*cascade08
áà àâ*cascade08
âã ãå*cascade08
åç çé*cascade08
éè èí*cascade08
í¢ ¢£*cascade08
£§ §ß*cascade08
ßØ Ø≤*cascade08
≤¥ ¥µ*cascade08
µº ºø*cascade08
ø¿ ¿¡*cascade08
¡¬ ¬ƒ*cascade08
ƒ≈ ≈«*cascade08
«» »…*cascade08
…   À*cascade08
ÀÃ ÃÕ*cascade08
ÕŒ Œœ*cascade08
œ– –”*cascade08
”’ ’÷*cascade08
÷◊ ◊Ÿ*cascade08
Ÿ⁄ ⁄€*cascade08
€› ›ﬁ*cascade08
ﬁ„ „Ê*cascade08
ÊÁ ÁË*cascade08
ËÏ Ï*cascade08
Ò ÒÛ*cascade08
Ûı ıˆ*cascade08
ˆ˘ ˘¸*cascade08
¸ª "(3aaa15f6da881e5e1c3f791e24c6d9b44e38731223file:///root/next-app/src/components/PromoPopup.tsx:file:///root