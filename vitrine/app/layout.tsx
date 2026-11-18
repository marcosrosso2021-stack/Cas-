import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './crayon.css'
import './global.css'

export const metadata: Metadata = {
  title: 'casô, du crayon au devis',
  description:
    'casô : devis et factures, 3D de construction et de rénovation, pointage et prix des matériaux pour les artisans du bâtiment.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f2f2ef',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="logo-caso.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
