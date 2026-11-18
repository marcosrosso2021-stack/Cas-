'use client'

import { useMemo } from 'react'
import { LX, LZ, TERRASSE } from '@/data/maison'
import { useMatieres } from './matieres/MatieresContext'
import { planMetres } from './maison/geometrie'

/** Terrain de la maquette : 21 × 17,5 m. */
const TX = 10.5
const TZ0 = -8
const TZ1 = 9.5

function Arbre({ x, z, h = 3.4, r = 1.25 }: { x: number; z: number; h?: number; r?: number }) {
  const { communs } = useMatieres()
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h * 0.3, 0]} material={communs.tronc} castShadow>
        <cylinderGeometry args={[0.09, 0.13, h * 0.6, 8]} />
      </mesh>
      <mesh position={[0, h * 0.72, 0]} material={communs.feuillage} castShadow>
        <icosahedronGeometry args={[r, 1]} />
      </mesh>
      <mesh position={[r * 0.55, h * 0.6, r * 0.2]} material={communs.feuillage} castShadow>
        <icosahedronGeometry args={[r * 0.6, 1]} />
      </mesh>
    </group>
  )
}

/** Socle, jardin, terrasse et allée. */
export function ExteriorScene() {
  const { communs } = useMatieres()
  const lt = TERRASSE.x1 - TERRASSE.x0
  const pt = TERRASSE.z1 - TERRASSE.z0
  const geoTerrasse = useMemo(() => planMetres(lt, pt), [lt, pt])
  const geoGazon = useMemo(() => planMetres(2 * TX, TZ1 - TZ0), [])
  const cz = (TZ0 + TZ1) / 2

  return (
    <group>
      {/* socle de la maquette */}
      <mesh position={[0, -0.36, cz]} material={communs.socle} castShadow receiveShadow>
        <boxGeometry args={[2 * TX, 0.7, TZ1 - TZ0]} />
      </mesh>
      <mesh position={[0, -0.005, cz]} rotation={[-Math.PI / 2, 0, 0]} geometry={geoGazon} material={communs.gazon} receiveShadow />

      {/* dalle sous la maison */}
      <mesh position={[0, 0, 0]} material={communs.dalle} receiveShadow>
        <boxGeometry args={[2 * LX + 0.3, 0.01, 2 * LZ + 0.3]} />
      </mesh>

      {/* terrasse en bois */}
      <mesh position={[(TERRASSE.x0 + TERRASSE.x1) / 2, 0.04, (TERRASSE.z0 + TERRASSE.z1) / 2]} material={communs.tronc} receiveShadow>
        <boxGeometry args={[lt, 0.08, pt]} />
      </mesh>
      <mesh
        position={[(TERRASSE.x0 + TERRASSE.x1) / 2, 0.085, (TERRASSE.z0 + TERRASSE.z1) / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={geoTerrasse}
        material={communs.terrasse}
        receiveShadow
      />

      {/* salon de jardin */}
      <mesh position={[-3.4, 0.5, 5.7]} material={communs.graphite} castShadow>
        <boxGeometry args={[1.6, 0.05, 0.9]} />
      </mesh>
      <mesh position={[-3.4, 0.27, 5.7]} material={communs.graphite}>
        <boxGeometry args={[1.2, 0.42, 0.06]} />
      </mesh>
      {[-4.0, -2.8].map((x) =>
        [5.0, 6.4].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.3, z]} material={communs.murExt} castShadow>
            <boxGeometry args={[0.45, 0.44, 0.45]} />
          </mesh>
        )),
      )}

      {/* allée vers l'entrée */}
      <mesh position={[4.47, 0.012, -6.0]} material={communs.dalle} receiveShadow>
        <boxGeometry args={[1.5, 0.02, 3.9]} />
      </mesh>

      {/* haie et arbres */}
      <mesh position={[-9.5, 0.5, 0.8]} material={communs.feuillage} castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.0, 13]} />
      </mesh>
      <Arbre x={8.2} z={6.4} h={4.2} r={1.45} />
      <Arbre x={8.6} z={-5.4} h={3.3} r={1.15} />
      <Arbre x={-7.4} z={-5.8} h={3.8} r={1.3} />
      <Arbre x={5.4} z={8.2} h={2.6} r={0.85} />
    </group>
  )
}
