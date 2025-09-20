// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // La ligne 'appDir: true' a été supprimée.
  },
  images: {
    domains: [
      'flagcdn.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    EXCHANGE_API_KEY: process.env.EXCHANGE_API_KEY,
    FIXER_API_KEY: process.env.FIXER_API_KEY,
    CURRENCY_API_KEY: process.env.CURRENCY_API_KEY,
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=900, stale-while-revalidate=3600',
        },
      ],
    },
  ],
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;