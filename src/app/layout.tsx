import './globals.css';
import Script from 'next/script';
import { Providers } from '@/components/Providers';
import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-stone-50 min-h-screen font-sans selection:bg-brand-500/30">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17672945118"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-17672945118');
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
