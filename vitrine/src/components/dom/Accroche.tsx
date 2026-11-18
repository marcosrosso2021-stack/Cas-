'use client'

import { useEffect, useRef, useState } from 'react'
import { borne, rampe } from '@/lib/recit'
import { useShowcase } from '@/store/showcase'

/** Les trois lignes notées au crayon : début et durée de l'écriture, en millisecondes. */
const LIGNES = [
  { texte: 'Mme Martin', debut: 350, duree: 850 },
  { texte: 'salle de bain, 14 m²', debut: 1300, duree: 950 },
  { texte: 'devis pour vendredi !', debut: 2350, duree: 850 },
]
const SOULIGNE = { debut: 3200, duree: 260 }
const CROQUIS = { debut: 3500, duree: 950 }
const MISE_AU_PROPRE = 4650
const DUREE = 7200

/**
 * L'ouverture : un crayon note un chantier sur un carnet, comme le fait un artisan.
 * Puis casô met la note au propre, et le croquis devient la maison.
 * L'animation se joue une fois, ne bloque rien, et s'arrête dès qu'on fait défiler.
 */
export function Accroche() {
  const feuille = useRef<HTMLDivElement>(null)
  const crayon = useRef<HTMLDivElement>(null)
  const lignes = useRef<(HTMLSpanElement | null)[]>([])
  const souligne = useRef<SVGPathElement>(null)
  const croquis = useRef<SVGPathElement>(null)
  const dessin = useRef<SVGSVGElement>(null)
  const [tour, setTour] = useState(0)

  useEffect(() => {
    const f = feuille.current
    const c = crayon.current
    const cr = croquis.current
    const so = souligne.current
    const sv = dessin.current
    if (!f || !c || !cr || !so || !sv) return
    const longCroquis = cr.getTotalLength()
    const longSouligne = so.getTotalLength()
    cr.style.strokeDasharray = String(longCroquis)
    so.style.strokeDasharray = String(longSouligne)

    const appliquer = (t: number) => {
      let pointe: [number, number] | null = null
      let ecrit = false
      LIGNES.forEach((l, i) => {
        const el = lignes.current[i]
        if (!el) return
        const r = borne((t - l.debut) / l.duree)
        el.style.clipPath = `inset(-20% ${(1 - r) * 100}% -20% -4%)`
        if (r > 0 && (r < 1 || !pointe)) {
          pointe = [el.offsetLeft + el.offsetWidth * r, el.offsetTop + el.offsetHeight * 0.74]
          ecrit = r < 1
        }
      })
      const rs = borne((t - SOULIGNE.debut) / SOULIGNE.duree)
      so.style.strokeDashoffset = String(longSouligne * (1 - rs))
      const rc = borne((t - CROQUIS.debut) / CROQUIS.duree)
      cr.style.strokeDashoffset = String(longCroquis * (1 - rc))
      const echelle = sv.clientWidth / 200
      if (rs > 0 && rs < 1) {
        const p = so.getPointAtLength(longSouligne * rs)
        const b = so.ownerSVGElement as SVGSVGElement
        pointe = [b.parentElement!.offsetLeft + (p.x * b.clientWidth) / 200, b.parentElement!.offsetTop + b.clientHeight * 0.5]
        ecrit = true
      }
      if (rc > 0) {
        const p = cr.getPointAtLength(longCroquis * rc)
        pointe = [sv.parentElement!.offsetLeft + p.x * echelle, sv.parentElement!.offsetTop + p.y * echelle]
        ecrit = rc < 1
      }
      // Le crayon suit la pointe, tremble un peu en écrivant, puis se retire.
      const leve = rampe(t, CROQUIS.debut + CROQUIS.duree + 80, CROQUIS.debut + CROQUIS.duree + 520)
      const arrive = rampe(t, 0, 340)
      const [x, y] = pointe ?? [f.clientWidth * 0.2, f.clientHeight * 0.2]
      const tremble = ecrit ? Math.sin(t / 34) * 2.1 : 0
      c.style.transform = `translate(${x + leve * 90 + (1 - arrive) * 120}px, ${y + tremble - leve * 70 - (1 - arrive) * 90}px) rotate(${-52 + (ecrit ? Math.sin(t / 55) * 2.4 : 0) - leve * 10}deg)`
      c.style.opacity = String(arrive * (1 - leve))

      f.style.setProperty('--tr', rampe(t, MISE_AU_PROPRE, MISE_AU_PROPRE + 800).toFixed(3))
      f.style.setProperty('--dk', rampe(t, MISE_AU_PROPRE + 900, MISE_AU_PROPRE + 1750).toFixed(3))
      f.style.setProperty('--fin', rampe(t, DUREE - 700, DUREE).toFixed(3))
    }

    const partir = () => useShowcase.getState().setDepart()
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduit) {
      appliquer(DUREE)
      partir()
      return
    }

    let image = 0
    const t0 = performance.now()
    const avancer = (maintenant: number) => {
      const t = maintenant - t0
      appliquer(t)
      if (t > MISE_AU_PROPRE - 250) partir()
      if (t < DUREE) image = requestAnimationFrame(avancer)
    }
    image = requestAnimationFrame(avancer)

    // Le visiteur fait défiler : on ne le retient pas, l'histoire se termine d'un coup.
    const passer = () => {
      cancelAnimationFrame(image)
      appliquer(DUREE)
      partir()
    }
    window.addEventListener('scroll', passer, { once: true, passive: true })
    return () => {
      cancelAnimationFrame(image)
      window.removeEventListener('scroll', passer)
    }
  }, [tour])

  return (
    <div className="accroche" ref={feuille}>
      <div className="carnet" aria-hidden="true">
        <div className="papier" />
        <div className="note">
          {LIGNES.map((l, i) => (
            <span
              key={l.texte}
              ref={(el) => {
                lignes.current[i] = el
              }}
            >
              {l.texte}
            </span>
          ))}
          <div className="souligne">
            <svg viewBox="0 0 200 10" fill="none">
              <path ref={souligne} d="M4 6c30-4 60 3 96-1s62 2 92-2" stroke="#2b2b33" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="croquis">
            <svg ref={dessin} viewBox="0 0 200 96" fill="none">
              <path
                ref={croquis}
                d="M14 12L186 9L189 86L12 88L14 12M96 11L97 50M14 52L72 50M97 50L150 51M150 51Q150 30 172 30M120 51L121 87"
                stroke="#2b2b33"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <i className="balai" />
      </div>

      <div className="propre">
        <p className="propre-tete">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="logo-caso.png" alt="" width={26} height={26} />
          Chantier Martin
        </p>
        <dl>
          <dt>Client</dt>
          <dd>Mme Martin</dd>
          <dt>Travaux</dt>
          <dd>Salle de bain, 14 m²</dd>
          <dt>Devis</dt>
          <dd>
            <b>À envoyer vendredi</b>
          </dd>
        </dl>
        <button type="button" className="revoir mono" onClick={() => setTour((n) => n + 1)}>
          Revoir le crayon
        </button>
      </div>

      <div className="crayon" ref={crayon} aria-hidden="true">
        <svg viewBox="-4 -14 156 28" width="156" height="28">
          <path d="M0 0L11 -3.6V3.6Z" fill="#2b2b33" />
          <path d="M11 -3.6L27 -8.5V8.5L11 3.6Z" fill="#e6c9a0" />
          <rect x="27" y="-8.5" width="94" height="17" fill="#ffc21a" />
          <rect x="27" y="-2.8" width="94" height="5.6" fill="#e0a800" opacity="0.55" />
          <rect x="121" y="-8.5" width="12" height="17" fill="#b9b9b4" />
          <path d="M124 -8.5v17M128 -8.5v17" stroke="#8c8c88" strokeWidth="1" />
          <rect x="133" y="-8.5" width="13" height="17" rx="4" fill="#18181a" />
        </svg>
      </div>
    </div>
  )
}
