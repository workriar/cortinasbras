"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, LogIn, AlertCircle } from "lucide-react";
import axios from "axios";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post("/api/admin/auth/login", {
                username,
                password,
            });

            if (response.data.success) {
                // Redirecionar para a página solicitada ou dashboard
                const redirect = searchParams?.get("redirect") || "/dashboard/crm";
                router.push(redirect);
                router.refresh();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao fazer login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-block bg-brand-500 text-white p-4 rounded-2xl mb-4 shadow-xl"
                    >
                        <Lock size={40} />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-brand-700 mb-2">
                        Área Administrativa
                    </h1>
                    <p className="text-brand-700/60">
                        Cortinas Brás - Sistema de Gestão
                    </p>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 border border-brand-100"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3"
                            >
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{error}</span>
                            </motion.div>
                        )}

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-700 flex items-center gap-2">
                                <User size={16} />
                                Usuário
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Digite seu usuário"
                                required
                                className="w-full bg-brand-50 px-4 py-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-700 flex items-center gap-2">
                                <Lock size={16} />
                                Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                required
                                className="w-full bg-brand-50 px-4 py-3 rounded-xl border-2 border-brand-100 focus:border-brand-500 outline-none transition-all"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    Entrar
                                    <LogIn size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-6 pt-6 border-t border-brand-100">
                        <p className="text-xs text-center text-brand-700/50">
                            Acesso restrito a administradores autorizados
                        </p>
                    </div>
                </motion.div>

                {/* Back to Site */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-6"
                >
                    <a
                        href="/"
                        className="text-sm text-brand-700/60 hover:text-brand-700 transition-colors"
                    >
                        ← Voltar para o site
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function AdminLogin() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 flex items-center justify-center">
                <div className="text-brand-700">Carregando...</div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
