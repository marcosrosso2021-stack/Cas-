'use client'

import { useState, type CSSProperties } from 'react'
import { EcranCaso } from '../EcranCaso'

const JOURS = [
  { nom: 'Lun', date: 16 },
  { nom: 'Mar', date: 17 },
  { nom: 'Mer', date: 18 },
  { nom: 'Jeu', date: 19 },
  { nom: 'Ven', date: 20 },
]

interface Intervention {
  id: string
  client: string
  travaux: string
  jour: number
  duree: number
}

const DEPART: Intervention[] = [
  { id: 'martin', client: 'Martin', travaux: 'Salle de bain', jour: 0, duree: 2 },
  { id: 'leroy', client: 'Leroy', travaux: 'Cuisine', jour: 2, duree: 2 },
  { id: 'petit', client: 'Petit', travaux: 'Peinture', jour: 4, duree: 1 },
]

/** L'écran « Mon planning », vue semaine : trois chantiers, que l'on peut décaler d'un jour. */
export function DemoSemaine() {
  const [inter, setInter] = useState(DEPART)
  const bouger = (id: string, d: number) =>
    setInter((liste) => liste.map((x) => (x.id === id ? { ...x, jour: Math.min(JOURS.length - x.duree, Math.max(0, x.jour + d)) } : x)))
  const premier = inter[0]

  return (
    <div>
      <EcranCaso titre="Mon planning" retour>
        <div className="segments fixe" aria-hidden="true">
          <span>Jour</span>
          <span className="actif">Semaine</span>
          <span>Créneaux</span>
        </div>
        <p className="mois" aria-hidden="true">
          Novembre 2026
        </p>
        <div className="jours">
          {JOURS.map((j) => (
            <span className="jour" key={j.nom}>
              {j.nom}
              <b>{j.date}</b>
            </span>
          ))}
          {inter.map((x, i) => (
            <div
              key={x.id}
              className={`inter ap${i === 0 ? ' un' : ''}`}
              style={{ '--j': x.jour, '--d': x.duree, '--a': 0.06 + i * 0.1, gridRow: i + 2 } as CSSProperties}
            >
              <div>
                <b>{x.client}</b>
                <span>{x.travaux}</span>
              </div>
              <nav aria-label={`Déplacer le chantier ${x.client}`}>
                <button type="button" onClick={() => bouger(x.id, -1)} disabled={x.jour === 0} aria-label="Un jour plus tôt">
                  ‹
                </button>
                <button type="button" onClick={() => bouger(x.id, 1)} disabled={x.jour + x.duree >= JOURS.length} aria-label="Un jour plus tard">
                  ›
                </button>
              </nav>
            </div>
          ))}
        </div>
        <p className="pointage ap" style={{ '--a': 0.42 } as CSSProperties}>
          <i />
          {JOURS[premier.jour].nom}. 8 h 02 · arrivée pointée chez Mme Martin
        </p>
      </EcranCaso>
      <p className="mono exemple">Exemple</p>
    </div>
  )
}
