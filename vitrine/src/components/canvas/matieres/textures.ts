import * as THREE from 'three'

/**
 * Textures dessinées dans le navigateur : aucun fichier image à télécharger.
 * Chaque texture représente 1 m × 1 m de matière, puis se répète.
 */

function alea(graine: number) {
  let a = graine >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function texture(taille: number, dessin: (c: CanvasRenderingContext2D, t: number) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = taille
  const c = canvas.getContext('2d')
  if (c) dessin(c, taille)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function nuance(hex: string, d: number): string {
  const c = new THREE.Color(hex)
  c.offsetHSL(0, 0, d)
  return `#${c.getHexString()}`
}

/** Lames de bois : `lames` lames par mètre. */
export function bois(base: string, lames = 6, graine = 7): THREE.CanvasTexture {
  return texture(512, (c, t) => {
    const r = alea(graine)
    const h = t / lames
    for (let i = 0; i < lames; i++) {
      c.fillStyle = nuance(base, (r() - 0.5) * 0.07)
      c.fillRect(0, i * h, t, h)
      c.globalAlpha = 0.1
      c.strokeStyle = nuance(base, -0.16)
      for (let k = 0; k < 7; k++) {
        const y = i * h + r() * h
        c.beginPath()
        c.moveTo(0, y)
        c.bezierCurveTo(t * 0.3, y + (r() - 0.5) * 5, t * 0.7, y + (r() - 0.5) * 5, t, y)
        c.stroke()
      }
      c.globalAlpha = 1
      c.fillStyle = nuance(base, -0.2)
      c.fillRect(0, i * h, t, 1.5)
      c.fillRect(r() * t, i * h, 1.5, h)
    }
  })
}

/** Carrelage : `n` carreaux par mètre. */
export function carrelage(base: string, joint: string, n = 2, graine = 3, damier?: string): THREE.CanvasTexture {
  return texture(512, (c, t) => {
    const r = alea(graine)
    const p = t / n
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const fond = damier && (i + j) % 2 ? damier : base
        c.fillStyle = nuance(fond, (r() - 0.5) * 0.035)
        c.fillRect(i * p, j * p, p, p)
      }
    c.fillStyle = joint
    for (let i = 0; i < n; i++) {
      c.fillRect(i * p - 1.5, 0, 3, t)
      c.fillRect(0, i * p - 1.5, t, 3)
    }
  })
}

/** Surface minérale légèrement nuagée : béton, gazon, enduit. */
export function grain(base: string, force = 0.05, graine = 11): THREE.CanvasTexture {
  return texture(256, (c, t) => {
    const r = alea(graine)
    c.fillStyle = base
    c.fillRect(0, 0, t, t)
    for (let i = 0; i < 2600; i++) {
      c.fillStyle = nuance(base, (r() - 0.5) * force * 2)
      c.globalAlpha = 0.5
      const s = 1 + r() * 5
      c.fillRect(r() * t, r() * t, s, s)
    }
    c.globalAlpha = 1
  })
}
