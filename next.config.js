/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.pixelproofreviews.com',
        pathname: '/wp-content/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pixelproofreviews.com',
        pathname: '/wp-content/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/category/software-reviews/:path*',
        destination: '/category/tools-software/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
