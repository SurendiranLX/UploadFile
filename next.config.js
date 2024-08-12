/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        "firebasestorage.googleapis.com",
      ],
    },
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin-allow-popups',
            },
          ],
        },
      ];
    },
  };
  
  module.exports = nextConfig;