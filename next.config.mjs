/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
      async rewrites() {
          return [
            {
              source: '/geoserver/:path*',
              destination: 'http://192.168.1.116:8080/geoserver/:path*', // Proxy hacia GeoServer
            },
          ];
        },
        webpack: (config) => {
          config.resolve.alias['mapbox-gl'] = 'maplibre-gl';
          return config;
        },
  };
  export default nextConfig;