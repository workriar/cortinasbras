import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-brand-900 bg-texture-luxury">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" scroll={false} className="inline-block mb-8">
                            <Image
                                src="/static/logo.png"
                                alt="Cortinas Brás"
                                width={80}
                                height={25}
                                className="brightness-0 invert h-auto w-20"
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
                            <li><Link href="#inicio" scroll={false} className="hover:text-white transition-colors">Início</Link></li>
                            <li><Link href="#produtos" scroll={false} className="hover:text-white transition-colors">Produtos</Link></li>
                            <li><Link href="#sobre" scroll={false} className="hover:text-white transition-colors">Sobre Nós</Link></li>
                            <li><Link href="#contato" scroll={false} className="hover:text-white transition-colors">Orçamentos</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-brand-300">Produtos</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="#contato" scroll={false} className="hover:text-white transition-colors">Cortinas Wave</Link></li>
                            <li><Link href="#contato" scroll={false} className="hover:text-white transition-colors">Blackout SP</Link></li>
                            <li><Link href="#contato" scroll={false} className="hover:text-white transition-colors">Enxovais Prime</Link></li>
                            <li><Link href="#contato" scroll={false} className="hover:text-white transition-colors">Entrega Rápida</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-8 uppercase tracking-widest text-brand-300">Contato</h4>
                        <ul className="space-y-6 text-gray-400">
                            <li className="flex gap-3 items-start">
                                <MapPin className="text-brand-300 shrink-0" size={20} />
                                <span>Av. Celso Garcia, 129 - Brás<br />São Paulo - SP, 03015-000</span>
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
                        <div className="mt-8">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.797071598995!2d-46.6137169247409!3d-23.53980006080033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce58df8c06a2cd%3A0xc9828fe2be527cdc!2sAv.%20Celso%20Garcia%2C%20129%20-%20Br%C3%A1s%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2003015-000!5e0!3m2!1spt-BR!2sbr!4v1766257330906!5m2!1spt-BR!2sbr"
                                width="100%"
                                height="200"
                                style={{ border: 0, borderRadius: '8px' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="mt-4"
                            />
                        </div>
                    </div>
                </div>

                {/* SEO Local Section - Localidades Atendidas */}
                <div className="mb-12 pb-12 border-b border-white/5">
                    <div className="bg-gradient-to-r from-white/5 to-transparent p-8 rounded-2xl">
                        <h3 className="text-xl font-bold text-brand-300 mb-4">Cortinas Sob Medida em São Paulo e Região</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            A <strong className="text-white">Cortinas Brás</strong> é especialista em <strong className="text-white">cortinas sob medida em São Paulo</strong>,
                            oferecendo atendimento completo em toda a <strong className="text-white">capital paulista e região metropolitana</strong>.
                            Com showroom localizado no tradicional bairro do Brás, atendemos clientes de todas as regiões de São Paulo incluindo
                            <strong className="text-white"> Zona Leste</strong> (Tatuapé, Mooca, Penha, Vila Matilde, Aricanduva),
                            <strong className="text-white"> Zona Sul</strong> (Moema, Brooklin, Vila Mariana, Jabaquara, Santo Amaro),
                            <strong className="text-white"> Zona Norte</strong> (Santana, Tucuruvi, Casa Verde, Vila Guilherme),
                            <strong className="text-white"> Zona Oeste</strong> (Pinheiros, Vila Madalena, Lapa, Perdizes, Butantã),
                            além do <strong className="text-white">ABC Paulista</strong> (Santo André, São Bernardo, São Caetano, Diadema) e
                            <strong className="text-white"> Grande São Paulo</strong> (Guarulhos, Osasco, Barueri, Cotia).
                        </p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Oferecemos <strong className="text-white">cortinas sob medida</strong>, <strong className="text-white">cortinas prontas</strong>,
                            <strong className="text-white"> cortinas blackout</strong>, <strong className="text-white">cortinas wave</strong>,
                            <strong className="text-white"> persianas</strong> e <strong className="text-white">enxovais de luxo</strong> com
                            <strong className="text-white"> fabricação própria</strong>, <strong className="text-white">entrega rápida</strong> e
                            <strong className="text-white"> instalação profissional</strong> em toda São Paulo. Solicite seu orçamento sem compromisso!
                        </p>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 uppercase tracking-widest">
                    <p>© {new Date().getFullYear()} Cortinas Brás. Todos os direitos reservados.</p>
                    <div className="flex gap-8">
                        <Link href="/politica-de-privacidade" scroll={false} className="hover:text-white">Privacidade</Link>
                        <Link href="/termos-de-uso" scroll={false} className="hover:text-white">Termos</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
