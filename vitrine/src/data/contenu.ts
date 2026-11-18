/** Textes de la visite. Une information n'apparaît qu'à un seul endroit du site. */

export interface Moment {
  /** Nom court, pour le rail de navigation. */
  rail: string
  /** Repère dans la journée. */
  heure: string
  titre: string
  texte: string
}

export const MOMENTS: Moment[] = [
  {
    rail: 'Ouverture',
    heure: 'Pour les artisans du bâtiment',
    titre: 'Du crayon au devis.',
    texte: 'Ce que vous griffonniez sur un carnet, dites-le à casô. Il range, chiffre et dessine le chantier.',
  },
  {
    rail: 'L’appel',
    heure: '8 h 10',
    titre: 'Un client vous appelle.',
    texte: 'Dites-le à casô comme à un collègue. La fiche client et le chantier se créent pendant que vous parlez.',
  },
  {
    rail: 'Sur place',
    heure: '9 h 30',
    titre: 'Vous êtes sur place.',
    texte: 'Une photo, une note, la pièce filmée. Tout se range dans le chantier, depuis votre téléphone.',
  },
  {
    rail: 'La pièce',
    heure: '9 h 45',
    titre: 'casô lit la pièce.',
    texte: 'La pièce filmée devient un volume. Chaque cote vous dit d’où elle vient.',
  },
  {
    rail: 'Avant / après',
    heure: '10 h 15',
    titre: 'Votre client veut voir.',
    texte: 'Montrez-lui la salle de bain avant et après. Changez le sol ou les murs devant lui.',
  },
  {
    rail: 'Les prix',
    heure: '11 h',
    titre: 'Il vous faut le bon prix.',
    texte: 'Un outil, un matériau : casô cherche dans les magasins et classe par prix. Gardez vos favoris.',
  },
  {
    rail: 'Le devis',
    heure: '14 h',
    titre: 'Le devis se prépare.',
    texte: 'Les surfaces du chantier deviennent des lignes. Vous ajustez une quantité, le total suit.',
  },
  {
    rail: 'La semaine',
    heure: 'Lundi',
    titre: 'Votre semaine tient sur un écran.',
    texte: 'Vos chantiers et vos créneaux. Un client décale ? Vous déplacez l’intervention.',
  },
  {
    rail: 'La veille',
    heure: 'Mardi, au café',
    titre: 'Votre métier bouge. Vous suivez.',
    texte: 'Les règles qui changent et les nouveautés de votre métier arrivent déjà triées, dans la newsletter.',
  },
  {
    rail: 'Le point',
    heure: 'Vendredi',
    titre: 'Tout est au même endroit.',
    texte: 'Posez la question, casô répond avec vos chiffres.',
  },
]

/** Explication de chaque origine de cote. */
export const ORIGINES = {
  saisie: { nom: 'Saisie', phrase: 'Vous l’avez entrée vous-même.' },
  mesuree: { nom: 'Mesurée', phrase: 'Calculée à partir d’un repère connu dans la pièce.' },
  estimee: { nom: 'Estimée', phrase: 'Proposée par casô. À vérifier sur place.' },
} as const

/** Le reste de l'appli, en une ligne. */
export const AUSSI = ['Données chiffrées', 'Fonctionne sans réseau', '10 langues', 'Votre équipe']

export const SIGNATURE = 'Moins de complexité dans vos journées. Plus de maîtrise sur vos projets.'
