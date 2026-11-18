'use client'

import { MOMENTS } from '@/data/contenu'
import { useShowcase } from '@/store/showcase'

/** Va au moment `i`, un peu après son début pour que la démonstration soit lancée. */
export function allerAuMoment(i: number) {
  const el = document.getElementById(`moment-${i}`)
  if (!el) return
  const haut = el.getBoundingClientRect().top + window.scrollY
  const course = Math.max(0, el.offsetHeight - window.innerHeight)
  const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: i === 0 ? 0 : haut - 62 + course * 0.3, behavior: doux ? 'smooth' : 'auto' })
}

/** Les huit moments de la visite : on peut aller à n'importe lequel. */
export function Rail() {
  const chapitre = useShowcase((s) => s.chapitre)
  return (
    <nav className="rail" aria-label="Moments de la visite">
      {MOMENTS.map((m, i) => (
        <button key={m.rail} type="button" aria-current={chapitre === i ? 'step' : undefined} onClick={() => allerAuMoment(i)}>
          <span>{m.rail}</span>
          <i />
        </button>
      ))}
    </nav>
  )
}
