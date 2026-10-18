import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Each build worker fetches the list on its own. Next starts a new worker
    // every 25 pages by default; one worker keeps it to one AniList request.
    staticGenerationMinPagesPerWorker: 1000,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.anilist.co", pathname: "/file/anilistcdn/**" },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Poster URLs carry a content hash, so a resized copy never goes stale.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
