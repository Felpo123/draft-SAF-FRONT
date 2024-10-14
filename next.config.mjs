/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['mapbox-gl'] = 'maplibre-gl'
    return config
  },
}
export default nextConfig
