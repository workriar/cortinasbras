import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function CatalogoPrintPage() {
    const fabrics = await prisma.fabric.findMany({
        orderBy: { category: 'asc' }
    });

    const categories = Array.from(new Set(fabrics.map(f => f.category)));

    return (
        <div className="w-full bg-white text-slate-900 font-sans print:m-0 print:p-0">
            {/* ESTILOS DE IMPRESSÃO - A4 */}
            <style dangerouslySetInnerHTML={{ __html: `
                @page { size: A4; margin: 0; }
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .page-break { page-break-after: always; break-after: page; }
                    .avoid-break { page-break-inside: avoid; break-inside: avoid; }
                }
            `}} />

            {/* CAPA */}
            <div className="relative w-[210mm] h-[297mm] mx-auto overflow-hidden bg-[#f8f5f1] page-break print:w-full print:h-[100vh] flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#D4A93E]"></div>
                
                <div className="pt-24 px-16 text-center z-10 flex-1 flex flex-col items-center">
                    <h2 className="text-sm font-bold text-[#8B5C2A] tracking-[0.4em] mb-12">CORTINAS BRÁS</h2>
                    <h1 className="text-6xl font-black text-[#1a1a1a] tracking-tight mb-6">Catálogo<br/>Exclusivo</h1>
                    <p className="text-2xl text-[#D4A93E] font-serif italic mb-12">A Arte da Alta Costura em Cortinas</p>
                    <div className="w-16 h-[2px] bg-[#D4A93E] mb-12"></div>
                    <p className="text-[#8B5C2A] text-sm tracking-widest uppercase">Coleção Premium 2026</p>
                </div>

                <div className="h-[45%] w-full relative">
                    <div className="absolute inset-0 bg-black/5 z-10"></div>
                    <img 
                        src="/static/hero-bg-1.jpg" 
                        className="w-full h-full object-cover" 
                        alt="Background" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-2 bg-[#D4A93E]"></div>
            </div>

            {/* PÁGINA INTRODUTÓRIA */}
            <div className="relative w-[210mm] h-[297mm] mx-auto bg-white page-break print:w-full print:h-[100vh] py-16 px-16 flex flex-col justify-between">
                <div>
                    <h2 className="text-3xl font-black text-[#1a1a1a] mb-2">Nossas Soluções</h2>
                    <div className="w-12 h-[3px] bg-[#D4A93E] mb-12"></div>

                    <div className="space-y-12">
                        <div className="flex flex-col gap-3 avoid-break">
                            <h3 className="text-xl font-bold text-[#8B5C2A]">Cortinas Prontas</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Modelos selecionados com dimensões padrão, unindo agilidade e a qualidade inquestionável de nossa fábrica. Elegância imediata para seu ambiente.</p>
                            <div className="flex gap-4 mt-2">
                                <span className="text-xs font-bold text-[#D4A93E] bg-[#f8f5f1] px-3 py-1 rounded-full">Entrega imediata</span>
                                <span className="text-xs font-bold text-[#D4A93E] bg-[#f8f5f1] px-3 py-1 rounded-full">Tamanhos padrão</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 avoid-break">
                            <h3 className="text-xl font-bold text-[#8B5C2A]">Cortinas Sob Medida</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">Nossa obra-prima. Projetos milimetricamente planejados para cada janela, utilizando os tecidos mais nobres do mundo.</p>
                            <div className="flex gap-4 mt-2">
                                <span className="text-xs font-bold text-[#D4A93E] bg-[#f8f5f1] px-3 py-1 rounded-full">Projetos exclusivos</span>
                                <span className="text-xs font-bold text-[#D4A93E] bg-[#f8f5f1] px-3 py-1 rounded-full">Instalação especializada</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                    <p className="text-center text-xs text-slate-400">Cortinas Brás • Fábrica & Showroom • São Paulo, SP</p>
                </div>
            </div>

            {/* PÁGINAS DE TECIDOS (2 por página) */}
            {categories.map((category) => {
                const categoryFabrics = fabrics.filter(f => f.category === category);
                // Dividir em chunks de 2
                const chunks = [];
                for (let i = 0; i < categoryFabrics.length; i += 2) {
                    chunks.push(categoryFabrics.slice(i, i + 2));
                }

                return chunks.map((chunk, chunkIdx) => (
                    <div key={`${category}-${chunkIdx}`} className="relative w-[210mm] h-[297mm] mx-auto bg-[#fafafa] page-break print:w-full print:h-[100vh] py-16 px-12 flex flex-col justify-between">
                        <div>
                            {chunkIdx === 0 && (
                                <div className="mb-10 text-center">
                                    <h2 className="text-3xl font-black text-[#1a1a1a] uppercase tracking-widest">{category}</h2>
                                    <div className="w-16 h-1 bg-[#D4A93E] mx-auto mt-4"></div>
                                </div>
                            )}

                            <div className="space-y-10 mt-6">
                                {chunk.map((fabric) => (
                                    <div key={fabric.id} className="bg-white rounded-xl shadow-sm border border-slate-100 flex overflow-hidden h-[95mm] avoid-break">
                                        <div className="w-[45%] h-full relative bg-slate-100">
                                            {fabric.placeholderImage && (
                                                <img 
                                                    src={fabric.placeholderImage} 
                                                    className="w-full h-full object-cover" 
                                                    alt={fabric.name} 
                                                />
                                            )}
                                            {fabric.exclusive && (
                                                <div className="absolute top-4 left-4 bg-[#D4A93E] text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
                                                    Exclusivo
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-[55%] p-8 flex flex-col justify-center">
                                            <h3 className="text-2xl font-black text-[#1a1a1a] mb-3">{fabric.name}</h3>
                                            <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed">{fabric.description}</p>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cores</p>
                                                    <p className="text-xs font-medium text-slate-700">{fabric.colors.split(',').join(' • ')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Diferenciais</p>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                        {fabric.benefits.split(',').map((b, i) => (
                                                            <span key={i} className="text-xs font-medium text-slate-700">✓ {b.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mt-auto">
                            <p className="text-center text-xs text-slate-400">Cortinas Brás • Coleção de Tecidos Premium</p>
                        </div>
                    </div>
                ));
            })}

            {/* PÁGINA FINAL DE CONTATO */}
            <div className="relative w-[210mm] h-[297mm] mx-auto bg-[#1a1a1a] page-break print:w-full print:h-[100vh] flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#D4A93E]"></div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center px-16">
                    <h2 className="text-sm font-bold text-[#D4A93E] tracking-[0.4em] mb-12">ENTRE EM CONTATO</h2>
                    <h1 className="text-5xl font-black text-white tracking-tight mb-16 leading-tight">Agende uma<br/>Consultoria Exclusiva</h1>
                    
                    <div className="space-y-6">
                        <p className="text-lg text-[#f8f5f1] font-medium tracking-wide">Av. Celso Garcia, 129 — Brás, São Paulo/SP</p>
                        <p className="text-2xl text-[#D4A93E] font-bold">(11) 99289-1070</p>
                        <p className="text-lg text-[#f8f5f1] font-medium tracking-wide">www.cortinasbras.com.br</p>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-2 bg-[#D4A93E]"></div>
            </div>

        </div>
    );
}
