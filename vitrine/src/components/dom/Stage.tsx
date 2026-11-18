'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { SIGNATURE, SOUS_TITRE, TITRE } from '@/data/contenu'
import { piece as pieceDe } from '@/data/maison'
import { niveauGraphique, webglDisponible } from '@/lib/appareil'
import { useShowcase } from '@/store/showcase'
import { BeforeAfterSlider } from './BeforeAfterSlider'
import { Fleche } from './Icone'
import { MaterialSelector } from './MaterialSelector'
import { Plan2D } from './Plan2D'
import { RoomExplorer } from './RoomExplorer'

// La 3D est téléchargée après le texte, et seulement dans le navigateur.
const Hero3D = dynamic(() => import('@/components/canvas/Hero3D'), { ssr: false })

/** Carte de la pièce affichée : nom, mesure, et la rénovation avant / après. */
function PanneauPiece() {
  const id = useShowcase((s) => s.piece)
  const renov = useShowcase((s) => s.renov)
  const setRenov = useShowcase((s) => s.setRenov)
  const setPiece = useShowcase((s) => s.setPiece)
  const webgl = useShowcase((s) => s.webgl)
  const p = pieceDe(id)
  if (id === 'exterieur') return null
  return (
    <aside className="panneau carte" key={id} aria-live="polite">
      <header>
        <button type="button" className="rond" onClick={() => setPiece('exterieur')} aria-label="Revenir à la maison entière">
          <Fleche sens="gauche" />
        </button>
        <h2>{p.nom}</h2>
        <span className="mono">{p.mesure}</span>
      </header>
      <p className="phrase">{p.phrase}</p>
      {p.zone && webgl && (
        <>
          <button type="button" className="bascule" aria-pressed={renov} onClick={() => setRenov(!renov)}>
            Rénover cette pièce
            <i />
          </button>
          {renov && (
            <div className="renov">
              <BeforeAfterSlider />
              <MaterialSelector />
            </div>
          )}
        </>
      )}
      <p className="note mono">Maison et mesures d’exemple</p>
    </aside>
  )
}

/** L'écran d'ouverture : la maison 3D, le titre, puis l'exploration pièce par pièce. */
export function Stage() {
  const ref = useRef<HTMLElement>(null)
  const id = useShowcase((s) => s.piece)
  const webgl = useShowcase((s) => s.webgl)
  const touche = useShowcase((s) => s.touche)
  const camera = useShowcase((s) => s.camera)
  const setPiece = useShowcase((s) => s.setPiece)

  useEffect(() => {
    const { setWebgl, setQualite, setVisible } = useShowcase.getState()
    // ?qualite=high|medium|low force un niveau graphique, pour les essais.
    const force = new URLSearchParams(window.location.search).get('qualite')
    setQualite(force === 'high' || force === 'medium' || force === 'low' ? force : niveauGraphique())
    setWebgl(webglDisponible())
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.02 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="scene" id="maison" ref={ref} aria-label="La maison casô en 3D">
      <div className="scene-3d">
        {webgl === true && <Hero3D />}
        {webgl === false && <Plan2D />}
      </div>

      <div className={`intro${id === 'exterieur' ? '' : ' cache'}`}>
        <p className="mono">{SIGNATURE}</p>
        <h1>{TITRE}</h1>
        <p className="sous">{SOUS_TITRE}</p>
        <div className="actions">
          <a className="btn" href="#parcours">
            Découvrir casô
          </a>
          <button type="button" className="btn clair" onClick={() => setPiece('salon')}>
            Explorer la maison 3D
          </button>
        </div>
      </div>

      <PanneauPiece />
      <RoomExplorer />

      {webgl && (
        <>
          <p className={`geste mono${touche ? ' cache' : ''}`}>Glissez pour faire tourner la maison</p>
          <div className="zoom">
            <button type="button" className="rond" onClick={() => camera?.zoom(1.22)} aria-label="Reculer">
              −
            </button>
            <button type="button" className="rond" onClick={() => camera?.zoom(0.82)} aria-label="Approcher">
              +
            </button>
          </div>
        </>
      )}
    </section>
  )
}
