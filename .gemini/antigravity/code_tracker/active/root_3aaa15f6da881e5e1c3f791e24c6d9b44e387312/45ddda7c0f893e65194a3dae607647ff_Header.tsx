�#"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
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
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "glass-header py-2"
                    : "bg-transparent py-4"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="relative transition-transform duration-300 hover:scale-105">
                    <Image
                        src="/static/logo.png"
                        alt="Cortinas Brás"
                        width={isScrolled ? 80 : 100}
                        height={40}
                        className="h-auto w-auto transition-all duration-300"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-white/80 hover:text-brand-300 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="#contato"
                        className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:shadow-brand-500/30"
                    >
                        Orçamento
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-brand-300 p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Menu"
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
                                    className="text-lg font-medium text-white/90 hover:text-brand-300 py-2 border-b border-white/5"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="#contato"
                                className="bg-brand-500 text-white text-center py-4 rounded-xl font-bold mt-2"
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
�#"(3aaa15f6da881e5e1c3f791e24c6d9b44e3873122/file:///root/next-app/src/components/Header.tsx:file:///root