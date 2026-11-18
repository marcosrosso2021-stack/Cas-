'use client'

import { useMemo } from 'react'
import type * as THREE from 'three'
import { ZONES, type PieceId, type ZoneId } from '@/data/maison'
import { useShowcase } from '@/store/showcase'
import { useVariantes } from './matieres/MatieresContext'
import type { Jeu, Variante } from './matieres/materiaux'
import { planMetres } from './maison/geometrie'

type V3 = [number, number, number]

/** Un volume simple : position du centre, dimensions, matière. */
function B({ p, s, m, ombre = true }: { p: V3; s: V3; m: THREE.Material; ombre?: boolean }) {
  return (
    <mesh position={p} material={m} castShadow={ombre} receiveShadow>
      <boxGeometry args={s} />
    </mesh>
  )
}

function Plante({ p, jeu }: { p: V3; jeu: Jeu }) {
  return (
    <group position={p}>
      <mesh position={[0, 0.22, 0]} material={jeu.laque} castShadow>
        <cylinderGeometry args={[0.2, 0.16, 0.44, 16]} />
      </mesh>
      <mesh position={[0, 0.85, 0]} material={jeu.plante} castShadow>
        <icosahedronGeometry args={[0.42, 1]} />
      </mesh>
    </group>
  )
}

function Salon({ jeu }: { jeu: Jeu; v: Variante }) {
  return (
    <>
      <B p={[-3.2, 0.02, 1.85]} s={[3.0, 0.02, 2.0]} m={jeu.tapis} ombre={false} />
      {/* canapé */}
      <B p={[-3.2, 0.28, 2.75]} s={[2.3, 0.36, 0.95]} m={jeu.tissu} />
      <B p={[-3.2, 0.62, 3.14]} s={[2.3, 0.5, 0.2]} m={jeu.tissu} />
      <B p={[-4.27, 0.48, 2.75]} s={[0.18, 0.4, 0.95]} m={jeu.tissu} />
      <B p={[-2.13, 0.48, 2.75]} s={[0.18, 0.4, 0.95]} m={jeu.tissu} />
      <B p={[-3.7, 0.54, 2.9]} s={[0.5, 0.16, 0.4]} m={jeu.tissu2} />
      {/* table basse */}
      <B p={[-3.2, 0.3, 1.75]} s={[1.1, 0.05, 0.6]} m={jeu.bois} />
      <B p={[-3.2, 0.14, 1.75]} s={[0.9, 0.28, 0.4]} m={jeu.metal} />
      {/* meuble et écran */}
      <B p={[-3.2, 0.24, 0.32]} s={[2.0, 0.42, 0.4]} m={jeu.bois} />
      <B p={[-3.2, 1.05, 0.2]} s={[1.35, 0.76, 0.05]} m={jeu.ecran} />
      {/* fauteuil */}
      <B p={[-5.05, 0.26, 1.5]} s={[0.8, 0.34, 0.8]} m={jeu.tissu2} />
      <B p={[-5.38, 0.56, 1.5]} s={[0.16, 0.5, 0.8]} m={jeu.tissu2} />
      <Plante p={[-0.6, 0, 0.55]} jeu={jeu} />
    </>
  )
}

function Cuisine({ jeu, v }: { jeu: Jeu; v: Variante }) {
  return (
    <>
      {/* colonne et linéaire, le long du mur est */}
      <B p={[5.54, 1.05, 0.5]} s={[0.62, 2.1, 0.65]} m={jeu.facade} />
      <B p={[5.54, 0.43, 2.32]} s={[0.62, 0.86, 2.95]} m={jeu.facade} />
      <B p={[5.52, 0.88, 2.32]} s={[0.66, 0.04, 2.95]} m={jeu.plan} />
      <B p={[5.5, 0.905, 1.6]} s={[0.5, 0.012, 0.6]} m={jeu.ecran} ombre={false} />
      <B p={[5.5, 0.9, 3.0]} s={[0.45, 0.02, 0.55]} m={jeu.metal} ombre={false} />
      {v === 'apres' ? (
        <>
          {/* îlot */}
          <B p={[2.9, 0.44, 1.9]} s={[2.0, 0.88, 0.9]} m={jeu.facade} />
          <B p={[2.9, 0.9, 1.9]} s={[2.1, 0.04, 1.0]} m={jeu.plan} />
          {[2.3, 2.9, 3.5].map((x) => (
            <group key={x} position={[x, 0, 2.75]}>
              <mesh position={[0, 0.66, 0]} material={jeu.bois} castShadow>
                <cylinderGeometry args={[0.18, 0.18, 0.05, 20]} />
              </mesh>
              <mesh position={[0, 0.32, 0]} material={jeu.metal}>
                <cylinderGeometry args={[0.025, 0.025, 0.64, 8]} />
              </mesh>
            </group>
          ))}
        </>
      ) : (
        <>
          {/* table et chaises */}
          <B p={[2.9, 0.74, 2.0]} s={[1.5, 0.05, 0.85]} m={jeu.bois} />
          <B p={[2.9, 0.36, 2.0]} s={[1.3, 0.7, 0.08]} m={jeu.bois} />
          {(
            [
              [2.45, 1.35],
              [3.35, 1.35],
              [2.45, 2.65],
              [3.35, 2.65],
            ] as [number, number][]
          ).map(([x, z]) => (
            <B key={`${x}${z}`} p={[x, 0.24, z]} s={[0.42, 0.48, 0.42]} m={jeu.tissu} />
          ))}
        </>
      )}
      <Plante p={[0.6, 0, 0.55]} jeu={jeu} />
    </>
  )
}

