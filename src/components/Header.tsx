"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        setIsMobileMenuOpen(false);

        if (pathname === '/' && href.startsWith('/#')) {
            e.preventDefault();
            const targetId = href.replace('/#', '');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const navLinks = [
        { name: "Início", href: "/#inicio" },
        { name: "Produtos", href: "/#produtos" },
        { name: "Catálogo", href: "/#catalogo" },
        { name: "Sobre", href: "/#sobre" },
        { name: "Contato", href: "/#contato" },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'py-3 bg-white/90 shadow-lg backdrop-blur-md' : 'py-5 bg-transparent'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between h-full">
                <div className={`relative flex items-center transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
                    <Image
                        src="/static/logo.png"
                        alt="Cortinas Brás"
                        width={80}
                        height={25}
                        className={`h-auto w-20 object-contain transition-all ${isScrolled ? 'brightness-110' : ''}`}
                        priority
                    />
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleSmoothScroll(e, link.href)}
                            className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 relative group ${isScrolled ? 'text-slate-700 hover:text-brand-600' : 'text-white hover:text-brand-300'}`}
                        >
                            {link.name}
                            <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isScrolled ? 'bg-brand-600' : 'bg-brand-300'}`}></span>
                        </a>
                    ))}
                    <a
                        href="/#contato"
                        onClick={(e) => handleSmoothScroll(e, '/#contato')}
                        className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg ${
                            isScrolled
                            ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-600/30'
                            : 'bg-white text-brand-800 hover:bg-brand-50 shadow-white/20'
                        }`}
                    >
                        Orçamento Grátis
                    </a>
                </nav>

                <button
                    className={`md:hidden p-2 transition-colors ${isScrolled ? 'text-brand-800' : 'text-white'}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Menu"
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
                    >
                        <nav className="flex flex-col p-8 gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-bold text-slate-800 hover:text-brand-600 transition-colors border-b border-slate-100 pb-4"
                                    onClick={(e) => handleSmoothScroll(e, link.href)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="/#contato"
                                className="bg-brand-600 text-white text-center py-4 rounded-2xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all"
                                onClick={(e) => handleSmoothScroll(e, '/#contato')}
                            >
                                Solicitar Orçamento
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
