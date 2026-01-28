'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    KanbanSquare
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
    const { isExpanded, toggleSidebar } = useSidebar();
    const pathname = usePathname();

    const menuItems = [
        {
            name: 'Dashboard',
            icon: <LayoutDashboard size={22} strokeWidth={1.5} />,
            path: '/dashboard',
        },
        {
            name: 'CRM',
            icon: <KanbanSquare size={22} strokeWidth={1.5} />,
            path: '/dashboard/crm',
            badge: '3',
        },
        {
            name: 'Chat',
            icon: <MessageSquare size={22} strokeWidth={1.5} />,
            path: '/dashboard/chat',
        },
        {
            name: 'Relatórios',
            icon: <BarChart3 size={22} strokeWidth={1.5} />,
            path: '/dashboard/reports',
        },
        {
            name: 'Usuários',
            icon: <Users size={22} strokeWidth={1.5} />,
            path: '/dashboard/users',
        },
        {
            name: 'Configurações',
            icon: <Settings size={22} strokeWidth={1.5} />,
            path: '/dashboard/settings',
        },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-brand-950 text-brand-50 transition-all duration-300 ease-in-out z-40 shadow-2xl overflow-hidden flex flex-col ${isExpanded ? 'w-64' : 'w-20'
                }`}
        >
            {/* Header */}
            <div className="flex items-center h-20 px-4 border-b border-white/5 shrink-0">
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        <motion.div
                            key="expanded-logo"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
                        >
                            <Image
                                src="/static/logo.png"
                                alt="Cortinas Brás"
                                width={40}
                                height={40}
                                className="h-10 w-auto object-contain"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed-logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="mx-auto"
                        >
                            <Image
                                src="/static/logo.png"
                                alt="CB"
                                width={32}
                                height={32}
                                className="w-8 h-auto object-contain"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {isExpanded && (
                    <button
                        onClick={toggleSidebar}
                        className="ml-auto p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            {!isExpanded && (
                <button
                    onClick={toggleSidebar}
                    className="mx-auto mt-6 p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
                >
                    <ChevronLeft
                        size={18}
                        className="rotate-180"
                    />
                </button>
            )}

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${isActive
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                }`}
                        >
                            <div className="flex-shrink-0">
                                {item.icon}
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex-1 flex items-center justify-between overflow-hidden whitespace-nowrap"
                                    >
                                        <span className="text-sm font-medium">{item.name}</span>
                                        {item.badge && (
                                            <span className="bg-stone-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                                {item.badge}
                                            </span>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!isExpanded && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl z-50">
                                    {item.name}
                                </div>
                            )}

                            {isActive && !isExpanded && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 shrink-0">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all group"
                >
                    <LogOut size={22} strokeWidth={1.5} />
                    {isExpanded && <span className="text-sm font-medium">Encerrar Sessão</span>}
                </button>
            </div>
        </aside>
    );
}
