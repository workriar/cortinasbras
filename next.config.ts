import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  // PDFKit é um módulo CommonJS nativo — não deve ser bundlado pelo webpack
  serverExternalPackages: ['pdfkit'],
  // Garante que os arquivos de dados do PDFKit (.afm, .icc) sejam
  // incluídos no file-tracing do Next.js para as rotas que geram PDF.
  outputFileTracingIncludes: {
    '/api/catalog': ['./node_modules/pdfkit/js/data/**'],
    '/api/leads': ['./node_modules/pdfkit/js/data/**'],
  },
  images: {
    // Otimização ativa: Next.js converte automaticamente para WebP/AVIF
    // e redimensiona para o dispositivo (até 70% menos tamanho)
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
