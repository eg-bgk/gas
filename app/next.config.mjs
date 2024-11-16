import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Required for RainbowKit
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pvmrjqrafikkwqcvrosf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/assets/**",
      },
    ],
  },
};

// export default withBundleAnalyzer(nextConfig);
export default nextConfig;
