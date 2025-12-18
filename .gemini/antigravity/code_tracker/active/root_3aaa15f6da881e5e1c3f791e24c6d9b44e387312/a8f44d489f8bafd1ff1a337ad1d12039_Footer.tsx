�'import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="inline-block mb-8">
                            <Image
                                src="/static/logo.png"
                                alt="Cortinas Brás"
                                width={120}
                                height={50}
                                className="brightness-0 invert h-auto w-auto"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Especialistas em transformar ambientes através de cortinas sob medida e enxovais de alto padrão. Tradição e qualidade desde 2003 no Brás.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://instagram.com/cortinasbras" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-500 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-500 transition-colors">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-brand-300">Navegação</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="#inicio" className="hover:text-white transition-colors">Início</Link></li>
                            <li><Link href="#produtos" className="hover:text-white transition-colors">Produtos</Link></li>
                            <li><Link href="#sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
                            <li><Link href="#contato" className="hover:text-white transition-colors">Orçamentos</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-brand-300">Produtos</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="#contato" className="hover:text-white transition-colors">Cortinas Wave</Link></li>
                            <li><Link href="#contato" className="hover:text-white transition-colors">Blackout SP</Link></li>
                            <li><Link href="#contato" className="hover:text-white transition-colors">Enxovais Prime</Link></li>
                            <li><Link href="#contato" className="hover:text-white transition-colors">Instalação Express</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-brand-300">Contato</h4>
                        <ul className="space-y-6 text-gray-400">
                            <li className="flex gap-3 items-start">
                                <MapPin className="text-brand-300 shrink-0" size={20} />
                                <span>Showroom no Brás, São Paulo - SP</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone className="text-brand-300 shrink-0" size={20} />
                                <span>(11) 99289-1070</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Mail className="text-brand-300 shrink-0" size={20} />
                                <span>loja@cortinasbras.com.br</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 uppercase tracking-widest">
                    <p>© {new Date().getFullYear()} Cortinas Brás. Todos os direitos reservados.</p>
                    <div className="flex gap-8">
                        <Link href="/politica-de-privacidade" className="hover:text-white">Privacidade</Link>
                        <Link href="/termos-de-uso" className="hover:text-white">Termos</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
�'"(3aaa15f6da881e5e1c3f791e24c6d9b44e3873122/file:///root/next-app/src/components/Footer.tsx:file:///root