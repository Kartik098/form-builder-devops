import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // This is optional and only relevant in dev mode
  allowedDevOrigins: ['http://frontend:3000'],

  // This works in production (optional CORS headers for static assets)
  headers: async () => [
    {
      source: "/_next/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: "*", // Consider locking this down to your domain in production
        },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET,OPTIONS",
        },
      ],
    },
  ],
};

export default nextConfig;
