import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
 allowedDevOrigins: ['http://54.145.126.112:3000'], 
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,           // check for file changes every second
      aggregateTimeout: 300 // delay before rebuilding
    };
    return config;
  },
};

export default nextConfig;
