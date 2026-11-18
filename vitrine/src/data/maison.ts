/**
 * Données de démonstration : la maison de la vitrine.
 * Tout est en mètres. Cette maison est un exemple dessiné pour la vitrine ;
 * elle ne sort pas d'un relevé fait par casô.
 */

export type PieceId = 'exterieur' | 'facade' | 'salon' | 'cuisine' | 'chambre' | 'bain'
export type ZoneId = 'salon' | 'cuisine' | 'chambre' | 'bain' | 'entree'

/** Hauteur des murs, hauteur de coupe (toit ouvert), épaisseurs. */
export const H = 2.6
export const COUPE = 1.1
export const EP_EXT = 0.25
export const EP_INT = 0.12
/** Emprise de la maison : 12 × 8 m, centrée. */
export const LX = 6
export const LZ = 4
export const DEBORD = 0.6

export interface Zone {
  x0: number
  x1: number
  z0: number
  z1: number
}

/** Surfaces au sol de chaque zone (axes des murs). */
export const ZONES: Record<ZoneId, Zone> = {
  salon: { x0: -6, x1: 0, z0: 0, z1: 4 },
  cuisine: { x0: 0, x1: 6, z0: 0, z1: 4 },
  chambre: { x0: -6, x1: -1, z0: -4, z1: 0 },
  bain: { x0: -1, x1: 2.5, z0: -4, z1: 0 },
  entree: { x0: 2.5, x1: 6, z0: -4, z1: 0 },
}

export type TypeOuverture = 'baie' | 'fenetre' | 'porte' | 'passage'

export interface Ouverture {
  /** Début et fin le long du mur, depuis le point a. */
  s: number
  e: number
  y0: number
  y1: number
  type: TypeOuverture
}

export interface Face {
  /** 'plus' = côté de la normale (à gauche du sens a → b, vu de dessus). */
  cote: 'plus' | 'moins'
  s0: number
  s1: number
  /** Zone peinte, ou 'bardage' pour le bois extérieur. */
  surface: ZoneId | 'bardage'
}

export interface Mur {
  a: [number, number]
  b: [number, number]
  ep: number
  ouvertures: Ouverture[]
  faces: Face[]
}

const HP = 2.15

export const MURS: Mur[] = [
  // Sud (terrasse)
  {
    a: [-LX, LZ],
    b: [LX, LZ],
    ep: EP_EXT,
    ouvertures: [
      { s: 1.1, e: 4.1, y0: 0, y1: HP, type: 'baie' },
      { s: 6.8, e: 9.2, y0: 0, y1: HP, type: 'baie' },
    ],
    faces: [
      { cote: 'moins', s0: 0, s1: 6, surface: 'salon' },
      { cote: 'moins', s0: 6, s1: 12, surface: 'cuisine' },
    ],
  },
  // Nord (entrée)
  {
    a: [-LX, -LZ],
    b: [LX, -LZ],
    ep: EP_EXT,
    ouvertures: [
      { s: 1.6, e: 3.0, y0: 0.9, y1: HP, type: 'fenetre' },
      { s: 7.7, e: 8.3, y0: 1.3, y1: 2.0, type: 'fenetre' },
      { s: 10.0, e: 10.95, y0: 0, y1: HP, type: 'porte' },
    ],
    faces: [
      { cote: 'plus', s0: 0, s1: 5, surface: 'chambre' },
      { cote: 'plus', s0: 5, s1: 8.5, surface: 'bain' },
      { cote: 'plus', s0: 8.5, s1: 12, surface: 'entree' },
      { cote: 'moins', s0: 7.5, s1: 12, surface: 'bardage' },
    ],
  },
  // Ouest
  {
    a: [-LX, -LZ],
    b: [-LX, LZ],
    ep: EP_EXT,
    ouvertures: [{ s: 5.2, e: 6.8, y0: 0.9, y1: HP, type: 'fenetre' }],
    faces: [
      { cote: 'moins', s0: 0, s1: 4, surface: 'chambre' },
      { cote: 'moins', s0: 4, s1: 8, surface: 'salon' },
    ],
  },
  // Est
  {
    a: [LX, -LZ],
    b: [LX, LZ],
    ep: EP_EXT,
    ouvertures: [{ s: 5.2, e: 6.8, y0: 1.05, y1: HP, type: 'fenetre' }],
    faces: [
      { cote: 'plus', s0: 0, s1: 4, surface: 'entree' },
      { cote: 'plus', s0: 4, s1: 8, surface: 'cuisine' },
      { cote: 'moins', s0: 0, s1: 4, surface: 'bardage' },
    ],
  },
  // Refend central
  {
    a: [-LX, 0],
    b: [LX, 0],
    ep: EP_INT,
    ouvertures: [
      { s: 4.0, e: 4.9, y0: 0, y1: 2.05, type: 'passage' },
      { s: 8.9, e: 9.8, y0: 0, y1: 2.05, type: 'passage' },
    ],
    faces: [
      { cote: 'plus', s0: 0, s1: 6, surface: 'salon' },
      { cote: 'plus', s0: 6, s1: 12, surface: 'cuisine' },
      { cote: 'moins', s0: 0, s1: 5, surface: 'chambre' },
      { cote: 'moins', s0: 5, s1: 8.5, surface: 'bain' },
      { cote: 'moins', s0: 8.5, s1: 12, surface: 'entree' },
    ],
  },
  // Salon / cuisine
  {
    a: [0, 0],
    b: [0, LZ],
    ep: EP_INT,
    ouvertures: [{ s: 1.2, e: 3.6, y0: 0, y1: 2.3, type: 'passage' }],
    faces: [
      { cote: 'plus', s0: 0, s1: 4, surface: 'salon' },
      { cote: 'moins', s0: 0, s1: 4, surface: 'cuisine' },
    ],
  },
  // Chambre / salle de bain
  {
    a: [-1, -LZ],
    b: [-1, 0],
    ep: EP_INT,
    ouvertures: [],
    faces: [
      { cote: 'plus', s0: 0, s1: 4, surface: 'chambre' },
      { cote: 'moins', s0: 0, s1: 4, surface: 'bain' },
    ],
  },
  // Salle de bain / entrée
  {
    a: [2.5, -LZ],
    b: [2.5, 0],
    ep: EP_INT,
    ouvertures: [{ s: 2.6, e: 3.45, y0: 0, y1: 2.05, type: 'passage' }],
    faces: [
      { cote: 'plus', s0: 0, s1: 4, surface: 'bain' },
      { cote: 'moins', s0: 0, s1: 4, surface: 'entree' },
    ],
  },
]

