/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "gateway.pinata.cloud/ipfs",
      "https://nft-marketplace-sage-nine.vercel.app",
    ],
  },
};

module.exports = nextConfig;
