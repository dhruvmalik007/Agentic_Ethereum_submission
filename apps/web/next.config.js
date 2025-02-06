/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui"],
  experimental: {
    externalDir: true,
  }
};

export default nextConfig;
