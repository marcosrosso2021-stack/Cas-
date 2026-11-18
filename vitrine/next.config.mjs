/** Vitrine casô : site exporté en fichiers statiques (dossier out/), sans serveur Next.js en production. */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  devIndicators: false,
}

export default nextConfig
