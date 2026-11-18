/** Données de démonstration : finitions proposées dans la vue « Après ». */

export type SolId = 'chene' | 'beton' | 'carrelage'
export type MursId = 'blanc' | 'sable' | 'sauge'

export interface Choix<T extends string> {
  id: T
  nom: string
  /** Couleur de la pastille. */
  teinte: string
}

export const SOLS: Choix<SolId>[] = [
  { id: 'chene', nom: 'Chêne clair', teinte: '#c9a77c' },
  { id: 'beton', nom: 'Béton ciré', teinte: '#b9b8b3' },
  { id: 'carrelage', nom: 'Carrelage gris', teinte: '#d9d8d3' },
]

export const MURS_TEINTES: Choix<MursId>[] = [
  { id: 'blanc', nom: 'Blanc', teinte: '#f3f1ec' },
  { id: 'sable', nom: 'Sable', teinte: '#e3d7c3' },
  { id: 'sauge', nom: 'Vert sauge', teinte: '#b9c4ad' },
]
