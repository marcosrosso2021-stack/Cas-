export function Fleche({ sens = 'droite' }: { sens?: 'droite' | 'gauche' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={sens === 'droite' ? 'M2 8h11M9 4l4 4-4 4' : 'M14 8H3M7 4L3 8l4 4'} />
    </svg>
  )
}
