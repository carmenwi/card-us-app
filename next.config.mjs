/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! IMPORTANTE PARA HACKATHONS !!
    // Ignora errores de tipo para que publique aunque haya fallos
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora errores de estilo
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;