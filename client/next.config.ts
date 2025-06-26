import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['http://54.145.126.112'], // ✅ This is correct
};

export default nextConfig;
