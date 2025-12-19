"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Início", href: "#inicio" },
        { name: "Produtos", href: "#produtos" },
        { name: "Sobre", href: "#sobre" },
        { name: "Contato", href: "#contato" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-header py-2 shadow-lg">
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo - Small and on left */}
                <Link
                    href="/"
                    className="relative transition-transform duration-300 hover:scale-105"
                >
                    <Image
                        src="/static/logo.png"
                        alt="Cortinas Brás - Cortinas sob medida em São Paulo"
                        width={80}
                        height={32}
                        className="h-auto w-auto"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-white/90 hover:text-brand-300 transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-300 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                    <Link
                        href="#contato"
                        className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:shadow-brand-500/50 hover:scale-105"
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
