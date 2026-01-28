'use client';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Plus, Settings, LogOut, ChevronDown, Users as UsersIcon } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Fechar ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Brand Logo */}
                    <div className="mr-2 md:mr-6 shrink-0 flex items-center gap-4">
                        <Link href="/dashboard">
                            <div className="relative w-32 md:w-48 h-10 md:h-12 flex items-center">
                                <img
                                    src="/logo.png"
                                    alt="Cortinas Brás"
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                        </Link>

                        {/* Breadcrumbs - Desktop Only */}
                        <div className="hidden lg:flex items-center text-sm text-gray-500 font-medium">
                            <div className="h-6 w-px bg-gray-200 mx-2"></div>
                            <span className="text-gray-900">
                                {(() => {
                                    // Simple manual mapping for now
                                    if (pathname === '/dashboard') return 'Visão Geral';
                                    if (pathname?.startsWith('/dashboard/crm')) return 'CRM';
                                    if (pathname?.startsWith('/dashboard/kanban')) return 'Kanban';
                                    if (pathname?.startsWith('/dashboard/chat')) return 'Chat';
                                    if (pathname?.startsWith('/dashboard/reports')) return 'Relatórios';
                                    if (pathname?.startsWith('/dashboard/users')) return 'Usuários';
                                    if (pathname?.startsWith('/dashboard/settings')) return 'Configurações';
                                    return 'Painel';
                                })()}
                            </span>
                        </div>
                    </div>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="flex-1 max-w-xl hidden md:block">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-300 group-focus-within:text-gray-400 transition-colors" />
                            </div>
                            <input
                                type="search"
                                placeholder="Pesquisar..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-lg leading-5 bg-stone-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-stone-200 focus:border-stone-200 transition-all sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 md:gap-3 ml-auto md:ml-6">
                        {/* Quick Actions (Hidden Mobile) */}
                        <button className="hidden md:block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
                            <Plus size={20} strokeWidth={1.5} />
                        </button>

                        {/* Search Icon (Visible Mobile) */}
                        <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
                            <Search size={20} strokeWidth={1.5} />
                        </button>

                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all relative"
                            >
                                <Bell size={20} strokeWidth={1.5} />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="font-semibold text-sm text-gray-800 uppercase tracking-tight">Notificações</h3>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">2 NOVAS</span>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        <Link
                                            href="/dashboard/crm?status=NEW"
                                            onClick={() => setShowNotifications(false)}
                                            className="block px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <p className="text-sm text-gray-700 font-medium">Novos leads chegaram!</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Clique para ver os novos orçamentos.</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Recente</p>
                                        </Link>
                                    </div>
                                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                                        <button className="text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors">
                                            LIMPAR TUDO
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                className="flex items-center gap-2 p-1 md:p-1.5 hover:bg-gray-50 rounded-lg transition-all border border-transparent hover:border-gray-100"
                            >
                                <div className="w-8 h-8 bg-stone-100 border border-stone-200 rounded-full flex items-center justify-center text-stone-600 font-medium text-xs">
                                    {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="hidden md:block text-left pr-1">
                                    <p className="text-xs font-semibold text-gray-800 leading-none mb-0.5">{session?.user?.name || 'Vendedor'}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-none">Acesso Sistema</p>
                                </div>
                                <ChevronDown size={14} className={`text-gray-300 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                            </button>

                            {showProfile && (
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 z-50">
                                    <div className="md:hidden px-4 py-3 border-b border-stone-100">
                                        <p className="text-xs font-semibold text-gray-800">{session?.user?.name || 'Vendedor'}</p>
                                        <p className="text-[10px] text-gray-400">{session?.user?.email}</p>
                                    </div>

                                    <Link
                                        href="/dashboard/users"
                                        onClick={() => setShowProfile(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <UsersIcon size={14} />
                                        Gerenciar Usuários
                                    </Link>

                                    <Link
                                        href="/dashboard/settings"
                                        onClick={() => setShowProfile(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
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
