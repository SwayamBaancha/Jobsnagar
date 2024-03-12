/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "accountingbaancha.s3.ap-south-1.amazonaws.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
