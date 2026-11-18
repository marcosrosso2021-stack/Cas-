import * as THREE from 'three'
import type { MursId, SolId } from '@/data/materiaux'
import { bois, carrelage, grain } from './textures'

export type Variante = 'avant' | 'apres'

/** Matières qui changent entre « Avant » et « Après ». */
export interface Jeu {
  sol: THREE.MeshStandardMaterial
  murs: THREE.MeshStandardMaterial
  tissu: THREE.MeshStandardMaterial
  tissu2: THREE.MeshStandardMaterial
  bois: THREE.MeshStandardMaterial
  laque: THREE.MeshStandardMaterial
  facade: THREE.MeshStandardMaterial
  plan: THREE.MeshStandardMaterial
  tapis: THREE.MeshStandardMaterial
  ceramique: THREE.MeshStandardMaterial
  metal: THREE.MeshStandardMaterial
  verre: THREE.MeshStandardMaterial
  plante: THREE.MeshStandardMaterial
  ecran: THREE.MeshStandardMaterial
}

/** Matières fixes de la maison et du jardin. */
export interface Communs {
  murExt: THREE.MeshStandardMaterial
  bardage: THREE.MeshStandardMaterial
  graphite: THREE.MeshStandardMaterial
  verre: THREE.MeshStandardMaterial
  toit: THREE.MeshStandardMaterial
  toitBord: THREE.MeshStandardMaterial
  terrasse: THREE.MeshStandardMaterial
  gazon: THREE.MeshStandardMaterial
  socle: THREE.MeshStandardMaterial
  dalle: THREE.MeshStandardMaterial
  jaune: THREE.MeshStandardMaterial
  tronc: THREE.MeshStandardMaterial
  feuillage: THREE.MeshStandardMaterial
}

const TEINTE_MURS: Record<MursId, string> = { blanc: '#f3f1ec', sable: '#e3d7c3', sauge: '#b9c4ad' }

function std(p: THREE.MeshStandardMaterialParameters, plan?: THREE.Plane): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...p })
  if (plan) m.clippingPlanes = [plan]
  return m
}

function solApres(id: SolId): THREE.MeshStandardMaterialParameters {
  if (id === 'chene') return { map: bois('#c9a77c', 6, 7), roughness: 0.62 }
  if (id === 'beton') return { map: grain('#b9b8b3', 0.035, 21), roughness: 0.45 }
  return { map: carrelage('#dcdbd6', '#b4b3ae', 1.6667, 5), roughness: 0.35 }
}

export function creerJeu(v: Variante, sol: SolId, murs: MursId, plan?: THREE.Plane): Jeu {
  const a = v === 'avant'
  const verre = std({ color: '#dfe8ea', transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0.1 }, plan)
  verre.depthWrite = false
  return {
    sol: std(a ? { map: carrelage('#cdb894', '#8f7d60', 3, 9, '#b08f66'), roughness: 0.7 } : solApres(sol), plan),
    murs: std({ color: a ? '#d9cea8' : TEINTE_MURS[murs], roughness: 0.95, side: THREE.DoubleSide }, plan),
    tissu: std({ color: a ? '#7d5c46' : '#cfccc5', roughness: 1 }, plan),
    tissu2: std({ color: a ? '#5f6c50' : '#5b5c60', roughness: 1 }, plan),
    bois: std(a ? { color: '#8f5730', roughness: 0.6 } : { map: bois('#c9a77c', 5, 31), roughness: 0.6 }, plan),
    laque: std({ color: a ? '#e3d9be' : '#f5f4f0', roughness: 0.4 }, plan),
    facade: std({ color: a ? '#a8693a' : '#8d8d88', roughness: 0.55 }, plan),
    plan: std({ color: a ? '#c8b89a' : '#ecebe6', roughness: 0.3 }, plan),
    tapis: std({ color: a ? '#8a3f36' : '#e6e3db', roughness: 1 }, plan),
    ceramique: std({ color: a ? '#e6dcc4' : '#fafaf8', roughness: 0.18 }, plan),
    metal: std({ color: a ? '#b9b3a4' : '#3c3c40', roughness: 0.4, metalness: 0.5 }, plan),
    verre,
    plante: std({ color: a ? '#6f7d58' : '#5f7a5a', roughness: 0.9 }, plan),
    ecran: std({ color: '#141416', roughness: 0.25 }, plan),
  }
}

export function creerCommuns(): Communs {
  const verre = std({ color: '#cfdde0', transparent: true, opacity: 0.3, roughness: 0.04, metalness: 0.2 })
  verre.depthWrite = false
  return {
    murExt: std({ color: '#f4f3ef', roughness: 0.92 }),
    bardage: std({ map: bois('#b98a5a', 9, 13), roughness: 0.7, side: THREE.DoubleSide }),
    graphite: std({ color: '#2a2a2d', roughness: 0.5, metalness: 0.3 }),
    verre,
    toit: std({ color: '#ecebe6', roughness: 0.9, transparent: true }),
    toitBord: std({ color: '#2a2a2d', roughness: 0.6, transparent: true }),
    terrasse: std({ map: bois('#a9865f', 8, 17), roughness: 0.75 }),
    gazon: std({ map: grain('#bcc2ab', 0.04, 2), roughness: 1 }),
    socle: std({ color: '#e7e6e1', roughness: 0.95 }),
    dalle: std({ map: grain('#cfcec9', 0.03, 5), roughness: 0.9 }),
    jaune: std({ color: '#ffc21a', roughness: 0.45 }),
    tronc: std({ color: '#8a7460', roughness: 1 }),
    feuillage: std({ color: '#8d9c7c', roughness: 1, flatShading: true }),
  }
}

/** Libère les textures et les matières d'un jeu. */
export function liberer(jeu: object) {
  for (const m of Object.values(jeu) as THREE.MeshStandardMaterial[]) {
    m.map?.dispose()
    m.dispose()
  }
}
