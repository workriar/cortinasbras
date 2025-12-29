'use client';
import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { SidebarProvider, useSidebar } from '@/components/SidebarContext';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useSidebar();

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-20'
                    }`}
            >
                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="p-6 lg:p-8">
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
        <SessionProvider>
            <SidebarProvider>
                <DashboardContent>{children}</DashboardContent>
            </SidebarProvider>
        </SessionProvider>
    );
}
