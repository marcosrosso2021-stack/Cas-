import type { Qualite } from '@/store/showcase'

/** WebGL est-il disponible ? Sinon la vitrine affiche le plan 2D. */
export function webglDisponible(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Trois niveaux graphiques.
 * high : ordinateur performant. medium : téléphone récent. low : appareil limité.
 */
export function niveauGraphique(): Qualite {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  const mobile = /Android|iPhone|iPad|iPod/i.test(nav.userAgent) || (nav.maxTouchPoints > 1 && /Mac/.test(nav.userAgent))
  const coeurs = nav.hardwareConcurrency ?? 4
  const memoire = nav.deviceMemory ?? 8
  if (nav.connection?.saveData || memoire <= 2 || coeurs <= 2) return 'low'
  if (mobile) return memoire <= 4 || coeurs <= 4 ? 'low' : 'medium'
  return coeurs >= 8 && memoire >= 8 ? 'high' : 'medium'
}

export const mouvementReduit = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
