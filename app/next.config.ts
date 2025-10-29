import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "portfolio.ftcare-i.com",
        pathname: "/wp-content/**",
      },
    ],
  },
};

export default nextConfig;
