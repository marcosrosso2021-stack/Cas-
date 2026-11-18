'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LX, LZ, MURS } from '@/data/maison'
import { anim, borne } from './anim'

/**
 * Le plan de la maison, tracé au sol trait après trait comme au crayon :
 * murs, ouvertures et lignes de cote. Il s'efface quand les murs sont montés.
 */
export function PlanTechnique() {
  const traits = useRef<THREE.LineSegments>(null)
  const { plan, trame, crayon, leger } = useMemo(() => {
    const pts: number[] = []
    const trait = (x1: number, z1: number, x2: number, z2: number) => pts.push(x1, 0.03, z1, x2, 0.03, z2)

    for (const m of MURS) {
      const dx = m.b[0] - m.a[0]
      const dz = m.b[1] - m.a[1]
      const l = Math.hypot(dx, dz)
      const ux = dx / l
      const uz = dz / l
      const nx = (-uz * m.ep) / 2
      const nz = (ux * m.ep) / 2
      let s = 0
      const coupes = [...m.ouvertures].sort((p, q) => p.s - q.s)
      const segment = (a: number, b: number) => {
        if (b - a < 0.01) return
        for (const k of [1, -1]) trait(m.a[0] + ux * a + nx * k, m.a[1] + uz * a + nz * k, m.a[0] + ux * b + nx * k, m.a[1] + uz * b + nz * k)
      }
      for (const o of coupes) {
        segment(s, o.s)
        for (const t of [o.s, o.e]) trait(m.a[0] + ux * t + nx, m.a[1] + uz * t + nz, m.a[0] + ux * t - nx, m.a[1] + uz * t - nz)
        s = o.e
      }
      segment(s, l)
    }

    // lignes de cote, avec leurs repères
    const cote = (x1: number, z1: number, x2: number, z2: number) => {
      trait(x1, z1, x2, z2)
      const horizontal = z1 === z2
      for (const [x, z] of [
        [x1, z1],
        [x2, z2],
      ])
        if (horizontal) trait(x, z - 0.25, x, z + 0.25)
        else trait(x - 0.25, z, x + 0.25, z)
    }
    cote(-LX, LZ + 1.1, LX, LZ + 1.1)
    cote(LX + 1.1, -LZ, LX + 1.1, LZ)

    // trame au sol, tous les mètres
    const carreaux: number[] = []
    for (let x = -LX - 2; x <= LX + 2; x++) carreaux.push(x, 0.02, -LZ - 2, x, 0.02, LZ + 2)
    for (let z = -LZ - 2; z <= LZ + 2; z++) carreaux.push(-LX - 2, 0.02, z, LX + 2, 0.02, z)

    const g1 = new THREE.BufferGeometry()
    g1.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    const g2 = new THREE.BufferGeometry()
    g2.setAttribute('position', new THREE.Float32BufferAttribute(carreaux, 3))
    return {
      plan: g1,
      trame: g2,
      crayon: new THREE.LineBasicMaterial({ color: '#18181a', transparent: true }),
      leger: new THREE.LineBasicMaterial({ color: '#18181a', transparent: true, opacity: 0 }),
    }
  }, [])

  useEffect(
    () => () => {
      plan.dispose()
      trame.dispose()
      crayon.dispose()
      leger.dispose()
    },
    [plan, trame, crayon, leger],
  )

  useFrame(() => {
    const reste = 1 - borne((anim.entree - 0.62) / 0.33)
    const total = plan.attributes.position.count
    // Le trait avance : deux sommets par segment.
    plan.setDrawRange(0, Math.floor((total / 2) * borne(anim.entree / 0.24)) * 2)
    crayon.opacity = reste
    leger.opacity = 0.13 * reste * borne(anim.entree / 0.08)
  })

  return (
    <>
      <lineSegments geometry={trame} material={leger} />
      <lineSegments ref={traits} geometry={plan} material={crayon} />
    </>
  )
}
