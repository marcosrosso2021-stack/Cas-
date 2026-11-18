'use client'

import { useEffect, useState } from 'react'
import { suivre } from '@/lib/recit'

const GESTES = ['Photo', 'Note', 'Filmer'] as const

/** Sur le chantier, au téléphone : une photo, une note, la pièce filmée. */
export function DemoTerrain() {
  const [auto, setAuto] = useState(0)
  const [choisi, setChoisi] = useState<number | null>(null)
  // Le défilement fait passer d'un geste au suivant, tant que le visiteur n'a pas choisi.
  useEffect(() => suivre(2, (p) => setAuto(p < 0.38 ? 0 : p < 0.6 ? 1 : 2)), [])
  const vue = choisi ?? auto

  return (
    <div className="tel">
      <div className="tel-ecran">
        <div className="tel-vue">
          {vue === 0 && (
            <>
              <svg viewBox="0 0 240 180" role="img" aria-label="Photo d’exemple : un mur de salle de bain">
                <rect width="240" height="180" fill="#d9cea8" />
                <g stroke="#b9ad86" strokeWidth="1">
                  {[30, 60, 90, 120, 150, 180, 210].map((x) => (
                    <path key={x} d={`M${x} 0v110`} />
                  ))}
                  {[27, 55, 82].map((y) => (
                    <path key={y} d={`M0 ${y}h240`} />
                  ))}
                </g>
                <rect y="110" width="240" height="70" fill="#b08f66" />
                <rect x="18" y="88" width="150" height="56" rx="8" fill="#e6dcc4" />
                <rect x="28" y="96" width="130" height="14" rx="6" fill="#cfc4a6" />
                <rect x="186" y="34" width="34" height="46" fill="#eef1ef" stroke="#8f8468" />
              </svg>
              <p className="mono">Photo de chantier · 9 h 32</p>
            </>
          )}
          {vue === 1 && (
            <>
              <p className="mono">Note dictée</p>
              <p className="ligne">Faïence à déposer.</p>
              <p className="ligne">Arrivée d’eau à déplacer.</p>
              <p className="ligne">Baignoire remplacée par une douche.</p>
            </>
          )}
          {vue === 2 && (
            <>
              <div className="film">
                <i />
                <b />
              </div>
              <p className="mono">Faites le tour de la pièce, lentement</p>
            </>
          )}
        </div>
        <div className="tel-barre">
          {GESTES.map((g, i) => (
            <button key={g} type="button" aria-pressed={vue === i} onClick={() => setChoisi(i)}>
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
