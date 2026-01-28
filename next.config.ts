import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  eslint: {
    // Disable ESLint during builds since we handle it separately
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
