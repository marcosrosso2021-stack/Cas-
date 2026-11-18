'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { LIENS } from '@/config/liens'
import { AUSSI, MOMENTS, ORIGINES } from '@/data/contenu'
import { borne, publier } from '@/lib/recit'
import { useShowcase, type Statut } from '@/store/showcase'
import { BeforeAfterSlider } from './BeforeAfterSlider'
import { DemoAppel } from './demos/DemoAppel'
import { DemoDevis } from './demos/DemoDevis'
import { DemoPoint } from './demos/DemoPoint'
import { DemoPrix } from './demos/DemoPrix'
import { DemoVeille } from './demos/DemoVeille'
import { Accroche } from './Accroche'
import { DemoSemaine } from './demos/DemoSemaine'
import { DemoTerrain } from './demos/DemoTerrain'
import { Fleche } from './Icone'
import { MaterialSelector } from './MaterialSelector'
import { allerAuMoment } from './Rail'
import { RoomExplorer } from './RoomExplorer'

/**
 * Lit le défilement une fois par image et en déduit l'avancement de chaque moment.
 * L'avancement est écrit dans la variable CSS --p du moment (pour les apparitions)
 * et publié pour la scène 3D et les démonstrations.
 */
function useFilDuRecit(racine: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = racine.current
    if (!el) return
    const moments = [...el.querySelectorAll<HTMLElement>('[data-ch]')]
    let demande = 0
    const lire = () => {
      demande = 0
      const vh = window.innerHeight
      let actif = useShowcase.getState().chapitre
      moments.forEach((m, i) => {
        const r = m.getBoundingClientRect()
        const p = borne((0.35 * vh - r.top) / Math.max(1, r.height - 0.65 * vh))
        m.style.setProperty('--p', p.toFixed(4))
        publier(i, p)
        if (r.top <= vh * 0.5 && r.bottom > vh * 0.5) actif = i
      })
      // Après le dernier moment, la 3D reste éteinte.
      const dernier = moments[moments.length - 1].getBoundingClientRect()
      if (dernier.bottom <= vh * 0.5) actif = moments.length - 1
      useShowcase.getState().setChapitre(actif)
    }
    const prevoir = () => {
      if (!demande) demande = requestAnimationFrame(lire)
    }
    lire()
    window.addEventListener('scroll', prevoir, { passive: true })
    window.addEventListener('resize', prevoir)
    return () => {
      cancelAnimationFrame(demande)
      window.removeEventListener('scroll', prevoir)
      window.removeEventListener('resize', prevoir)
    }
  }, [racine])
}

function Moment({
  i,
  hauteur,
  troisD,
  large,
  demo,
  children,
}: {
  i: number
  hauteur: string
  troisD?: boolean
  large?: boolean
  demo?: ReactNode
  children?: ReactNode
}) {
  const m = MOMENTS[i]
  return (
    <section className={`ch${troisD ? ' trois-d' : ''}`} data-ch={i} id={`moment-${i}`} style={{ '--h': hauteur } as CSSProperties}>
      <div className="ch-colle">
        <div className="ch-texte">
          <p className="mono">{m.heure}</p>
          <h2>{m.titre}</h2>
          <p className="ch-p">{m.texte}</p>
          {children}
        </div>
        {demo && <div className={`ch-demo${large ? ' large' : ''}`}>{demo}</div>}
      </div>
    </section>
  )
}

/** D'où vient chaque cote : trois origines, et ce qu'une vidéo ne garantit pas. */
function Origines() {
  const statut = useShowcase((s) => s.statut)
  const setStatut = useShowcase((s) => s.setStatut)
  return (
    <>
      <div className="origines" role="group" aria-label="Origine des cotes">
        {(Object.keys(ORIGINES) as Statut[]).map((id) => (
          <button key={id} type="button" className={id} aria-pressed={statut === id} onClick={() => setStatut(statut === id ? null : id)}>
            <i />
            {ORIGINES[id].nom}
          </button>
        ))}
      </div>
      <p className="dit" aria-live="polite">
        {statut ? ORIGINES[statut].phrase : 'Une vidéo ne garantit pas une cote au millimètre : casô vous montre lesquelles vérifier.'}
      </p>
    </>
  )
}

function Ouverture() {
  const m = MOMENTS[0]
  const webgl = useShowcase((s) => s.webgl)
  const touche = useShowcase((s) => s.touche)
  const camera = useShowcase((s) => s.camera)
  const depart = useShowcase((s) => s.depart)
  return (
    <section className={`ch trois-d ouverture${depart ? ' parti' : ''}`} data-ch={0} id="moment-0">
      <div className="ch-colle">
        <div className="ch-texte">
          <p className="mono">{m.heure}</p>
          <h1>{m.titre}</h1>
          <p className="ch-p">{m.texte}</p>
          <div className="actions">
            <a className="btn jaune" href={LIENS.creerCompte} target="_blank" rel="noopener">
              Essayer casô <Fleche />
            </a>
            <button type="button" className="btn clair" onClick={() => allerAuMoment(1)}>
              Voir une journée
            </button>
          </div>
        </div>
      </div>
      <Accroche />
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

/** La visite guidée : une journée d'artisan, en huit moments. */
export function Recit() {
  const racine = useRef<HTMLDivElement>(null)
  useFilDuRecit(racine)
  const webgl = useShowcase((s) => s.webgl)

  return (
    <div ref={racine}>
      <Ouverture />
      <Moment i={1} hauteur="190svh" demo={<DemoAppel />} />
      <Moment i={2} hauteur="190svh" demo={<DemoTerrain />} />
      <Moment i={3} hauteur="240svh" troisD>
        <Origines />
      </Moment>
      <Moment i={4} hauteur="170svh" troisD>
        {webgl !== false && (
          <div className="renov carte">
            <BeforeAfterSlider />
            <MaterialSelector />
          </div>
        )}
        <p className="mono exemple">Démonstration</p>
      </Moment>
      <Moment i={5} hauteur="190svh" demo={<DemoPrix />} />
      <Moment i={6} hauteur="200svh" large demo={<DemoDevis />} />
      <Moment i={7} hauteur="190svh" demo={<DemoSemaine />} />
      <Moment i={8} hauteur="190svh" demo={<DemoVeille />} />
      <Moment i={9} hauteur="180svh" demo={<DemoPoint />}>
        <ul className="aussi" aria-label="Aussi dans casô">
          {AUSSI.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </Moment>
    </div>
  )
}
