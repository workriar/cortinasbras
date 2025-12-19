"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";
import { Gift } from "lucide-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [showPromoTooltip, setShowPromoTooltip] = useState(false);

  return (
    <main className="relative">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 origin-left z-[9999]"
        style={{ scaleX }}
      />

      <Header />
      <Hero />
      <Products />
      <Gallery />
      <About />
      <ContactForm />
      <Footer />

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/5511992891070?text=Olá! Gostaria de solicitar um orçamento de cortinas."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all group"
        aria-label="Falar no WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
        </svg>
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-brand-700 px-4 py-2 rounded-lg shadow-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Falar com Especialista
        </span>
      </motion.a>

      {/* Floating Promo/Coupon Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowPromoTooltip(!showPromoTooltip)}
        className="fixed bottom-8 left-8 z-40 bg-gradient-to-br from-brand-500 to-brand-600 text-white p-4 rounded-full shadow-2xl hover:shadow-brand-500/50 transition-all group"
        aria-label="Ver promoções"
      >
        <Gift className="w-8 h-8" />

        {/* Promo Tooltip */}
        {showPromoTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-full ml-4 bottom-0 bg-white text-brand-700 p-4 rounded-xl shadow-2xl w-64 pointer-events-auto"
          >
            <button
              onClick={() => setShowPromoTooltip(false)}
              className="absolute top-2 right-2 text-brand-400 hover:text-brand-700"
              aria-label="Fechar"
            >
              ✕
            </button>
            <h4 className="font-bold text-lg mb-2">🎉 Oferta Especial!</h4>
            <p className="text-sm mb-3">
              <strong className="text-brand-600">10% OFF</strong> no PIX para primeira compra
            </p>
            <p className="text-xs text-brand-500 font-mono bg-brand-50 px-2 py-1 rounded">
              Cupom: <strong>CLIENTE10</strong>
            </p>
          </motion.div>
        )}
      </motion.button>
    </main>
  );
}
