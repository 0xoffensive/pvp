import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export", // Enable static export
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
};

export default nextConfig;
