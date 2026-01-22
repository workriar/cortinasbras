import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone',
  // Validações de TypeScript habilitadas
  typescript: {
    ignoreBuildErrors: false,
  },
  productionBrowserSourceMaps: false,
  // Reduzir cache de build
  generateEtags: false,
};

export default nextConfig;
