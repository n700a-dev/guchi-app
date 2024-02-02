/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: false,
  // FIX: Could not run hot reload in windows
  // https://github.com/vercel/next.js/issues/36774
  // webpackDevMiddleware: config => {
  //   config.watchOptions = {
  //       poll: 1000,
  //       aggregateTimeout: 300,
  //   }
  //   return config
  // },
}

module.exports = nextConfig
