'use client'

import { useState, type CSSProperties } from 'react'
import { EcranCaso } from '../EcranCaso'

const euro = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

interface Offre {
  produit: string
  magasin: string
  prix: number
}

/** Magasins et prix fictifs : l'écran montre la forme de la réponse, pas des tarifs réels. */
const RECHERCHES: { mot: string; unite: string; teinte: string; offres: Offre[] }[] = [
  {
    mot: 'Perforateur SDS',
    unite: 'pièce',
    teinte: '#3c3c40',
    offres: [
      { produit: 'Perforateur SDS-Plus 800 W', magasin: 'Comptoir du Bâtiment', prix: 129 },
      { produit: 'Perforateur SDS-Plus 850 W', magasin: 'Outillage Pro Ouest', prix: 139.9 },
      { produit: 'Perforateur SDS-Plus 900 W', magasin: 'Négoce Loire Matériaux', prix: 154 },
    ],
  },
  {
    mot: 'Placo BA13',
    unite: 'plaque',
    teinte: '#d9d8d3',
    offres: [
      { produit: 'Plaque BA13 2,50 × 1,20 m', magasin: 'Négoce Loire Matériaux', prix: 8.45 },
      { produit: 'Plaque BA13 2,50 × 1,20 m', magasin: 'Comptoir du Bâtiment', prix: 8.9 },
      { produit: 'Plaque BA13 hydro 2,50 × 1,20 m', magasin: 'Matériaux du Centre', prix: 12.6 },
    ],
  },
  {
    mot: 'Colle carrelage',
    unite: 'sac 25 kg',
    teinte: '#c9a77c',
    offres: [
      { produit: 'Colle carrelage C2, 25 kg', magasin: 'Matériaux du Centre', prix: 14.9 },
      { produit: 'Colle carrelage C2 souple, 25 kg', magasin: 'Comptoir du Bâtiment', prix: 16.5 },
      { produit: 'Colle carrelage C2S1, 25 kg', magasin: 'Outillage Pro Ouest', prix: 21.3 },
    ],
  },
]

/** L'écran Fournisseurs, onglet « Prix en ligne » : la recherche classe les offres par prix. */
export function DemoPrix() {
  const [choix, setChoix] = useState(0)
  const [favoris, setFavoris] = useState<string[]>([])
  const r = RECHERCHES[choix]
  const basculer = (cle: string) => setFavoris((f) => (f.includes(cle) ? f.filter((x) => x !== cle) : [...f, cle]))

  return (
    <div>
      <EcranCaso titre="Fournisseurs" retour onglet="services">
        <div className="segments fixe" aria-hidden="true">
          <span>Mes fournisseurs</span>
          <span className="actif">Prix en ligne</span>
        </div>
        <div className="chercher" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.4" />
            <path d="M10.4 10.4L14 14" />
          </svg>
          {r.mot}
        </div>
        <ul className="offres">
          {r.offres.map((o, i) => {
            const cle = `${r.mot}-${i}`
            const favori = favoris.includes(cle)
            return (
              <li key={cle} className="ap" style={{ '--a': 0.06 + i * 0.09 } as CSSProperties}>
                <i style={{ background: r.teinte }} />
                <div>
                  <b>{o.produit}</b>
                  <span>{o.magasin}</span>
                </div>
                <strong>
                  {euro(o.prix)} €<small>{r.unite}</small>
                </strong>
                <button type="button" aria-pressed={favori} aria-label={favori ? 'Retirer des favoris' : 'Garder en favori'} onClick={() => basculer(cle)}>
                  <svg viewBox="0 0 20 20" fill={favori ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M10 2.6l2.3 4.7 5.2.8-3.8 3.6.9 5.2L10 14.4l-4.6 2.5.9-5.2L2.5 8.1l5.2-.8z" />
                  </svg>
                </button>
              </li>
            )
          })}
        </ul>
      </EcranCaso>
      <div className="essai">
        <span className="mono">Essayez une autre recherche</span>
        <div className="puces" role="group" aria-label="Recherche">
          {RECHERCHES.map((x, i) => (
            <button key={x.mot} type="button" aria-pressed={choix === i} onClick={() => setChoix(i)}>
              {x.mot}
            </button>
          ))}
        </div>
        <span className="mono">Exemple : magasins et prix fictifs</span>
      </div>
    </div>
  )
}
