/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Ensure API routes work properly on Vercel
  experimental: {
    serverComponentsExternalPackages: ['@ai-sdk/openai'],
  },
};

export default nextConfig; 