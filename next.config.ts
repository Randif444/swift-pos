import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Mengizinkan optimasi gambar dari semua bucket Supabase [cite: 2026-03-06]
      },
    ],
  },
};

export default nextConfig;