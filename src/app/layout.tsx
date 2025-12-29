'use client';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head />
      <body className="bg-gradient-to-br from-brand-50 to-brand-100 min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
