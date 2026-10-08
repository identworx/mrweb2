import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/professional", destination: "/pro", permanent: true },
      { source: "/en/professional", destination: "/en/pro", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/media/file/:path*",
      },
    ];
  },
};

export default nextConfig;
