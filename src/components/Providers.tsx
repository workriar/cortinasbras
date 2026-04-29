'use client';

// Providers para o site público — sem SessionProvider do NextAuth
// (O SessionProvider fica apenas no layout do dashboard/admin)
export function Providers({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
