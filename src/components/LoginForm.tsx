
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Credenciais inválidas');
            } else {
                // Force reload to update session state
                window.location.reload();
            }
        } catch (err) {
            setError('Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 p-4">
            <div className="w-full max-w-md">
                {/* Card de Login */}
                <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(212,169,62,0.15)] p-10 border border-brand-100">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative w-64 h-32 hover:scale-105 transition-transform duration-300">
                            <a href="/" aria-label="Voltar para o site">
                                <img
                                    src="/logo.png"
                                    alt="Cortinas Brás - Sistema de Gestão"
                                    className="w-full h-full object-contain"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Título */}
                    <p className="text-center text-brand-700/80 text-[10px] font-black uppercase tracking-[0.3em] mb-10 mt-6">
                        Portal de Gestão Cortinas Brás
                    </p>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-[10px] font-black text-brand-700 uppercase tracking-widest mb-2 ml-1">
                                Identificação (E-mail)
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-brand-100 bg-brand-50/30 text-brand-900 font-bold focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all placeholder:text-brand-200"
                                placeholder="exemplo@cortinasbras.com"
                            />
                        </div>

                        {/* Senha */}
                        <div>
                            <label htmlFor="password" className="block text-[10px] font-black text-brand-700 uppercase tracking-widest mb-2 ml-1">
                                Chave de Acesso
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-brand-100 bg-brand-50/30 text-brand-900 font-bold focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all placeholder:text-brand-200"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Erro */}
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-wider px-4 py-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        {/* Botão */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-500/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Autenticando...
                                </span>
                            ) : (
                                'Iniciar Sessão'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-[10px] font-black text-brand-700 uppercase tracking-[0.2em]">
                            Cortinas Brás - Gestão © 2026
                        </p>
                    </div>
                </div>

                {/* Decoração */}
                <div className="mt-8 text-center">
                    <p className="text-[11px] font-black text-brand-700 uppercase tracking-widest">Ambiente Administrativo Seguro</p>
                </div>
            </div>
        </div>
    );
}
