import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  images: {
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
    ],  },
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
    ];
  },
};

export default nextConfig;
