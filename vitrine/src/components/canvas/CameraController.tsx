'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { piece, type Vue } from '@/data/maison'
import { useShowcase } from '@/store/showcase'
import { mouvementReduit } from '@/lib/appareil'

const borne = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Caméra de la vitrine.
 * Souris : glisser pour tourner. Tactile : glisser de côté pour tourner, pincer pour zoomer ;
 * un glissement vertical laisse défiler la page. Le zoom passe aussi par les boutons + et −.
 * Choisir une pièce lance une transition vers sa vue.
 */
export function CameraController() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const gl = useThree((s) => s.gl)
  const size = useThree((s) => s.size)

  const v0 = piece('exterieur').vue
  const reduit = mouvementReduit()
  const s = useRef({
    az: v0.az - (reduit ? 0 : 0.9),
    pol: reduit ? v0.pol : 1.32,
    dist: v0.dist * (reduit ? 1 : 1.5),
    cible: new THREE.Vector3(...v0.cible),
    gAz: v0.az,
    gPol: v0.pol,
    gDist: v0.dist,
    gCible: new THREE.Vector3(...v0.cible),
    min: v0.distMin,
    max: v0.distMax,
    decalX: 0,
    decalY: 0,
  })

  // Transition vers la vue de la pièce choisie.
  useEffect(() => {
    const aller = (vue: Vue) => {
      const e = s.current
      const tour = Math.PI * 2
      let az = vue.az
      while (az - e.az > Math.PI) az -= tour
      while (az - e.az < -Math.PI) az += tour
      e.gAz = az
      e.gPol = vue.pol
      e.gDist = vue.dist
      e.min = vue.distMin
      e.max = vue.distMax
      e.gCible.set(...vue.cible)
    }
    return useShowcase.subscribe((etat, avant) => {
      if (etat.piece !== avant.piece) aller(piece(etat.piece).vue)
    })
  }, [])

  // Boutons de zoom de l'interface.
  useEffect(() => {
    const { setCamera } = useShowcase.getState()
    setCamera({
      zoom: (f) => {
        const e = s.current
        e.gDist = borne(e.gDist * f, e.min, e.max)
      },
    })
    return () => setCamera(null)
  }, [])

  // Gestes.
  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'pan-y'
    el.style.cursor = 'grab'
    const doigts = new Map<number, { x: number; y: number }>()
    let ecart = 0

    const bas = (ev: PointerEvent) => {
      doigts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY })
      if (ev.pointerType === 'mouse') {
        el.setPointerCapture(ev.pointerId)
        el.style.cursor = 'grabbing'
      }
      if (doigts.size === 2) {
        const [p, q] = [...doigts.values()]
        ecart = Math.hypot(p.x - q.x, p.y - q.y)
      }
    }
    const bouge = (ev: PointerEvent) => {
      const d = doigts.get(ev.pointerId)
      if (!d) return
      const dx = ev.clientX - d.x
      const dy = ev.clientY - d.y
      d.x = ev.clientX
      d.y = ev.clientY
      const e = s.current
      if (doigts.size === 2) {
        const [p, q] = [...doigts.values()]
        const n = Math.hypot(p.x - q.x, p.y - q.y)
        if (ecart > 0 && n > 0) e.gDist = borne((e.gDist * ecart) / n, e.min, e.max)
        ecart = n
      } else {
        e.gAz -= dx * 0.0055
        if (ev.pointerType === 'mouse') e.gPol = borne(e.gPol - dy * 0.004, 0.3, 1.45)
      }
      if (Math.abs(dx) + Math.abs(dy) > 1 && !useShowcase.getState().touche) useShowcase.getState().setTouche()
    }
    const haut = (ev: PointerEvent) => {
      doigts.delete(ev.pointerId)
      ecart = 0
      el.style.cursor = 'grab'
    }
    const molette = (ev: WheelEvent) => {
      // Molette seule : la page défile. Pincement sur pavé tactile (ctrl) : zoom.
      if (!ev.ctrlKey) return
      ev.preventDefault()
      const e = s.current
      e.gDist = borne(e.gDist * Math.exp(ev.deltaY * 0.01), e.min, e.max)
    }

    el.addEventListener('pointerdown', bas)
    el.addEventListener('pointermove', bouge)
    el.addEventListener('pointerup', haut)
    el.addEventListener('pointercancel', haut)
    el.addEventListener('pointerleave', haut)
    el.addEventListener('wheel', molette, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', bas)
      el.removeEventListener('pointermove', bouge)
      el.removeEventListener('pointerup', haut)
      el.removeEventListener('pointercancel', haut)
      el.removeEventListener('pointerleave', haut)
      el.removeEventListener('wheel', molette)
    }
  }, [gl])

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1)
    const e = s.current
    const etat = useShowcase.getState()
    const k = 1 - Math.exp(-d * 3.2)

    // Rotation lente tant que le visiteur n'a rien touché.
    if (!etat.touche && !reduit) e.gAz += d * 0.05

    e.az += (e.gAz - e.az) * k
    e.pol += (e.gPol - e.pol) * k
    e.dist += (e.gDist - e.dist) * k
    e.cible.lerp(e.gCible, k)

    // Écran étroit : on recule pour garder la maison entière.
    const aspect = size.width / Math.max(1, size.height)
    const large = size.width >= 900
    const recul = Math.max(1, 1.12 / aspect)
    const r = e.dist * recul
    const sp = Math.sin(e.pol)
    camera.position.set(
      e.cible.x + r * sp * Math.sin(e.az),
      e.cible.y + r * Math.cos(e.pol),
      e.cible.z + r * sp * Math.cos(e.az),
    )
    camera.lookAt(e.cible)

    // La maison laisse la place au texte : à droite sur grand écran, plus bas ou plus haut sur téléphone.
    const interieur = piece(etat.piece).toitOuvert
    const vx = large ? -0.19 : 0
    const vy = large ? 0.02 : interieur ? 0.13 : -0.1
    e.decalX += (vx - e.decalX) * k
    e.decalY += (vy - e.decalY) * k
    camera.setViewOffset(size.width, size.height, e.decalX * size.width, e.decalY * size.height, size.width, size.height)
  })

  return null
}
