'use client';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Search, Bell, Plus, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    const { data: session } = useSession();
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Brand Logo - Added as requested */}
                    <div className="mr-6 shrink-0">
                        <Link href="/dashboard">
                            <img
                                src="/static/logo-gestao.png"
                                alt="Cortinas Brás"
                                className="h-6 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Search Bar - Muted and subtle */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-300 group-focus-within:text-gray-400 transition-colors" />
                            </div>
                            <input
                                type="search"
                                placeholder="Pesquisar..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-lg leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 focus:border-gray-200 transition-all sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3 ml-6">
                        {/* Quick Actions */}
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
                            <Plus size={20} strokeWidth={1.5} />
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all relative"
                            >
                                <Bell size={20} strokeWidth={1.5} />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-primary rounded-full"></span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="font-semibold text-sm text-gray-800 uppercase tracking-tight">Notificações</h3>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">2 NOVAS</span>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                                            <p className="text-sm text-gray-700">Novo orçamento recebido pelo site</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">há 5 minutos</p>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-t border-gray-50">
                                            <p className="text-sm text-gray-700">Interação registrada por Vendedor</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">há 1 hora</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                                        <button className="text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors">
                                            VER TODO O HISTÓRICO
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-all border border-transparent hover:border-gray-100"
                            >
                                <div className="w-8 h-8 bg-stone-100 border border-stone-200 rounded-full flex items-center justify-center text-stone-600 font-medium text-xs">
                                    {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="hidden md:block text-left pr-1">
                                    <p className="text-xs font-semibold text-gray-800 leading-none mb-0.5">{session?.user?.name || 'Administrador'}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-none">Acesso Admin</p>
                                </div>
                                <ChevronDown size={14} className={`text-gray-300 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                            </button>

                            {showProfile && (
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                                        <User size={14} />
                                        Perfil da Conta
                                    </Link>
                                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                                        <Settings size={14} />
                                        Preferências
                                    </Link>
                                    <div className="h-px bg-gray-100 my-1 mx-2" />
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/login' })}
                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={14} />
                                        Finalizar Sessão
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
