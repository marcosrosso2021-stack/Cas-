'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { niveauGraphique, webglDisponible } from '@/lib/appareil'
import { useShowcase } from '@/store/showcase'
import { Plan2D } from './Plan2D'

// La 3D est téléchargée après le texte, et seulement dans le navigateur.
const Hero3D = dynamic(() => import('@/components/canvas/Hero3D'), { ssr: false })

/**
 * La maison 3D, fixée derrière la page.
 * Elle n'est visible, et ne calcule, qu'aux moments de la visite qui s'en servent.
 */
export function Fond3D() {
  const webgl = useShowcase((s) => s.webgl)
  const vu = useShowcase((s) => s.mode !== 'cache')

  useEffect(() => {
    const { setWebgl, setQualite, setVisible } = useShowcase.getState()
    // ?qualite=high|medium|low force un niveau graphique, pour les essais.
    const force = new URLSearchParams(window.location.search).get('qualite')
    setQualite(force === 'high' || force === 'medium' || force === 'low' ? force : niveauGraphique())
    setWebgl(webglDisponible())
    const onglet = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onglet)
    return () => document.removeEventListener('visibilitychange', onglet)
  }, [])

  return (
    <div className={`fond3d${vu ? ' vu' : ''}`} aria-hidden={!vu}>
      {webgl === true && <Hero3D />}
      {webgl === false && <Plan2D />}
    </div>
  )
}
