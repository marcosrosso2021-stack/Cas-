import type { Icone as Nom } from '@/data/contenu'

const TRACES: Record<Nom, string> = {
  devis: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  chat: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-5 4v-4a2 2 0 0 1-2-2z',
  cube: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9',
  gps: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  prix: 'M3 12l9-9h8v8l-9 9zM15.5 8.5h.01',
  veille: 'M5 4h14v16H5zM9 8h6M9 12h6M9 16h3',
  coffre: 'M6 11V8a6 6 0 0 1 12 0v3M5 11h14v9H5zM12 15v2',
  hors: 'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
}

/** Petite icône au trait, dessinée pour la vitrine. */
export function Icone({ nom }: { nom: Nom }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={TRACES[nom]} />
    </svg>
  )
}

export function Fleche({ sens = 'droite' }: { sens?: 'droite' | 'gauche' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={sens === 'droite' ? 'M2 8h11M9 4l4 4-4 4' : 'M14 8H3M7 4L3 8l4 4'} />
    </svg>
  )
}
