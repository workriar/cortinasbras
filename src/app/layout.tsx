import './globals.css';
import Script from 'next/script';
import { Providers } from '@/components/Providers';
import ScrollToTop from '@/components/ScrollToTop';
import { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Cortinas Brás - Cortinas Sob Medida e Fábrica no Brás, São Paulo',
  description: 'Especialistas em cortinas sob medida, persianas e enxovais de luxo. Fábrica própria no Brás, São Paulo. Atendemos toda a capital e região metropolitana. Orçamento grátis!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cortinas Brás',
  },
  openGraph: {
    title: 'Cortinas Brás - Fábrica de Cortinas no Brás, SP',
    description: 'Cortinas sob medida com fabricação própria. Mais de 20 anos de tradição em São Paulo.',
    url: 'https://cortinasbras.com.br',
    siteName: 'Cortinas Brás',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cortinas Brás - Fábrica no Brás, SP',
    description: 'Cortinas sob medida com fabricação própria. Orçamento grátis!',
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
  // Permitir zoom: melhor acessibilidade e Lighthouse score
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
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
        <ScrollToTop />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
