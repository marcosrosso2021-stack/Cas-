'use client'

import { useShowcase } from '@/store/showcase'

/** Curseur avant / après : il déplace la limite directement dans la pièce en 3D. */
export function BeforeAfterSlider() {
  const partage = useShowcase((s) => s.partage)
  const setPartage = useShowcase((s) => s.setPartage)
  return (
    <div className="curseur">
      <div className="mono">
        <span>Avant</span>
        <span>Après</span>
      </div>
      <input
        id="curseur-avant-apres"
        type="range"
        min={3}
        max={97}
        value={Math.round(partage * 100)}
        onChange={(e) => setPartage(Number(e.target.value) / 100)}
        aria-label="Limite entre avant et après"
      />
    </div>
  )
}
