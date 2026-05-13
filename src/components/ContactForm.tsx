"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, User, MessageSquare, Ruler, Loader2, MapPin, Camera, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import axios from "axios";
import { trackLeadConversion } from "@/lib/gtag";

const formSchema = z.object({
    nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    telefone: z.string().min(10, "Telefone inválido"),
    cidade_bairro: z.string().min(3, "Informe sua cidade ou bairro"),
    largura_parede: z.string().optional(),
    altura_parede: z.string().optional(),
    tecido: z.string().optional(),
    instalacao: z.string().optional(),
    observacoes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);

    const {
        register,
        handleSubmit,
        reset,
        trigger,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    const handleNextStep = async () => {
        const isValid = await trigger(["nome", "telefone", "cidade_bairro"]);
        if (isValid) {
            setCurrentStep(2);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(1);
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);

        const message = `*Novo Orçamento (Site)*
--------------------------------
*Nome:* ${data.nome}
*Telefone:* ${data.telefone}
*Cidade:* ${data.cidade_bairro}
--------------------------------
*Medidas:* ${data.largura_parede || '?'} x ${data.altura_parede || '?'}
*Tecido:* ${data.tecido || 'A definir'}
*Obs:* ${data.observacoes || 'Sem observações'}`;

        const fallbackUrl = `https://wa.me/5511992891070?text=${encodeURIComponent(message)}`;
        setWhatsappUrl(fallbackUrl);

        try {
            await fetch("https://formsubmit.co/ajax/loja@cortinasbras.com.br", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `Novo Lead: ${data.nome}`,
                    _template: "table",
                    Nome: data.nome,
                    Telefone: data.telefone,
                    Cidade: data.cidade_bairro,
                    Largura: data.largura_parede || 'Não informada',
                    Altura: data.altura_parede || 'Não informada',
                    Tecido: data.tecido || 'Não informado',
                    Observacoes: data.observacoes || 'Nenhuma',
                    _captcha: "false"
                })
            });

            const response = await axios.post('/api/leads', data);

            if (response.data?.whatsapp_url) {
                setWhatsappUrl(response.data.whatsapp_url);
            }
        } catch (error) {
            console.error('Erro ao salvar lead (fallback ativado):', error);
        } finally {
            trackLeadConversion();
            setIsSubmitting(false);
            setShowSuccess(true);
            setCurrentStep(1);
            reset();
            window.open(fallbackUrl, '_blank');
        }
    };

    const whatsappPhotoLink = `https://wa.me/5511992891070?text=${encodeURIComponent('Olá! Gostaria de enviar uma foto do ambiente para orçamento de cortinas.')}`;

    return (
        <section id="contato" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-600 text-xs font-bold uppercase tracking-widest border border-brand-200">
                                <Sparkles size={14} />
                                Atendimento Personalizado
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-800 tracking-tight">
                                Transforme seu <span className="text-brand-500">Ambiente</span>
                            </h2>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-md">
                                Preencha os dados abaixo e receba uma estimativa personalizada. Nossos especialistas entrarão em contato para refinar cada detalhe.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Phone, title: "Atendimento Direto", desc: "(11) 99289-1070", color: "bg-brand-100", textColor: "text-brand-600" },
                                { icon: MapPin, title: "Showroom no Brás", desc: "São Paulo - SP", color: "bg-slate-200", textColor: "text-slate-600" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 items-center group cursor-default">
                                    <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm`}>
                                        <item.icon size={26} className={item.textColor} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-brand-800">{item.title}</p>
                                        <p className="text-slate-500 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-10 p-8 bg-brand-800 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-3xl rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
                                <div className="relative z-10 flex items-start gap-5">
                                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shrink-0 border border-white/20">
                                        <Camera size={26} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white text-lg mb-2">Agilize seu orçamento</p>
                                        <p className="text-white/70 text-sm mb-6 leading-relaxed">
                                            Tire uma foto do seu ambiente e envie via WhatsApp. Isso nos ajuda a sugerir o tecido ideal para sua luz e espaço.
                                        </p>
                                        <a
                                            href={whatsappPhotoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 bg-white text-brand-800 px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-50 transition-all shadow-lg hover:shadow-white/10"
                                        >
                                            <Camera size={18} />
                                            Enviar Foto Agora
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl relative"
                    >
                        {showSuccess ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/30 scale-110 mb-4">
                                    <Send size={48} />
                                </div>
                                <h3 className="text-3xl font-extrabold text-brand-800">Solicitação Enviada!</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mb-8 leading-relaxed">
                                    Seus dados foram processados com sucesso. Clique abaixo para iniciar a conversa imediata.
                                </p>

                                {whatsappUrl && (
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-whatsapp py-4 px-10 text-sm flex items-center gap-3 animate-bounce hover:animate-none scale-110 shadow-xl"
                                    >
                                        <MessageSquare size={20} />
                                        Conversar agora no WhatsApp
                                    </a>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="mb-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${currentStep === 1 ? 'text-brand-600' : 'text-slate-400'}`}>
                                            01. Identificação
                                        </span>
                                        <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${currentStep === 2 ? 'text-brand-600' : 'text-slate-400'}`}>
                                            02. Especificações
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            className="bg-brand-600 h-full rounded-full"
                                            initial={{ width: "50%" }}
                                            animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                    <AnimatePresence mode="wait">
                                        {currentStep === 1 ? (
                                            <motion.div
                                                key="step1"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-6"
                                            >
                                                <div className="space-y-3">
                                                    <label htmlFor="cf-nome" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                        <User size={14} /> Nome Completo
                                                    </label>
                                                    <input
                                                        id="cf-nome"
                                                        {...register("nome")}
                                                        placeholder="Ex: Maria Silva"
                                                        className={`w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 ${errors.nome ? "!border-red-400" : ""}`}
                                                    />
                                                    {errors.nome && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.nome.message}</p>}
                                                </div>

                                                <div className="space-y-3">
                                                    <label htmlFor="cf-telefone" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                        <Phone size={14} /> WhatsApp
                                                    </label>
                                                    <input
                                                        id="cf-telefone"
                                                        {...register("telefone")}
                                                        placeholder="(11) 99999-9999"
                                                        className={`w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 ${errors.telefone ? "!border-red-400" : ""}`}
                                                    />
                                                    {errors.telefone && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.telefone.message}</p>}
                                                </div>

                                                <div className="space-y-3">
                                                    <label htmlFor="cf-cidade" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                        <MapPin size={14} /> Cidade / Bairro
                                                    </label>
                                                    <input
                                                        id="cf-cidade"
                                                        {...register("cidade_bairro")}
                                                        placeholder="Ex: Brás, São Paulo"
                                                        className={`w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 ${errors.cidade_bairro ? "!border-red-400" : ""}`}
                                                    />
                                                    {errors.cidade_bairro && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.cidade_bairro.message}</p>}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={handleNextStep}
                                                    className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center justify-center gap-3 group"
                                                >
                                                    Continuar <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="step2"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.3 }}
                                                className="space-y-6"
                                            >
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <label htmlFor="cf-largura" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                            <Ruler size={14} /> Largura (m)
                                                        </label>
                                                        <input
                                                            id="cf-largura"
                                                            {...register("largura_parede")}
                                                            placeholder="Ex: 3,50"
                                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label htmlFor="cf-altura" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                            <Ruler size={14} /> Altura (m)
                                                        </label>
                                                        <input
                                                            id="cf-altura"
                                                            {...register("altura_parede")}
                                                            placeholder="Ex: 2,75"
                                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                                                        />
                                                    </div>
                                                </div>

                                                <p className="text-xs text-brand-500 italic font-medium mb-6">
                                                    💡 Se não souber as medidas, deixe em branco: vamos te ajudar a medir por WhatsApp!
                                                </p>

                                                <div className="space-y-3">
                                                    <label htmlFor="cf-tecido" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tecido Desejado</label>
                                                    <select
                                                        id="cf-tecido"
                                                        {...register("tecido")}
                                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 appearance-none"
                                                    >
                                                        <option value="">Não tenho certeza (me ajude a escolher)</option>
                                                        <option value="Gaze de Linho">Gaze de Linho (Mais pedido)</option>
                                                        <option value="Blackout">Blackout (Bloqueio de luz)</option>
                                                        <option value="Voil">Voil (Leve e transparente)</option>
                                                        <option value="Veludo">Veludo (Sofisticação clássica)</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-3">
                                                    <label htmlFor="cf-observacoes" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mensagem / Observações</label>
                                                    <textarea
                                                        id="cf-observacoes"
                                                        {...register("observacoes")}
                                                        rows={3}
                                                        placeholder="Conte-nos um pouco sobre seu projeto..."
                                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 resize-none h-auto"
                                                        style={{ minHeight: '120px' }}
                                                    />
                                                </div>

                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={handlePrevStep}
                                                        className="flex items-center justify-center px-6 py-4 text-slate-500 bg-white border-2 border-slate-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                                                    >
                                                        <ArrowLeft size={18} /> Voltar
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="flex-1 py-4 bg-brand-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center justify-center gap-3 group"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="animate-spin" /> Processando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Enviar Solicitação <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
