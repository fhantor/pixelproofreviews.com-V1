/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.pixelproofreviews.com',
        pathname: '/wp-content/**',
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
