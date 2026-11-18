'use client'

import { useEffect, useRef } from 'react'
import { Html } from '@react-three/drei'
import { COTES, type Cote } from '@/data/maison'
import { suivre } from '@/lib/recit'
import { useShowcase } from '@/store/showcase'

/** Une cote et son origine. Elle apparaît quand la visite atteint son seuil. */
function Pastille({ cote }: { cote: Cote }) {
  const ref = useRef<HTMLDivElement>(null)
  const statut = useShowcase((s) => s.statut)
  useEffect(
    () =>
      suivre(3, (p) => {
        const el = ref.current
        if (!el) return
        const o = Math.min(1, Math.max(0, (p - cote.seuil) * 16))
        el.style.opacity = String(o)
        el.style.transform = `translateY(${(1 - o) * 10}px)`
      }),
    [cote.seuil],
  )
  const attenue = statut !== null && statut !== cote.origine
  return (
    <div ref={ref} className={`cote ${cote.origine}${attenue ? ' attenue' : ''}`} style={{ opacity: 0 }}>
      <i />
      <span>
        {cote.nom} <b>{cote.valeur}</b>
      </span>
    </div>
  )
}

/** Les cotes du séjour, posées sur la maison éclatée, chacune avec son origine. */
export function MeasurementViewer() {
  const actif = useShowcase((s) => s.mode === 'eclate')
  if (!actif) return null
  return (
    <>
      {COTES.map((c) => (
        <Html key={c.id} position={c.pos} center zIndexRange={[20, 10]} style={{ pointerEvents: 'none' }}>
          <Pastille cote={c} />
        </Html>
      ))}
    </>
  )
}
