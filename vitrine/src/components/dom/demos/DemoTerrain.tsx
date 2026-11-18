'use client'

import { useEffect, useState } from 'react'
import { suivre } from '@/lib/recit'
import { BarreChat, EcranCaso } from '../EcranCaso'

const GESTES = ['Photo', 'Note', 'Filmer'] as const

/** Sur le chantier, au téléphone : une photo, une note, la pièce filmée. */
export function DemoTerrain() {
  const [auto, setAuto] = useState(0)
  const [choisi, setChoisi] = useState<number | null>(null)
  // Le défilement fait passer d'un geste au suivant, tant que le visiteur n'a pas choisi.
  useEffect(() => suivre(2, (p) => setAuto(p < 0.36 ? 0 : p < 0.58 ? 1 : 2)), [])
  const vue = choisi ?? auto

  return (
    <EcranCaso>
      <div className="segments" role="group" aria-label="Geste sur le chantier">
        {GESTES.map((g, i) => (
          <button key={g} type="button" aria-pressed={vue === i} onClick={() => setChoisi(i)}>
            {g}
          </button>
        ))}
      </div>
      <div className="fil">
        {vue === 0 && (
          <div className="msg-moi image">
            <svg viewBox="0 0 240 150" role="img" aria-label="Photo d’exemple : un mur de salle de bain">
              <rect width="240" height="150" fill="#d9cea8" />
              <g stroke="#b9ad86" strokeWidth="1">
                {[30, 60, 90, 120, 150, 180, 210].map((x) => (
                  <path key={x} d={`M${x} 0v92`} />
                ))}
                {[23, 46, 69].map((y) => (
                  <path key={y} d={`M0 ${y}h240`} />
                ))}
              </g>
              <rect y="92" width="240" height="58" fill="#b08f66" />
              <rect x="18" y="72" width="150" height="50" rx="8" fill="#e6dcc4" />
              <rect x="28" y="80" width="130" height="12" rx="6" fill="#cfc4a6" />
              <rect x="186" y="26" width="34" height="42" fill="#eef1ef" stroke="#8f8468" />
            </svg>
            <span>Photo de chantier · 9 h 32</span>
          </div>
        )}
        {vue === 1 && (
          <>
            <p className="msg-moi">Faïence à déposer. Arrivée d’eau à déplacer. Baignoire remplacée par une douche.</p>
            <div className="msg-bot">
              <strong>Note rangée</strong>
              <span>Chantier Martin</span>
            </div>
          </>
        )}
        {vue === 2 && (
          <>
            <div className="film">
              <i />
              <b />
            </div>
            <p className="msg-bot">Fais le tour de la pièce, lentement. Je la remonte en 3D.</p>
          </>
        )}
      </div>
      <BarreChat />
    </EcranCaso>
  )
}