const m2 = (z: Zone) => Math.round((z.x1 - z.x0) * (z.z1 - z.z0))
const fr = (n: number) => n.toFixed(2).replace('.', ',')

export interface Repere {
  id: string
  pos: [number, number, number]
  nom: string
  valeur: string
}

export interface Vue {
  cible: [number, number, number]
  az: number
  pol: number
  dist: number
  distMin: number
  distMax: number
}

export interface Piece {
  id: PieceId
  nom: string
  /** Zone au sol, pour les pièces intérieures. */
  zone?: ZoneId
  /** Ce que casô fait dans cet espace : une phrase. */
  phrase: string
  mesure: string
  toitOuvert: boolean
  vue: Vue
  reperes: Repere[]
}

const TERRASSE = { x0: -6, x1: 3.5, z0: 4, z1: 7.2 }
const toit = Math.round((2 * LX + 2 * DEBORD) * (2 * LZ + 2 * DEBORD))
const bardage = Math.round((4.5 + 4) * H)

export const PIECES: Piece[] = [
  {
    id: 'exterieur',
    nom: 'Extérieur',
    phrase: 'Toiture, terrasse, jardin : chaque ouvrage a sa surface.',
    mesure: `${2 * LX} × ${2 * LZ} m`,
    toitOuvert: false,
    vue: { cible: [0, 1.0, 0.8], az: -0.72, pol: 1.1, dist: 33, distMin: 17, distMax: 44 },
    reperes: [
      { id: 'toit', pos: [1.5, H + 0.45, -1], nom: 'Toiture', valeur: `${toit} m²` },
      {
        id: 'terrasse',
        pos: [-1.5, 0.3, 5.8],
        nom: 'Terrasse',
        valeur: `${Math.round((TERRASSE.x1 - TERRASSE.x0) * (TERRASSE.z1 - TERRASSE.z0))} m²`,
      },
    ],
  },
  {
    id: 'facade',
    nom: 'Façade',
    phrase: 'Bardage, enduit, menuiseries : la façade se chiffre poste par poste.',
    mesure: `${2 * LX} m de long`,
    toitOuvert: false,
    vue: { cible: [0, 1.2, -3.2], az: Math.PI - 0.42, pol: 1.25, dist: 30, distMin: 14, distMax: 40 },
    reperes: [
      { id: 'bardage', pos: [2.6, 1.9, -4.2], nom: 'Bardage bois', valeur: `${bardage} m²` },
      { id: 'porte', pos: [4.5, 2.35, -4.2], nom: 'Porte d’entrée', valeur: `0,95 × ${fr(HP)} m` },
    ],
  },
  {
    id: 'salon',
    nom: 'Salon',
    zone: 'salon',
    phrase: 'Sol, murs, baie vitrée : casô les repère et les mesure.',
    mesure: `${m2(ZONES.salon)} m²`,
    toitOuvert: true,
    vue: { cible: [-3, 0.3, 2], az: -0.5, pol: 0.6, dist: 17, distMin: 8, distMax: 26 },
    reperes: [
      { id: 'sol', pos: [-1.5, 0.15, 1.0], nom: 'Sol', valeur: `${m2(ZONES.salon)} m²` },
      { id: 'baie', pos: [-3.4, 1.3, 4.0], nom: 'Baie vitrée', valeur: `3,00 × ${fr(HP)} m` },
    ],
  },
  {
    id: 'cuisine',
    nom: 'Cuisine',
    zone: 'cuisine',
    phrase: 'Plan de travail, façades, électroménager : un poste par élément.',
    mesure: `${m2(ZONES.cuisine)} m²`,
    toitOuvert: true,
    vue: { cible: [3, 0.3, 2], az: 0.5, pol: 0.6, dist: 17, distMin: 8, distMax: 26 },
    reperes: [
      { id: 'plan', pos: [5.6, 1.15, 2.3], nom: 'Plan de travail', valeur: '2,95 m' },
      { id: 'sol', pos: [1.6, 0.15, 3.0], nom: 'Sol', valeur: `${m2(ZONES.cuisine)} m²` },
    ],
  },
  {
    id: 'chambre',
    nom: 'Chambre',
    zone: 'chambre',
    phrase: 'Peinture, sol, fenêtre : les quantités sortent toutes seules.',
    mesure: `${m2(ZONES.chambre)} m²`,
    toitOuvert: true,
    vue: { cible: [-3.5, 0.3, -2], az: -2.55, pol: 0.6, dist: 16, distMin: 8, distMax: 26 },
    reperes: [
      { id: 'murs', pos: [-1.3, 1.25, -2.4], nom: 'Murs', valeur: `${Math.round(2 * (5 + 4) * H)} m²` },
      { id: 'fenetre', pos: [-3.7, 1.3, -4.0], nom: 'Fenêtre', valeur: '1,40 × 1,25 m' },
    ],
  },
  {
    id: 'bain',
    nom: 'Salle de bain',
    zone: 'bain',
    phrase: 'Baignoire remplacée par une douche : la rénovation se voit avant les travaux.',
    mesure: `${m2(ZONES.bain)} m²`,
    toitOuvert: true,
    vue: { cible: [0.75, 0.3, -1.8], az: 3.05, pol: 0.5, dist: 12.5, distMin: 7, distMax: 24 },
    reperes: [
      { id: 'sol', pos: [1.2, 0.15, -1.2], nom: 'Sol', valeur: `${m2(ZONES.bain)} m²` },
      { id: 'douche', pos: [-0.45, 1.25, -3.0], nom: 'Douche', valeur: '1,60 × 0,90 m' },
    ],
  },
]

