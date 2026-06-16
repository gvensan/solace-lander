import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native module — must not be bundled; loaded at runtime on the server.
  serverExternalPackages: ["better-sqlite3"],
  images: {
    // YouTube video thumbnails (sidebar "Latest Videos" tile).
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
};

export default nextConfig;
