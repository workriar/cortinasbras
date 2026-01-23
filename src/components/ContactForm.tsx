"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, User, MessageSquare, Ruler, Loader2, MapPin, Camera, ArrowRight, ArrowLeft } from "lucide-react";
import axios from "axios";

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
        getValues,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    const handleNextStep = async () => {
        // Validate step 1 fields
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
        try {
            const response = await axios.post('/api/leads', data);

            if (response.data?.status === 'success' && response.data.whatsapp_url) {
                setWhatsappUrl(response.data.whatsapp_url);
                setShowSuccess(true);
                reset();
                setCurrentStep(1);
                // Optional: Auto-open if desired, but button is safer
                // window.open(response.data.whatsapp_url, '_blank');
            } else {
                const msg = response.data?.message || 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.';
                alert(msg);
            }
        } catch (error) {
            console.error('Erro ao enviar formulário', error);
            alert('Houve um erro ao enviar sua solicitação. Por favor, tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const whatsappPhotoLink = `https://wa.me/5511992891070?text=${encodeURIComponent('Olá! Gostaria de enviar uma foto do ambiente para orçamento de cortinas.')}`;

    return (
        <section id="contato" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-extrabold text-brand-700 mb-6">Solicite seu Orçamento Gratuito</h2>
                        <p className="text-lg text-brand-700/70 mb-8">
                            Preencha os dados abaixo e receba uma estimativa personalizada. Se preferir, entraremos em contato para te atender sem compromisso.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500 shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-brand-700">Atendimento Direto</p>
                                    <p className="text-brand-700/60">(11) 99289-1070</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500 shrink-0">
                                    <MessageSquare size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-brand-700">Showroom no Brás</p>
                                    <p className="text-brand-700/60">São Paulo - SP</p>
                                </div>
                            </div>

                            {/* Photo Upload Option */}
                            <div className="mt-8 p-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0">
                                        <Camera size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white mb-2">Prefere enviar uma foto?</p>
                                        <p className="text-white/90 text-sm mb-4">
                                            Tire uma foto do ambiente e envie pelo WhatsApp. Vamos te ajudar com as medidas!
                                        </p>
                                        <a
                                            href={whatsappPhotoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-white text-brand-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-50 transition-all shadow-md hover:shadow-lg"
                                        >
                                            <Camera size={18} />
                                            Enviar Foto pelo WhatsApp
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
                        className="bg-brand-50 p-8 md:p-12 rounded-3xl border border-brand-100 shadow-xl"
                    >
                        {showSuccess ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white scale-110 mb-4">
                                    <Send size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-700">Orçamento Confirmado!</h3>
                                <p className="text-brand-700/60 max-w-xs mx-auto mb-6">Estamos prontos para te atender. Clique abaixo para enviar as informações pelo WhatsApp:</p>

                                {whatsappUrl && (
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-whatsapp py-4 px-8 text-sm flex items-center gap-3 animate-pulse hover:animate-none scale-110"
                                    >
                                        <MessageSquare size={20} />
                                        Abrir WhatsApp Agora
                                    </a>
                                )}

                                <p className="text-xs text-brand-700/40 mt-4">Ou aguarde, entraremos em contato em breve.</p>
                            </div>
                        ) : (
                            <>
                                {/* Progress Indicator */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm font-semibold ${currentStep === 1 ? 'text-brand-600' : 'text-brand-400'}`}>
                                            1. Seus Dados
                                        </span>
                                        <span className={`text-sm font-semibold ${currentStep === 2 ? 'text-brand-600' : 'text-brand-400'}`}>
                                            2. Detalhes do Projeto
                                        </span>
                                    </div>
                                    <div className="w-full bg-brand-200 rounded-full h-2">
                                        <motion.div
                                            className="bg-brand-600 h-2 rounded-full"
                                            initial={{ width: "50%" }}
                                            animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-brand-700 flex items-center gap-2">
                                                        <User size={16} /> Nome Completo
                                                    </label>
                                                    <input
                                                        {...register("nome")}
                                                        placeholder="Ex: Maria Silva"
                                                        className={`w-full bg-white px-4 py-3 rounded-xl border-2 focus:border-brand-500 outline-none transition-all ${errors.nome ? "border-red-400" : "border-brand-100"
                                                            }`}
                                                    />
                                                    {errors.nome && <p className="text-red-500 text-xs">{errors.nome.message}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-brand-700 flex items-center gap-2">
                                                        <Phone size={16} /> WhatsApp
                                                    </label>
                                                    <input
                                                        {...register("telefone")}
                                                        placeholder="(11) 99999-9999"
                                                        className={`w-full bg-white px-4 py-3 rounded-xl border-2 focus:border-brand-500 outline-none transition-all ${errors.telefone ? "border-red-400" : "border-brand-100"
                                                            }`}
                                                    />
                                                    {errors.telefone && <p className="text-red-500 text-xs">{errors.telefone.message}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-brand-700 flex items-center gap-2">
                                                        <MapPin size={16} /> Cidade / Bairro
                                                    </label>
                                                    <input
                                                        {...register("cidade_bairro")}
                                                        placeholder="Ex: Brás, São Paulo"
                                                        className={`w-full bg-white px-4 py-3 rounded-xl border-2 focus:border-brand-500 outline-none transition-all ${errors.cidade_bairro ? "border-red-400" : "border-brand-100"
                                                            }`}
                                                    />
                                                    {errors.cidade_bairro && <p className="text-red-500 text-xs">{errors.cidade_bairro.message}</p>}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={handleNextStep}
                                                    className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg"
                                                >
                                                    Continuar <ArrowRight size={20} />
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
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-brand-700 flex items-center gap-2">
                                                            <Ruler size={16} /> Largura (m)
                                                        </label>
                                                        <input
                                                            {...register("largura_parede")}
                                                            placeholder="Ex: 3,50"
                                                            className="w-full bg-white px-4 py-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-brand-700 flex items-center gap-2">
                                                            <Ruler size={16} /> Altura (m)
                                                        </label>
                                                        <input
                                                            {...register("altura_parede")}
                                                            placeholder="Ex: 2,75"
                                                            className="w-full bg-white px-4 py-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <p className="text-xs text-brand-600/70 italic -mt-2">
                                                    💡 Se não souber as medidas, deixe em branco: vamos te ajudar a medir por WhatsApp!
                                                </p>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-brand-700">Tecido Desejado</label>
                                                    <select
                                                        {...register("tecido")}
                                                        className="w-full bg-white px-4 py-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none transition-all appearance-none"
                                                    >
                                                        <option value="">Não tenho certeza (me ajude a escolher)</option>
                                                        <option value="Gaze de Linho">Gaze de Linho (Mais pedido)</option>
                                                        <option value="Blackout">Blackout (Bloqueio de luz)</option>
                                                        <option value="Voil">Voil (Leve e transparente)</option>
                                                        <option value="Veludo">Veludo (Sofisticação clássica)</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-brand-700">Mensagem / Observações</label>
                                                    <textarea
                                                        {...register("observacoes")}
                                                        rows={3}
                                                        placeholder="Conte-nos um pouco sobre seu projeto..."
                                                        className="w-full bg-white px-4 py-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none transition-all resize-none"
                                                    />
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={handlePrevStep}
                                                        className="flex items-center justify-center gap-2 px-6 py-4 text-brand-700 bg-white border-2 border-brand-200 rounded-xl font-semibold hover:bg-brand-50 transition-all"
                                                    >
                                                        <ArrowLeft size={20} /> Voltar
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="flex-1 btn-primary flex items-center justify-center gap-3 py-4 text-lg"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="animate-spin" /> Processando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Enviar Solicitação <Send size={20} />
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
            </div >
        </section >
    );
}
