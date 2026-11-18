'use client'

import { Environment, Lightformer } from '@react-three/drei'
import { useShowcase } from '@/store/showcase'
import { MatieresProvider } from './matieres/MatieresContext'
import { ArchitectureViewer } from './ArchitectureViewer'
import { CameraController } from './CameraController'
import { RenovationScene } from './RenovationScene'
import { RoomHotspots } from './RoomHotspots'

/** Assemble la scène : lumière, maison, caméra, avant / après, repères. */
export function ShowcaseController() {
  const qualite = useShowcase((s) => s.qualite)
  const ombres = qualite !== 'low'
  const carte = qualite === 'high' ? 2048 : 1024

  return (
    <MatieresProvider>
      <hemisphereLight args={['#ffffff', '#cfcbc0', qualite === 'low' ? 1.1 : 0.62]} />
      <directionalLight
        position={[-11, 17, 12]}
        intensity={2.0}
        castShadow={ombres}
        shadow-mapSize={[carte, carte]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      >
        <orthographicCamera attach="shadow-camera" args={[-19, 19, 17, -17, 1, 60]} />
      </directionalLight>

      {qualite !== 'low' && (
        <Environment resolution={64} frames={1} environmentIntensity={0.32}>
          <color attach="background" args={['#e9e8e4']} />
          <Lightformer form="rect" intensity={2.2} position={[0, 12, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[30, 30, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[-14, 5, 8]} rotation={[0, Math.PI / 2, 0]} scale={[20, 8, 1]} />
          <Lightformer form="rect" intensity={0.6} position={[14, 4, -6]} rotation={[0, -Math.PI / 2, 0]} scale={[20, 8, 1]} />
        </Environment>
      )}

      {/* ombre du socle sur le fond de la page */}
      {ombres && (
        <mesh position={[0, -0.72, 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[90, 90]} />
          <shadowMaterial transparent opacity={0.14} />
        </mesh>
      )}

      <ArchitectureViewer />
      <RenovationScene />
      <RoomHotspots />
      <CameraController />
    </MatieresProvider>
  )
}
