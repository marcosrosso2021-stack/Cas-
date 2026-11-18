'use client'

import { MURS_TEINTES, SOLS, type Choix } from '@/data/materiaux'
import { useShowcase } from '@/store/showcase'

function Groupe<T extends string>({
  titre,
  choix,
  valeur,
  choisir,
}: {
  titre: string
  choix: Choix<T>[]
  valeur: T
  choisir: (id: T) => void
}) {
  return (
    <div className="choix">
      <span className="mono">{titre}</span>
      <div>
        {choix.map((c) => (
          <button key={c.id} type="button" aria-pressed={valeur === c.id} onClick={() => choisir(c.id)}>
            <i style={{ background: c.teinte }} />
            {c.nom}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Finitions de la vue « Après » : le sol et les murs changent dans la scène. */
export function MaterialSelector() {
  const sol = useShowcase((s) => s.sol)
  const murs = useShowcase((s) => s.murs)
  const setSol = useShowcase((s) => s.setSol)
  const setMurs = useShowcase((s) => s.setMurs)
  return (
    <>
      <Groupe titre="Sol" choix={SOLS} valeur={sol} choisir={setSol} />
      <Groupe titre="Murs" choix={MURS_TEINTES} valeur={murs} choisir={setMurs} />
    </>
  )
}
