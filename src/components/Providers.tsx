'use client';

import { ThemeProvider } from 'next-themes';

// Providers para o site público e painel
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
        </ThemeProvider>
    );
}
