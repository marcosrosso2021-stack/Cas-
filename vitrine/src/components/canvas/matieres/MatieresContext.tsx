'use client'

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { useShowcase } from '@/store/showcase'
import type { ZoneId } from '@/data/maison'
import { piece as pieceDe } from '@/data/maison'
import { creerCommuns, creerJeu, liberer, type Communs, type Jeu, type Variante } from './materiaux'

/** Plans de coupe du curseur avant / après, déplacés par ShowcaseController. */
export const PLAN_AVANT = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0)
export const PLAN_APRES = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)

interface Matieres {
  communs: Communs
  apres: Jeu
  avantCoupe: Jeu
  apresCoupe: Jeu
}

const Ctx = createContext<Matieres | null>(null)

export function MatieresProvider({ children }: { children: ReactNode }) {
  const sol = useShowcase((s) => s.sol)
  const murs = useShowcase((s) => s.murs)

  const communs = useMemo(() => creerCommuns(), [])
  const avantCoupe = useMemo(() => creerJeu('avant', 'chene', 'blanc', PLAN_AVANT), [])
  const apres = useMemo(() => creerJeu('apres', sol, murs), [sol, murs])
  const apresCoupe = useMemo(() => creerJeu('apres', sol, murs, PLAN_APRES), [sol, murs])

  useEffect(() => () => liberer(apres), [apres])
  useEffect(() => () => liberer(apresCoupe), [apresCoupe])
  useEffect(
    () => () => {
      liberer(communs)
      liberer(avantCoupe)
    },
    [communs, avantCoupe],
  )

  const valeur = useMemo(() => ({ communs, apres, avantCoupe, apresCoupe }), [communs, apres, avantCoupe, apresCoupe])
  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>
}

export function useMatieres(): Matieres {
  const m = useContext(Ctx)
  if (!m) throw new Error('MatieresProvider manquant')
  return m
}

/**
 * Jeux de matières à dessiner pour une zone.
 * Dans la pièce en cours de rénovation : « avant » et « après », coupés par le curseur.
 * Partout ailleurs : « après » seulement.
 */
export function useVariantes(zone: ZoneId): { v: Variante; jeu: Jeu }[] {
  const m = useMatieres()
  const actif = useShowcase((s) => s.renov && pieceDe(s.piece).zone === zone)
  return useMemo(
    () =>
      actif
        ? [
            { v: 'avant' as const, jeu: m.avantCoupe },
            { v: 'apres' as const, jeu: m.apresCoupe },
          ]
        : [{ v: 'apres' as const, jeu: m.apres }],
    [actif, m],
  )
}
