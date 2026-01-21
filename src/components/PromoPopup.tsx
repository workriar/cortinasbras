"use client";

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
        }, 5000); // Mostra após 5 segundos
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
                                src="/promo2.jpg"
                                alt="Promoção Especial"
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
                                Aproveite nossa condição especial para cortinas sob medida. 10% na primeira compra com pagamento no PIX!
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
