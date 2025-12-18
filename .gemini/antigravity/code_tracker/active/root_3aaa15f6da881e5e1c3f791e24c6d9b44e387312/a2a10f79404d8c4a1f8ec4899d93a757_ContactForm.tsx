�Z"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Send, Phone, User, MessageSquare, Ruler, Loader2 } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
    nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    telefone: z.string().min(10, "Telefone inválido"),
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

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/leads", data);

            if (response.data.status === "success" && response.data.whatsapp_url) {
                setShowSuccess(true);
                reset();
                // Redirect to WhatsApp after alert
                setTimeout(() => {
                    window.open(response.data.whatsapp_url, "_blank");
                    setShowSuccess(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Erro ao enviar formulário", error);
            alert("Houve um erro ao enviar sua solicitação. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            Preencha os dados abaixo e receba uma estimativa personalizada. Se preferir, entraremos em contato para agendar uma visita sem compromisso.
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
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white scale-110 animate-bounce">
                                    <Send size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-700">Orçamento Recebido!</h3>
                                <p className="text-brand-700/60">Abrindo seu WhatsApp para finalizar o atendimento...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
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
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-brand-700 flex items-center gap-2">
                                            <Ruler size={16} /> Largura Parede (m)
                                        </label>
                                        <input
                                            {...register("largura_parede")}
                                            placeholder="Ex: 3,50"
                                            className="w-full bg-white px-4 py-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-brand-700 flex items-center gap-2">
                                            <Ruler size={16} /> Altura Parede (m)
                                        </label>
                                        <input
                                            {...register("altura_parede")}
                                            placeholder="Ex: 2,75"
                                            className="w-full bg-white px-4 py-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

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

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg"
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
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
�Z"(3aaa15f6da881e5e1c3f791e24c6d9b44e38731224file:///root/next-app/src/components/ContactForm.tsx:file:///root