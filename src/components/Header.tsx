"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Início", href: "#inicio" },
        { name: "Produtos", href: "#produtos" },
        { name: "Sobre", href: "#sobre" },
        { name: "Contato", href: "#contato" },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-1 bg-brand-900/95 shadow-2xl backdrop-blur-xl' : 'py-2 bg-brand-900/80 backdrop-blur-md'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between h-full">
                {/* Logo - Smooth Resize */}
                <Link
                    href="/"
                    className={`relative flex items-center transition-all duration-300 origin-left ${isScrolled ? 'scale-90' : 'scale-100'}`}
                >
                    <Image
                        src="/static/logo.png"
                        alt="Cortinas Brás - Cortinas sob medida em São Paulo"
                        width={80}
                        height={20}
                        className="h-auto w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xs font-medium text-white/90 hover:text-brand-300 transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-300 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                    <Link
                        href="#contato"
                        className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-brand-500/50 hover:scale-105"
                    >
                        Orçamento Grátis
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-brand-300 p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Menu de navegação"
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10"
                    >
                        <nav className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium text-white/90 hover:text-brand-300 py-2 border-b border-white/5 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="#contato"
                                className="bg-gradient-to-r from-brand-500 to-brand-600 text-white text-center py-4 rounded-xl font-bold mt-2 hover:scale-105 transition-transform"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Solicitar Orçamento
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
