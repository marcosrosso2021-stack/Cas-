'use client'

import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import { piece } from '@/data/maison'
import { useShowcase } from '@/store/showcase'
import { mouvementReduit } from '@/lib/appareil'

/** Repères posés sur les éléments de la pièce affichée : nom et mesure d'exemple. */
export function RoomHotspots() {
  const id = useShowcase((s) => s.piece)
  const renov = useShowcase((s) => s.renov)
  const [pret, setPret] = useState(false)

  // Les repères arrivent après l'animation d'entrée, puis après chaque transition.
  useEffect(() => {
    setPret(false)
    const t = setTimeout(() => setPret(true), mouvementReduit() ? 0 : id === 'exterieur' ? 2600 : 900)
    return () => clearTimeout(t)
  }, [id])

  if (!pret || renov) return null
  return (
    <>
      {piece(id).reperes.map((r) => (
        <Html key={`${id}-${r.id}`} position={r.pos} center zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
          <div className="repere">
            <i />
            <span>
              {r.nom} <b>{r.valeur}</b>
            </span>
          </div>
        </Html>
      ))}
    </>
  )
}
