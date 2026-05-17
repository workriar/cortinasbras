"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, X } from "lucide-react";

export default function PDFPromoNotification() {
    const [isVisible, setIsVisible] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [pdfStatus, setPdfStatus] = useState("Baixar Agora");

    useEffect(() => {
        const hasSeen = localStorage.getItem("pdf_promo_seen");
        if (!hasSeen) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 5000);

            const exitTimer = setTimeout(() => {
                setIsVisible(false);
                localStorage.setItem("pdf_promo_seen", "true");
            }, 15000); // 5s delay + 10s duration

            return () => {
                clearTimeout(timer);
                clearTimeout(exitTimer);
            };
        }
    }, []);

    const closeNotification = () => {
        setIsVisible(false);
        localStorage.setItem("pdf_promo_seen", "true");
    };

    const handleDownloadCatalog = async () => {
        setIsGeneratingPdf(true);
        setPdfStatus("Preparando fotos...");
        
        try {
            setTimeout(() => setPdfStatus("Montando páginas..."), 2000);
            
            const response = await fetch('/api/catalog');
            if (!response.ok) throw new Error('Erro ao gerar PDF');
            
            setPdfStatus("Catálogo pronto!");
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'catalogo-exclusivo-cortinas-bras.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            setPdfStatus("Erro ao gerar PDF");
        } finally {
            setTimeout(() => {
                setIsGeneratingPdf(false);
                setPdfStatus("Baixar Agora");
                closeNotification();
            }, 3000);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                    exit={{ opacity: 0, y: 100, scale: 0.8, x: -20 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-8 left-8 z-[100] max-w-xs w-full px-4 pointer-events-none"
                >
                    <div className="bg-white rounded-3xl shadow-2xl border border-brand-100 overflow-hidden pointer-events-auto group hover:border-brand-300 transition-colors">
                        <div className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-brand-50 rounded-2xl text-brand-600 group-hover:scale-110 transition-transform duration-300">
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1">
                                    <button
                                        onClick={closeNotification}
                                        className="absolute top-3 right-3 p-1 text-slate-400 hover:text-brand-600 transition-colors"
                                        aria-label="Fechar"
                                    >
                                        <X size={16} />
                                    </button>
                                    <h4 className="text-brand-800 font-bold text-lg leading-tight mb-1">
                                        Catálogo Exclusivo
                                    </h4>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                        Descubra nossa coleção completa de tecidos premium e modelos de luxo.
                                    </p>
                                    <button
                                        onClick={handleDownloadCatalog}
                                        disabled={isGeneratingPdf}
                                        className={`inline-flex items-center gap-2 px-5 py-3 ${isGeneratingPdf ? 'bg-brand-400 cursor-wait' : 'bg-brand-600 hover:bg-brand-700'} text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand-500/20 active:scale-95`}
                                    >
                                        {isGeneratingPdf ? (
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Download size={14} />
                                        )}
                                        {pdfStatus}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="h-1.5 bg-brand-600 rounded-b-3xl animate-shrink-width origin-left"
                             style={{
                                 animation: 'shrink 10s linear forwards'
                             }}
                        />
                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes shrink {
                                from { width: 100%; }
                                to { width: 0%; }
                            }
                        ` }} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
