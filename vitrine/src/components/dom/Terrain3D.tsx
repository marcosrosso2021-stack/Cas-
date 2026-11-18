'use client'

import { useEffect, useRef } from 'react'

/**
 * La photo de chantier en relief : la scène au fond, le téléphone détaché devant,
 * les étiquettes de casô qui flottent au premier plan. Tout est en CSS 3D
 * (aucun WebGL), piloté par le défilement et, à la souris, par le pointeur.
 */
export function Terrain3D() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (calme) {
      el.style.setProperty('--p', '1')
      return
    }
    let vu = false
    let id = 0
    // cible (souris) et valeur lissée
    let cx = 0
    let cy = 0
    let x = 0
    let y = 0

    const image = () => {
      id = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.5 + r.height * 0.5)))
      x += (cx - x) * 0.08
      y += (cy - y) * 0.08
      el.style.setProperty('--p', p.toFixed(4))
      el.style.setProperty('--mx', x.toFixed(4))
      el.style.setProperty('--my', y.toFixed(4))
      if (vu) id = requestAnimationFrame(image)
    }
    const obs = new IntersectionObserver(([e]) => {
      vu = e.isIntersecting
      if (vu && !id) id = requestAnimationFrame(image)
    })
    obs.observe(el)

    const bouge = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = el.getBoundingClientRect()
      cx = ((e.clientX - r.left) / r.width - 0.5) * 2
      cy = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const sort = () => {
      cx = 0
      cy = 0
    }
    el.addEventListener('pointermove', bouge)
    el.addEventListener('pointerleave', sort)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(id)
      el.removeEventListener('pointermove', bouge)
      el.removeEventListener('pointerleave', sort)
    }
  }, [])

  return (
    <section className="terrain" ref={ref} aria-label="casô sur le chantier">
      <div className="terrain-texte">
        <span className="sur">Sur le chantier</span>
        <h2>Le carnet reste sur l’établi.</h2>
        <p>Une phrase dite au téléphone, et le client comme le chantier sont rangés.</p>
      </div>
      <div className="terrain-scene">
        <div className="terrain-plan">
          <img className="terrain-fond" src="terrain-martin.webp" alt="Un artisan tient son téléphone sur un chantier ; son carnet et son crayon sont posés sur l’établi." width={1600} height={893} loading="lazy" />
          <img className="terrain-tel" src="terrain-martin.webp" alt="" aria-hidden="true" width={1600} height={893} loading="lazy" />
          <span className="terrain-puce un" aria-hidden="true"><i />Client créé</span>
          <span className="terrain-puce deux" aria-hidden="true"><i />Chantier créé</span>
          <span className="terrain-note" aria-hidden="true">devis pour vendredi !</span>
        </div>
        <span className="terrain-legende">Image d’illustration</span>
      </div>
    </section>
  )
}
