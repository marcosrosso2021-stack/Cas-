'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { COUPE, DEBORD, H, LX, LZ, piece } from '@/data/maison'
import { rampe, recit } from '@/lib/recit'
import { PlanTechnique } from './maison/PlanTechnique'
import { anim, borne, doux } from './maison/anim'
import { useShowcase } from '@/store/showcase'
import { mouvementReduit } from '@/lib/appareil'
import { useMatieres } from './matieres/MatieresContext'
import { Murs } from './maison/Murs'
import { ExteriorScene } from './ExteriorScene'
import { InteriorScene } from './InteriorScene'

/** Arrive un peu trop loin, puis se pose. */
const pose = (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2)

/**
 * La maison de démonstration, construite dans le code.
 * Entrée : les murs montent, puis le toit se pose.
 * Quand une pièce est choisie, le haut des murs se replie et le toit s'efface.
 */
export function HouseScene() {
  const { communs } = useMatieres()
  const haut = useRef<THREE.Group>(null)
  const toit = useRef<THREE.Group>(null)
  const interieur = useRef<THREE.Group>(null)
  const plan = useRef<THREE.Group>(null)
  const etat = useRef({ entree: mouvementReduit() ? 1 : 0, ouvert: 0, eclat: 0 })

  useFrame((horloge, dt) => {
    const d = Math.min(dt, 0.1)
    const s = etat.current
    const { mode, piece: id, depart } = useShowcase.getState()
    // La maison attend la fin de l'histoire du crayon.
    if (depart) s.entree = Math.min(1, s.entree + d / 3.4)
    const cible = mode === 'renov' || (mode === 'libre' && piece(id).toitOuvert) ? 1 : 0
    s.ouvert += (cible - s.ouvert) * (1 - Math.exp(-d * 4.5))
    // Vue éclatée : le toit et le haut des murs se soulèvent avec le défilement.
    const eclatCible = mode === 'eclate' ? rampe(recit.p[3], 0.08, 0.5) : 0
    s.eclat += (eclatCible - s.eclat) * (1 - Math.exp(-d * 6))

    anim.entree = s.entree
    anim.ouvert = s.ouvert
    anim.eclat = s.eclat

    // Le plan se trace, les murs montent l'un après l'autre (voir Murs), puis le toit se pose.
    const eToit = borne((s.entree - 0.72) / 0.28)
    const flotte = Math.sin(horloge.clock.elapsedTime * 1.1)
    if (plan.current) plan.current.visible = s.entree < 0.97

    if (haut.current) {
      haut.current.position.y = COUPE + s.eclat * (2.6 + flotte * 0.05)
      haut.current.visible = s.entree > 0.3 && s.ouvert < 0.99
    }
    if (toit.current) {
      const opacite = doux(eToit) * (1 - s.ouvert)
      toit.current.position.y = (1 - pose(eToit)) * 3.2 + s.ouvert * 6 + s.eclat * (6.2 + flotte * 0.09)
      toit.current.visible = opacite > 0.02
      communs.toit.opacity = communs.toitBord.opacity = opacite
      communs.toit.depthWrite = communs.toitBord.depthWrite = opacite > 0.95
    }
    if (interieur.current) interieur.current.visible = s.entree > 0.45
  })

  return (
    <group>
      <ExteriorScene />
      <group ref={plan}>
        <PlanTechnique />
      </group>
      <group ref={interieur}>
        <InteriorScene />
      </group>
      <Murs couche="bas" />
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
        {/* panneaux solaires, fenêtre de toit, sortie de toit */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[2.2 + i * 1.08, H + 0.42, -2.6]} rotation={[-0.16, 0, 0]} material={communs.toitBord} castShadow>
            <boxGeometry args={[1.0, 0.04, 1.7]} />
          </mesh>
        ))}
        <mesh position={[-3.4, H + 0.42, 1.6]} material={communs.toitBord} castShadow>
          <boxGeometry args={[1.5, 0.1, 1.1]} />
        </mesh>
        <mesh position={[-3.4, H + 0.475, 1.6]} material={communs.verre}>
          <boxGeometry args={[1.34, 0.02, 0.94]} />
        </mesh>
        <mesh position={[4.9, H + 0.62, 2.9]} material={communs.toit} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
        </mesh>
      </group>
    </group>
  )
}
