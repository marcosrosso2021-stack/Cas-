'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { COUPE, DEBORD, H, LX, LZ, piece } from '@/data/maison'
import { useShowcase } from '@/store/showcase'
import { mouvementReduit } from '@/lib/appareil'
import { useMatieres } from './matieres/MatieresContext'
import { Murs } from './maison/Murs'
import { ExteriorScene } from './ExteriorScene'
import { InteriorScene } from './InteriorScene'

const borne = (v: number) => Math.min(1, Math.max(0, v))
const doux = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * La maison de démonstration, construite dans le code.
 * Entrée : les murs montent, puis le toit se pose.
 * Quand une pièce est choisie, le haut des murs se replie et le toit s'efface.
 */
export function HouseScene() {
  const { communs } = useMatieres()
  const bas = useRef<THREE.Group>(null)
  const haut = useRef<THREE.Group>(null)
  const toit = useRef<THREE.Group>(null)
  const interieur = useRef<THREE.Group>(null)
  const etat = useRef({ entree: mouvementReduit() ? 1 : 0, ouvert: 0 })

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1)
    const s = etat.current
    s.entree = Math.min(1, s.entree + d / 2.6)
    const cible = piece(useShowcase.getState().piece).toitOuvert ? 1 : 0
    s.ouvert += (cible - s.ouvert) * (1 - Math.exp(-d * 4.5))

    const eBas = doux(borne(s.entree / 0.5))
    const eHaut = doux(borne((s.entree - 0.3) / 0.45))
    const eToit = doux(borne((s.entree - 0.6) / 0.4))

    if (bas.current) bas.current.scale.y = Math.max(0.001, eBas)
    if (haut.current) {
      const e = eHaut * (1 - s.ouvert)
      haut.current.scale.y = Math.max(0.001, e)
      haut.current.visible = e > 0.01
    }
    if (toit.current) {
      const opacite = eToit * (1 - s.ouvert)
      toit.current.position.y = (1 - eToit) * 4 + s.ouvert * 6
      toit.current.visible = opacite > 0.02
      communs.toit.opacity = communs.toitBord.opacity = opacite
      communs.toit.depthWrite = communs.toitBord.depthWrite = opacite > 0.95
    }
    if (interieur.current) interieur.current.visible = s.entree > 0.45
  })

  return (
    <group>
      <ExteriorScene />
      <group ref={interieur}>
        <InteriorScene />
      </group>
      <group ref={bas}>
        <Murs couche="bas" />
      </group>
      <group ref={haut} position={[0, COUPE, 0]}>
        <Murs couche="haut" />
      </group>
      <group ref={toit}>
        <mesh position={[0, H + 0.14, 0]} material={communs.toit} castShadow receiveShadow>
          <boxGeometry args={[2 * LX + 2 * DEBORD, 0.28, 2 * LZ + 2 * DEBORD]} />
        </mesh>
        <mesh position={[0, H + 0.3, 0]} material={communs.toitBord} castShadow>
          <boxGeometry args={[2 * LX + 2 * DEBORD + 0.06, 0.07, 2 * LZ + 2 * DEBORD + 0.06]} />
        </mesh>
        <mesh position={[0, H + 0.345, 0]} material={communs.toit}>
          <boxGeometry args={[2 * LX + 2 * DEBORD - 0.4, 0.03, 2 * LZ + 2 * DEBORD - 0.4]} />
        </mesh>
      </group>
    </group>
  )
}
