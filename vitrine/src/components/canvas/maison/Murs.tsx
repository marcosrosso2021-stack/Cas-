'use client'

import { useMemo } from 'react'
import { COUPE, H, MURS, type Face, type Mur, type ZoneId } from '@/data/maison'
import { useMatieres, useVariantes } from '../matieres/MatieresContext'
import { couper, longueurMur, planMetres, pleins, type Rect } from './geometrie'

type Couche = 'bas' | 'haut'

/** Peinture d'une zone sur une face de mur. Deux passes pendant l'avant / après. */
function Peinture({ zone, rect, z, retourne }: { zone: ZoneId; rect: Rect; z: number; retourne: boolean }) {
  const variantes = useVariantes(zone)
  const l = rect.s1 - rect.s0
  const h = rect.y1 - rect.y0
  return (
    <>
      {variantes.map(({ v, jeu }) => (
        <mesh
          key={v}
          position={[(rect.s0 + rect.s1) / 2, (rect.y0 + rect.y1) / 2, z]}
          rotation={[0, retourne ? Math.PI : 0, 0]}
          material={jeu.murs}
          receiveShadow
        >
          <planeGeometry args={[l, h]} />
        </mesh>
      ))}
    </>
  )
}

function Bardage({ rect, z, retourne }: { rect: Rect; z: number; retourne: boolean }) {
  const { communs } = useMatieres()
  const geo = useMemo(() => planMetres(rect.s1 - rect.s0, rect.y1 - rect.y0, rect.s0, rect.y0), [rect])
  return (
    <mesh
      position={[(rect.s0 + rect.s1) / 2, (rect.y0 + rect.y1) / 2, z]}
      rotation={[0, retourne ? Math.PI : 0, 0]}
      geometry={geo}
      material={communs.bardage}
      receiveShadow
    />
  )
}

/** Vitrage, cadre et porte d'entrée : dessinés dans la couche haute, qui se replie quand le toit s'ouvre. */
function Menuiseries({ mur, base }: { mur: Mur; base: number }) {
  const { communs } = useMatieres()
  const c = 0.05
  return (
    <>
      {mur.ouvertures.map((o, i) => {
        if (o.type === 'passage') return null
        const l = o.e - o.s
        const h = o.y1 - o.y0
        const x = (o.s + o.e) / 2
        const y = (o.y0 + o.y1) / 2 - base
        if (o.type === 'porte')
          return (
            <group key={i} position={[x, y, 0]}>
              <mesh material={communs.jaune} castShadow>
                <boxGeometry args={[l - 0.04, h - 0.03, 0.06]} />
              </mesh>
              <mesh position={[l / 2 - 0.14, -0.05, -0.06]} material={communs.graphite}>
                <boxGeometry args={[0.03, 0.34, 0.04]} />
              </mesh>
            </group>
          )
        return (
          <group key={i} position={[x, y, 0]}>
            <mesh material={communs.verre}>
              <boxGeometry args={[l - c, h - c, 0.02]} />
            </mesh>
            <mesh position={[0, h / 2 - c / 2, 0]} material={communs.graphite}>
              <boxGeometry args={[l, c, 0.08]} />
            </mesh>
            <mesh position={[0, -h / 2 + c / 2, 0]} material={communs.graphite}>
              <boxGeometry args={[l, c, 0.08]} />
            </mesh>
            <mesh position={[-l / 2 + c / 2, 0, 0]} material={communs.graphite}>
              <boxGeometry args={[c, h, 0.08]} />
            </mesh>
            <mesh position={[l / 2 - c / 2, 0, 0]} material={communs.graphite}>
              <boxGeometry args={[c, h, 0.08]} />
            </mesh>
            {l > 1.2 && (
              <mesh material={communs.graphite}>
                <boxGeometry args={[c, h, 0.08]} />
              </mesh>
            )}
          </group>
        )
      })}
    </>
  )
}

function MurCouche({ mur, couche }: { mur: Mur; couche: Couche }) {
  const { communs } = useMatieres()
  const longueur = longueurMur(mur)
  const [ya, yb, base] = couche === 'bas' ? [0, COUPE, 0] : [COUPE, H, COUPE]

  const blocs = useMemo(
    () =>
      pleins(mur, longueur)
        .map((r) => couper(r, 0, longueur, ya, yb))
        .filter((r): r is Rect => r !== null),
    [mur, longueur, ya, yb],
  )

  const faces = useMemo(() => {
    const out: { face: Face; rect: Rect }[] = []
    for (const face of mur.faces)
      for (const b of blocs) {
        const r = couper(b, face.s0, face.s1, ya, yb)
        if (r) out.push({ face, rect: r })
      }
    return out
  }, [mur, blocs, ya, yb])

  const dx = mur.b[0] - mur.a[0]
  const dz = mur.b[1] - mur.a[1]
  const z = mur.ep / 2 + 0.004

  return (
    <group position={[mur.a[0], 0, mur.a[1]]} rotation={[0, Math.atan2(-dz, dx), 0]}>
      {blocs.map((r, i) => (
        <mesh
          key={i}
          position={[(r.s0 + r.s1) / 2, (r.y0 + r.y1) / 2 - base, 0]}
          material={communs.murExt}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[r.s1 - r.s0, r.y1 - r.y0, mur.ep]} />
        </mesh>
      ))}
      {faces.map(({ face, rect }, i) => {
        const plus = face.cote === 'plus'
        const local: Rect = { ...rect, y0: rect.y0 - base, y1: rect.y1 - base }
        return face.surface === 'bardage' ? (
          <Bardage key={i} rect={local} z={plus ? z : -z} retourne={!plus} />
        ) : (
          <Peinture key={i} zone={face.surface} rect={local} z={plus ? z : -z} retourne={!plus} />
        )
      })}
      {couche === 'haut' && <Menuiseries mur={mur} base={base} />}
    </group>
  )
}

/** Tous les murs d'une couche : « bas » jusqu'à la coupe, « haut » au-dessus. */
export function Murs({ couche }: { couche: Couche }) {
  return (
    <>
      {MURS.map((m, i) => (
        <MurCouche key={i} mur={m} couche={couche} />
      ))}
    </>
  )
}
