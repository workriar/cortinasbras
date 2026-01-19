import Script from 'next/script';

export default function ObrigadoPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Obrigado!</h1>
            <p className="text-lg text-gray-600 mb-8">
                Seu contato foi recebido com sucesso. Em breve entraremos em contato.
            </p>
            {/* Google Ads Conversion Event */}
            <Script id="google-ads-conversion" strategy="afterInteractive">
                {`
          gtag('event', 'conversion', {
            'send_to': 'AW-17672945118/1K53CJyU4d4bEN77jutB'
          });
        `}
            </Script>
        </main>
    );
}
