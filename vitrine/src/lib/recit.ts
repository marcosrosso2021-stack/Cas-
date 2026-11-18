/**
 * Le fil de la visite : où en est chaque moment à l'écran, de 0 à 1.
 *
 * Ces valeurs changent à chaque image pendant le défilement. Elles ne passent
 * pas par React : la scène 3D et les démonstrations les lisent directement,
 * pour que le défilement reste fluide.
 */
export const NB_CHAPITRES = 8

export const recit = {
  /** Avancement de chaque moment, de 0 (il arrive) à 1 (il repart). */
  p: new Array<number>(NB_CHAPITRES).fill(0),
}

type Ecoute = (p: number) => void
const ecoutes = new Map<number, Set<Ecoute>>()

/** Appelle `fn` à chaque changement d'avancement du moment `i`. Rend la fonction d'arrêt. */
export function suivre(i: number, fn: Ecoute): () => void {
  let groupe = ecoutes.get(i)
  if (!groupe) ecoutes.set(i, (groupe = new Set()))
  groupe.add(fn)
  fn(recit.p[i])
  return () => {
    groupe.delete(fn)
  }
}

export function publier(i: number, p: number) {
  if (Math.abs(recit.p[i] - p) < 0.0005) return
  recit.p[i] = p
  ecoutes.get(i)?.forEach((fn) => fn(p))
}

export const borne = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
/** Passe de 0 à 1 entre `a` et `b`, en douceur. */
export const rampe = (p: number, a: number, b: number) => {
  const t = borne((p - a) / (b - a))
  return t * t * (3 - 2 * t)
}
