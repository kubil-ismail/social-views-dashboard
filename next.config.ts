/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ["@sparticuz/chromium", "playwright-core"],
  },
};

module.exports = nextConfig;
