import * as THREE from 'three'
import { H, type Mur } from '@/data/maison'

export interface Rect {
  s0: number
  s1: number
  y0: number
  y1: number
}

/** Parties pleines d'un mur, une fois les ouvertures retirées. */
export function pleins(mur: Mur, longueur: number): Rect[] {
  const out: Rect[] = []
  const ouv = [...mur.ouvertures].sort((p, q) => p.s - q.s)
  let s = 0
  for (const o of ouv) {
    if (o.s > s) out.push({ s0: s, s1: o.s, y0: 0, y1: H })
    if (o.y0 > 0) out.push({ s0: o.s, s1: o.e, y0: 0, y1: o.y0 })
    if (o.y1 < H) out.push({ s0: o.s, s1: o.e, y0: o.y1, y1: H })
    s = o.e
  }
  if (s < longueur) out.push({ s0: s, s1: longueur, y0: 0, y1: H })
  return out
}

/** Garde la partie d'un rectangle comprise dans une bande [a, b] × [ya, yb]. */
export function couper(r: Rect, a: number, b: number, ya: number, yb: number): Rect | null {
  const s0 = Math.max(r.s0, a)
  const s1 = Math.min(r.s1, b)
  const y0 = Math.max(r.y0, ya)
  const y1 = Math.min(r.y1, yb)
  return s1 - s0 > 0.005 && y1 - y0 > 0.005 ? { s0, s1, y0, y1 } : null
}

/** Plan dont la texture se répète une fois par mètre. */
export function planMetres(l: number, h: number, decalU = 0, decalV = 0): THREE.PlaneGeometry {
  const g = new THREE.PlaneGeometry(l, h)
  const uv = g.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * l + decalU, uv.getY(i) * h + decalV)
  return g
}

export const longueurMur = (m: Mur) => Math.hypot(m.b[0] - m.a[0], m.b[1] - m.a[1])
