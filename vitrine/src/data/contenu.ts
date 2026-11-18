/** Textes de la vitrine. Une information n'apparaît qu'à un seul endroit du site. */

export const SIGNATURE = 'Construire. Visualiser. Transformer.'
export const TITRE = 'L’intelligence au service de vos projets.'
export const SOUS_TITRE =
  'Visualisez, transformez et chiffrez vos projets de construction et de rénovation dans un environnement intelligent.'

export interface Etape {
  nom: string
  phrase: string
}

/** Le parcours dans l'appli, de la pièce filmée au devis. */
export const ETAPES: Etape[] = [
  { nom: 'Filmez', phrase: 'La pièce, avec votre téléphone.' },
  { nom: 'Analyse', phrase: 'Murs, sols et ouvertures sont repérés.' },
  { nom: '3D', phrase: 'La pièce est remontée en relief.' },
  { nom: 'Travaux', phrase: 'Vous choisissez quoi refaire.' },
  { nom: 'Devis', phrase: 'Il se prépare avec vos prix.' },
]

export type Icone = 'devis' | 'chat' | 'cube' | 'gps' | 'prix' | 'veille' | 'coffre' | 'hors'

export interface Fonction {
  icone: Icone
  nom: string
  phrase: string
}

export const FONCTIONS: Fonction[] = [
  { icone: 'devis', nom: 'Devis et factures', phrase: 'Vos prix, vos modèles. Signature électronique vérifiable par QR.' },
  { icone: 'chat', nom: 'Chat', phrase: 'Écrivez ou dictez. Il agit dans l’appli et répond métier : TVA, DTU, quantités.' },
  { icone: 'cube', nom: '3D', phrase: 'Construction ou rénovation, à montrer au client.' },
  { icone: 'gps', nom: 'Pointage', phrase: 'Les heures se notent par GPS, à l’arrivée sur le chantier.' },
  { icone: 'prix', nom: 'Fournisseurs', phrase: 'Le prix des matériaux, magasin par magasin. Vos factures importées.' },
  { icone: 'veille', nom: 'Veille', phrase: 'Les règles et les nouveautés de votre métier, déjà triées.' },
  { icone: 'coffre', nom: 'Coffre', phrase: 'Vos données sont chiffrées. Face ID pour ouvrir.' },
  { icone: 'hors', nom: 'Partout', phrase: 'Sans réseau, sur téléphone et ordinateur, en 10 langues.' },
]
