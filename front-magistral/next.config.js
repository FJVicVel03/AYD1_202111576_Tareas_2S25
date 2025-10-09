/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'AYD1_202111576_Tareas_2S25';

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // Habilitar exportación estática para GitHub Pages
  output: 'export',
  // BasePath y assetPrefix para rutas correctas en Pages (/<usuario>.github.io/<repo>/)
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    // Requerido al usar next/image con exportación estática
    unoptimized: true
  }
};

module.exports = nextConfig;