export const piece = (id: PieceId): Piece => PIECES.find((p) => p.id === id) ?? PIECES[0]

export { TERRASSE }

/** Vue de la maison éclatée : toit et haut des murs soulevés. */
export const VUE_ECLATE: Vue = { cible: [-2.4, 2.0, 1.8], az: -0.5, pol: 0.98, dist: 27, distMin: 16, distMax: 44 }

export type OrigineCote = 'saisie' | 'mesuree' | 'estimee'

export interface Cote {
  id: string
  pos: [number, number, number]
  nom: string
  valeur: string
  origine: OrigineCote
  /** Avancement du moment à partir duquel la cote apparaît. */
  seuil: number
}

/** Cotes d'exemple du séjour, avec leur origine. */
export const COTES: Cote[] = [
  { id: 'long', pos: [-3, 1.3, 0.1], nom: 'Longueur', valeur: '6,00 m', origine: 'saisie', seuil: 0.3 },
  { id: 'larg', pos: [-5.85, 1.3, 3.3], nom: 'Largeur', valeur: '4,00 m', origine: 'saisie', seuil: 0.36 },
  { id: 'haut', pos: [-0.05, 2.0, 0.5], nom: 'Hauteur', valeur: fr(H) + ' m', origine: 'mesuree', seuil: 0.44 },
  { id: 'sol', pos: [-2.2, 0.2, 2.4], nom: 'Sol', valeur: `${m2(ZONES.salon)} m²`, origine: 'mesuree', seuil: 0.5 },
  { id: 'baie', pos: [-3.4, 1.35, 4.05], nom: 'Baie', valeur: `3,00 × ${fr(HP)} m`, origine: 'estimee', seuil: 0.58 },
  { id: 'fen', pos: [-6.05, 1.5, 1.8], nom: 'Fenêtre', valeur: '1,60 × 1,25 m', origine: 'estimee', seuil: 0.64 },
]
