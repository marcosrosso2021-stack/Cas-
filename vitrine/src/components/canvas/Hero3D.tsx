'use client'

import { Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { useShowcase, type Qualite } from '@/store/showcase'
import { ShowcaseController } from './ShowcaseController'

const DPR: Record<Qualite, [number, number]> = { high: [1, 2], medium: [1, 1.5], low: [1, 1] }

/** Une erreur WebGL bascule la vitrine sur le plan 2D. */
class Garde extends Component<{ children: ReactNode }, { erreur: boolean }> {
  state = { erreur: false }
  static getDerivedStateFromError() {
    return { erreur: true }
  }
  componentDidCatch() {
    useShowcase.getState().setWebgl(false)
  }
  render() {
    return this.state.erreur ? null : this.props.children
  }
}

/** Le canevas 3D de la vitrine. Chargé après le texte, arrêté quand il sort de l'écran. */
export default function Hero3D() {
  const qualite = useShowcase((s) => s.qualite)
  const visible = useShowcase((s) => s.visible)
  return (
    <Garde>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={DPR[qualite]}
        shadows={qualite !== 'low'}
        gl={{ antialias: qualite !== 'low', alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 32, near: 0.5, far: 260, position: [-20, 14, 26] }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true
          gl.toneMappingExposure = 0.96
        }}
      >
        <ShowcaseController />
      </Canvas>
    </Garde>
  )
}
