'use client';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { SidebarProvider, useSidebar } from '@/components/SidebarContext';

import BottomNav from '@/components/BottomNav';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useSidebar();

    return (
        <div className="flex min-h-screen bg-stone-50">
            {/* Sidebar - Desktop Only */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Bottom Navigation - Mobile Only */}
            <BottomNav />

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 w-full ${isExpanded ? 'md:ml-64' : 'md:ml-20'
                    }`}
            >
                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="p-4 md:p-8 pb-24 md:pb-8"> {/* pb-24 for mobile nav */}
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardContent>{children}</DashboardContent>
        </SidebarProvider>
    );
}
