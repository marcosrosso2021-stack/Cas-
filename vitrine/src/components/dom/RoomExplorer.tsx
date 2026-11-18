'use client'

import { PIECES } from '@/data/maison'
import { useShowcase } from '@/store/showcase'

/** Barre des espaces : choisir un espace déplace la caméra vers lui. */
export function RoomExplorer() {
  const piece = useShowcase((s) => s.piece)
  const setPiece = useShowcase((s) => s.setPiece)
  return (
    <nav className="pieces carte" aria-label="Explorer la maison">
      {PIECES.map((p) => (
        <button key={p.id} type="button" aria-pressed={piece === p.id} onClick={() => setPiece(p.id)}>
          {p.nom}
        </button>
      ))}
    </nav>
  )
}
