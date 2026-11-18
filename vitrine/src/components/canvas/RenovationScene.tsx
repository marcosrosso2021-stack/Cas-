'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COUPE, ZONES, piece } from '@/data/maison'
import { useShowcase } from '@/store/showcase'
import { useMatieres, PLAN_APRES, PLAN_AVANT } from './matieres/MatieresContext'

/**
 * Avant / après dans la scène : deux plans de coupe suivent le curseur,
 * et un trait jaune marque la limite dans la pièce.
 */
export function RenovationScene() {
  const { communs } = useMatieres()
  const limite = useRef<THREE.Group>(null)
  const voile = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#ffc21a', transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }),
    [],
  )
  useEffect(() => () => voile.dispose(), [voile])

  useFrame(() => {
    const etat = useShowcase.getState()
    const zone = piece(etat.piece).zone
    const actif = etat.renov && !!zone
    if (limite.current) limite.current.visible = actif
    if (!actif || !zone) return
    const z = ZONES[zone]
    const x = z.x0 + (z.x1 - z.x0) * etat.partage
    PLAN_AVANT.constant = x
    PLAN_APRES.constant = -x
    if (limite.current) {
      limite.current.position.set(x, 0, (z.z0 + z.z1) / 2)
      limite.current.scale.set(1, 1, z.z1 - z.z0 - 0.2)
    }
  })

  return (
    <group ref={limite} visible={false}>
      <mesh position={[0, 0.03, 0]} material={communs.jaune}>
        <boxGeometry args={[0.06, 0.05, 1]} />
      </mesh>
      <mesh position={[0, COUPE / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={voile}>
        <planeGeometry args={[1, COUPE]} />
      </mesh>
    </group>
  )
}
