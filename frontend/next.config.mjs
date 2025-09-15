/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Simple configuration to avoid hydration issues
  experimental: {
    forceSwcTransforms: true,
  },
}

export default nextConfig
