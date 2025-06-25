import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,           // check for file changes every second
      aggregateTimeout: 300 // delay before rebuilding
    };
    return config;
  },
};

export default nextConfig;
