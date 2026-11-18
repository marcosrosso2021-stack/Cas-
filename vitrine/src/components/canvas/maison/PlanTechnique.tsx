'use client'

import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LX, LZ, MURS } from '@/data/maison'

/**
 * Le plan technique de la maison, tracé au sol : murs, ouvertures et lignes de cote.
 * Il s'affiche à l'ouverture, puis s'efface quand les murs montent.
 */
export function PlanTechnique() {
  const { geometrie, matiere } = useMemo(() => {
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
      // deux traits par mur, interrompus aux ouvertures
      let s = 0
      const coupes = [...m.ouvertures].sort((p, q) => p.s - q.s)
      const segment = (a: number, b: number) => {
        if (b - a < 0.01) return
        for (const k of [1, -1]) trait(m.a[0] + ux * a + nx * k, m.a[1] + uz * a + nz * k, m.a[0] + ux * b + nx * k, m.a[1] + uz * b + nz * k)
      }
      for (const o of coupes) {
        segment(s, o.s)
        // tableau de l'ouverture
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
        horizontal ? trait(x, z - 0.25, x, z + 0.25) : trait(x - 0.25, z, x + 0.25, z)
    }
    cote(-LX, LZ + 1.1, LX, LZ + 1.1)
    cote(LX + 1.1, -LZ, LX + 1.1, LZ)

    // trame au sol, tous les mètres
    const trame: number[] = []
    for (let x = -LX - 2; x <= LX + 2; x++) trame.push(x, 0.02, -LZ - 2, x, 0.02, LZ + 2)
    for (let z = -LZ - 2; z <= LZ + 2; z++) trame.push(-LX - 2, 0.02, z, LX + 2, 0.02, z)

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute([...pts, ...trame], 3))
    g.addGroup(0, pts.length / 3, 0)
    g.addGroup(pts.length / 3, trame.length / 3, 1)
    const fort = new THREE.LineBasicMaterial({ color: '#18181a', transparent: true })
    const leger = new THREE.LineBasicMaterial({ color: '#18181a', transparent: true })
    return { geometrie: g, matiere: [fort, leger] }
  }, [])

  useEffect(
    () => () => {
      geometrie.dispose()
      matiere.forEach((m) => m.dispose())
    },
    [geometrie, matiere],
  )

  useFrame((etat) => {
    // L'opacité est décidée par HouseScene, sur le groupe parent.
    const parent = etat.scene.getObjectByName('plan-technique')?.parent
    const o = (parent?.userData.opacite as number | undefined) ?? 0
    matiere[0].opacity = o
    matiere[1].opacity = o * 0.14
  })

  return <lineSegments name="plan-technique" geometry={geometrie} material={matiere} />
}
