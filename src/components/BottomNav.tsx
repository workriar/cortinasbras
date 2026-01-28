'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, PieChart, Settings, Plus } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-3 flex justify-between items-center z-50 text-xs font-medium text-stone-500 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom">
            <Link
                href="/dashboard"
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-brand-600' : 'hover:text-stone-800'
                    }`}
            >
                <LayoutDashboard size={22} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
                <span>Início</span>
            </Link>

            <Link
                href="/dashboard/crm"
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/crm') ? 'text-brand-600' : 'hover:text-stone-800'
                    }`}
            >
                <Users size={22} strokeWidth={isActive('/dashboard/crm') ? 2.5 : 2} />
                <span>Leads</span>
            </Link>

            <div className="relative -top-6">
                <Link
                    href="/dashboard/crm?new=true"
                    className="flex flex-col items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full text-white shadow-lg hover:shadow-brand-500/30 transition-shadow"
                >
                    <Plus size={28} />
                </Link>
            </div>

            <Link
                href="/dashboard/reports"
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/reports') ? 'text-brand-600' : 'hover:text-stone-800'
                    }`}
            >
                <PieChart size={22} strokeWidth={isActive('/dashboard/reports') ? 2.5 : 2} />
                <span>Relat.</span>
            </Link>

            <Link
                href="/dashboard/settings"
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/settings') ? 'text-brand-600' : 'hover:text-stone-800'
                    }`}
            >
                <Settings size={22} strokeWidth={isActive('/dashboard/settings') ? 2.5 : 2} />
                <span>Ajustes</span>
            </Link>
        </div>
    );
}
