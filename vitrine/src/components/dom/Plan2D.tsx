'use client'

import { PIECES, TERRASSE, ZONES, piece as pieceDe, type PieceId, type ZoneId } from '@/data/maison'
import { useShowcase } from '@/store/showcase'

/** Plan de la maison, affiché quand la 3D n'est pas disponible. Les pièces restent sélectionnables. */
export function Plan2D() {
  const piece = useShowcase((s) => s.piece)
  const setPiece = useShowcase((s) => s.setPiece)
  const active = pieceDe(piece).zone
  return (
    <div className="plan">
      <svg viewBox="-7 -5 14 13.2" role="img" aria-label="Plan de la maison">
        <rect
          x={TERRASSE.x0}
          y={TERRASSE.z0}
          width={TERRASSE.x1 - TERRASSE.x0}
          height={TERRASSE.z1 - TERRASSE.z0}
          fill="#e2d6c4"
          stroke="#18181a"
          strokeWidth={0.04}
        />
        <text x={(TERRASSE.x0 + TERRASSE.x1) / 2} y={(TERRASSE.z0 + TERRASSE.z1) / 2 + 0.15}>
          Terrasse
        </text>
        {(Object.keys(ZONES) as ZoneId[]).map((id) => {
          const z = ZONES[id]
          const p = PIECES.find((x) => x.zone === id)
          return (
            <g key={id}>
              <rect
                className={`zone${active === id ? ' actif' : ''}`}
                x={z.x0}
                y={z.z0}
                width={z.x1 - z.x0}
                height={z.z1 - z.z0}
                onClick={p ? () => setPiece(id as PieceId) : undefined}
              />
              <text x={(z.x0 + z.x1) / 2} y={(z.z0 + z.z1) / 2 + 0.15}>
                {p ? p.nom : 'Entrée'}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
