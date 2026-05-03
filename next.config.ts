import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  images: {
    // Cache images for 1 year (browser will use cached version)
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/@:username',
        destination: '/users/:username',
      },
      {
        source: '/@:username/lists/:listId',
        destination: '/users/:username/lists/:listId',
      },
      {
        source: '/@:username/watchlist',
        destination: '/users/:username/watchlist',
      },
    ];
  },
};

export default nextConfig;
