�import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cortinas Brás — Transforme seu ambiente | Cortinas sob medida em São Paulo",
  description: "Transforme seu ambiente com cortinas sob medida em São Paulo. Cortinas Wave, blackout e enxovais premium. Fabricação própria, entrega em até 48h e instalação especializada. Solicite orçamento pelo WhatsApp.",
  keywords: ["cortinas sob medida", "cortina wave", "trilho suiço", "enxoval premium", "são paulo", "brás"],
  authors: [{ name: "Cortinas Brás" }],
  openGraph: {
    title: "Cortinas Brás — Cortinas Sob Medida, Cortina Wave e Enxoval Premium",
    description: "Cortinas sob medida São Paulo • Cortina wave trilho suíço • Cortinas blackout SP. Fabricação própria, entrega rápida e atendimento personalizado.",
    images: ["/static/logo.png"],
    locale: "pt-BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cortinas Brás — Transforme seu ambiente",
    description: "Cortinas sob medida em São Paulo com fabricação própria e entrega rápida.",
    images: ["/static/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-brand-50 text-brand-700`}>
        {children}

        {/* Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17672945118"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17672945118');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1369616001422186');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1369616001422186&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  );
}
�"(3aaa15f6da881e5e1c3f791e24c6d9b44e3873122(file:///root/next-app/src/app/layout.tsx:file:///root