function Chambre({ jeu }: { jeu: Jeu; v: Variante }) {
  return (
    <>
      <B p={[-4.3, 0.02, -2.0]} s={[2.6, 0.02, 2.6]} m={jeu.tapis} ombre={false} />
      {/* lit */}
      <B p={[-4.8, 0.2, -2.0]} s={[2.05, 0.3, 1.7]} m={jeu.bois} />
      <B p={[-4.78, 0.44, -2.0]} s={[1.98, 0.2, 1.6]} m={jeu.laque} />
      <B p={[-4.2, 0.56, -2.0]} s={[1.1, 0.06, 1.62]} m={jeu.tissu} />
      <B p={[-5.82, 0.62, -2.0]} s={[0.08, 1.05, 1.8]} m={jeu.tissu2} />
      <B p={[-5.45, 0.6, -2.4]} s={[0.4, 0.12, 0.62]} m={jeu.laque} />
      <B p={[-5.45, 0.6, -1.6]} s={[0.4, 0.12, 0.62]} m={jeu.laque} />
      {/* chevets */}
      <B p={[-5.6, 0.24, -3.2]} s={[0.45, 0.48, 0.45]} m={jeu.bois} />
      <B p={[-5.6, 0.24, -0.8]} s={[0.45, 0.48, 0.45]} m={jeu.bois} />
      {/* armoire */}
      <B p={[-1.42, 1.1, -2.6]} s={[0.6, 2.2, 2.4]} m={jeu.laque} />
    </>
  )
}

function Bain({ jeu, v }: { jeu: Jeu; v: Variante }) {
  return (
    <>
      {/* meuble vasque et miroir */}
      <B p={[0.9, 0.5, -3.6]} s={[1.3, 0.55, 0.5]} m={jeu.bois} />
      <B p={[0.9, 0.8, -3.6]} s={[1.34, 0.05, 0.54]} m={jeu.plan} />
      <B p={[0.9, 0.86, -3.6]} s={[0.55, 0.08, 0.36]} m={jeu.ceramique} />
      <B p={[0.9, 1.55, -3.86]} s={[1.1, 0.8, 0.03]} m={jeu.verre} ombre={false} />
      {/* toilettes */}
      <B p={[2.12, 0.21, -1.9]} s={[0.4, 0.42, 0.56]} m={jeu.ceramique} />
      <B p={[2.3, 0.6, -1.9]} s={[0.16, 0.5, 0.4]} m={jeu.ceramique} />
      {v === 'apres' ? (
        <>
          {/* douche à l'italienne */}
          <B p={[-0.45, 0.02, -3.1]} s={[0.9, 0.03, 1.6]} m={jeu.metal} ombre={false} />
          <B p={[0.02, 1.0, -3.1]} s={[0.02, 2.0, 1.6]} m={jeu.verre} ombre={false} />
          <B p={[-0.86, 1.6, -3.5]} s={[0.04, 0.9, 0.04]} m={jeu.metal} />
        </>
      ) : (
        <>
          {/* baignoire */}
          <B p={[-0.5, 0.29, -3.0]} s={[0.8, 0.58, 1.75]} m={jeu.ceramique} />
          <B p={[-0.5, 0.57, -3.0]} s={[0.62, 0.04, 1.55]} m={jeu.laque} ombre={false} />
        </>
      )}
      <B p={[1.3, 0.015, -1.4]} s={[0.9, 0.02, 0.6]} m={jeu.tapis} ombre={false} />
    </>
  )
}

function Entree({ jeu }: { jeu: Jeu; v: Variante }) {
  return (
    <>
      <B p={[5.55, 0.23, -1.3]} s={[0.45, 0.42, 1.4]} m={jeu.bois} />
      <B p={[3.0, 0.9, -3.72]} s={[0.7, 1.8, 0.3]} m={jeu.laque} />
      <B p={[4.47, 0.012, -3.3]} s={[1.1, 0.02, 0.7]} m={jeu.tissu2} ombre={false} />
    </>
  )
}

const MOBILIER: Record<ZoneId, (p: { jeu: Jeu; v: Variante }) => React.ReactNode> = {
  salon: Salon,
  cuisine: Cuisine,
  chambre: Chambre,
  bain: Bain,
  entree: Entree,
}

/** Sol et mobilier d'une zone. Un appui sur le sol sélectionne la pièce. */
function Zone({ id }: { id: ZoneId }) {
  const z = ZONES[id]
  const variantes = useVariantes(id)
  const setPiece = useShowcase((s) => s.setPiece)
  const l = z.x1 - z.x0
  const p = z.z1 - z.z0
  const geo = useMemo(() => planMetres(l, p, z.x0, z.z0), [l, p, z.x0, z.z0])
  const Mobilier = MOBILIER[id]
  const selectionnable = id !== 'entree'

  return (
    <group>
      {variantes.map(({ v, jeu }) => (
        <group key={v}>
          <mesh
            position={[(z.x0 + z.x1) / 2, 0.006, (z.z0 + z.z1) / 2]}
            rotation={[-Math.PI / 2, 0, 0]}
            geometry={geo}
            material={jeu.sol}
            receiveShadow
            onClick={
              selectionnable
                ? (e) => {
                    if (e.delta > 4) return
                    e.stopPropagation()
                    setPiece(id as PieceId)
                  }
                : undefined
            }
            onPointerOver={selectionnable ? () => (document.body.style.cursor = 'pointer') : undefined}
            onPointerOut={selectionnable ? () => (document.body.style.cursor = '') : undefined}
          />
          <Mobilier jeu={jeu} v={v} />
        </group>
      ))}
    </group>
  )
}

/** Les cinq espaces intérieurs de la maison. */
export function InteriorScene() {
  return (
    <group>
      {(Object.keys(ZONES) as ZoneId[]).map((id) => (
        <Zone key={id} id={id} />
      ))}
    </group>
  )
}
