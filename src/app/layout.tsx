import './globals.css';
import { Providers } from '@/components/Providers';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Cortinas Brás - Sistema de Gestão',
  description: 'Sistema ERP para gestão de leads e orçamentos da Cortinas Brás',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cortinas Brás',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#d4a93e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-stone-50 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
