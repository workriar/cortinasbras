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
        {/* Google tag (gtag.js) - AW-379796222 */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-379796222"
          strategy="afterInteractive"
        />
        <Script id="google-tag-379796222" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-379796222');
        `}
        </Script>

        {/* Google tag (gtag.js) - AW-17672945118 */}
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

        {/* Google Ads Conversion Events */}
        <Script id="google-ads-conversion-events" strategy="afterInteractive">
          {`
          // Evento de Conversão: Compra
          function gtagConversionCompra() {
            gtag('event', 'ads_conversion_Compra_1', {});
          }

          // Evento de Conversão: Formulário de Orçamento (com delayed navigation)
          function gtagSendEvent(url) {
            var callback = function () {
              if (typeof url === 'string') {
                window.location = url;
              }
            };
            gtag('event', 'ads_conversion_Formul_rio_de_Or_amento_1', {
              'event_callback': callback,
              'event_timeout': 2000,
            });
            return false;
          }

          // Evento de Conversão: Enviar formulário de leads
          function gtagConversionLeads() {
            gtag('event', 'conversion', {
              'send_to': 'AW-17672945118/1K53CJyU4d4bEN77jutB'
            });
          }

          // Disponibilizar globalmente
          window.gtagConversionCompra = gtagConversionCompra;
          window.gtagSendEvent = gtagSendEvent;
          window.gtagConversionLeads = gtagConversionLeads;
        `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
