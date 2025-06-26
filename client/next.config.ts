import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // This is optional and only relevant in dev mode
  allowedDevOrigins: ['http://54.145.126.112'],

  // This works in production
  headers: async () => [
    {
      source: "/_next/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: "*", // or set your domain specifically
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

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//  allowedDevOrigins: ['http://54.145.126.112'],
//   webpackDevMiddleware: config => {
//     config.watchOptions = {
//       poll: 1000,           // check for file changes every second
//       aggregateTimeout: 300 // delay before rebuilding
//     };
//     return config;
//   },
// };

// export default nextConfig;
