'use client'

import { Component, Suspense, useEffect, type ReactNode } from 'react'
import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import { MODELES } from '@/config/modeles'
import { HouseScene } from './HouseScene'

/** Si le modèle externe échoue, on revient à la maison du code. */
class Repli extends Component<{ repli: ReactNode; children: ReactNode }, { erreur: boolean }> {
  state = { erreur: false }
  static getDerivedStateFromError() {
    return { erreur: true }
  }
  render() {
    return this.state.erreur ? this.props.repli : this.props.children
  }
}

function ModeleExterne({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
      }
    })
    // Mémoire GPU rendue quand la scène est démontée.
    return () => useGLTF.clear(url)
  }, [scene, url])
  return <primitive object={scene} />
}

/**
 * Affiche la maison : un modèle .glb s'il est déclaré dans config/modeles.ts,
 * sinon la maison construite dans le code.
 */
export function ArchitectureViewer() {
  const url = MODELES.maison
  if (!url) return <HouseScene />
  return (
    <Repli repli={<HouseScene />}>
      <Suspense fallback={null}>
        <ModeleExterne url={url} />
      </Suspense>
    </Repli>
  )
}
