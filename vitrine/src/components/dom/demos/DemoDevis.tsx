'use client'

import { useState, type CSSProperties } from 'react'

const euro = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

interface Ligne {
  nom: string
  unite: string
  qte: number
  prix: number
  reglable?: boolean
}

/** Prix d'exemple : dans casô, ce sont ceux de l'artisan. */
const LIGNES: Ligne[] = [
  { nom: 'Dépose de la baignoire', unite: 'forfait', qte: 1, prix: 180 },
  { nom: 'Douche à l’italienne, receveur et paroi', unite: 'u', qte: 1, prix: 1450 },
  { nom: 'Carrelage au sol, fourniture et pose', unite: 'm²', qte: 14, prix: 62, reglable: true },
  { nom: 'Peinture des murs et du plafond', unite: 'm²', qte: 38, prix: 24 },
]

/** Le devis de la salle de bain se construit ligne par ligne, puis se signe. */
export function DemoDevis() {
  const [surface, setSurface] = useState(14)
  const [signe, setSigne] = useState(false)
  const lignes = LIGNES.map((l) => (l.reglable ? { ...l, qte: surface } : l))
  const ht = lignes.reduce((s, l) => s + l.qte * l.prix, 0)
  const tva = ht * 0.1

  return (
    <div>
      <div className="feuille">
        <header>
          <div>
            <strong>Devis</strong>
            <span className="mono">Mme Martin · salle de bain</span>
          </div>
          {signe && <span className="pastille">Signé · envoyé par lien</span>}
        </header>
        {lignes.map((l, i) => (
          <div className="lg ap" key={l.nom} style={{ '--a': 0.06 + i * 0.08 } as CSSProperties}>
            <span>{l.nom}</span>
            <b>{euro(l.qte * l.prix)}</b>
            <small>
              {l.reglable ? (
                <span className="pas">
                  <button type="button" onClick={() => setSurface((s) => Math.max(8, s - 1))} aria-label="Un mètre carré de moins">
                    −
                  </button>
                  <output>
                    {l.qte} {l.unite}
                  </output>
                  <button type="button" onClick={() => setSurface((s) => Math.min(24, s + 1))} aria-label="Un mètre carré de plus">
                    +
                  </button>
                </span>
              ) : (
                <>
                  {l.qte} {l.unite}
                </>
              )}
              {' × '}
              {euro(l.prix)}
            </small>
          </div>
        ))}
        <div className="tot ap" style={{ '--a': 0.46 } as CSSProperties}>
          <span>Total HT</span>
          <span>{euro(ht)} €</span>
          <span>TVA 10 %</span>
          <span>{euro(tva)} €</span>
          <span className="ttcl">Total TTC</span>
          <span className="ttc">{euro(ht + tva)} €</span>
        </div>
        <div className="signe ap" style={{ '--a': 0.54 } as CSSProperties}>
          {signe ? (
            <svg viewBox="0 0 120 44" fill="none" stroke="#18181a" strokeWidth="2" strokeLinecap="round" aria-label="Signature">
              <path d="M6 30c10-22 16-22 14-6s8 6 14-6 6 14 12 8 6-16 12-8-2 16 8 8 10-10 18-6 12 8 28 2" />
            </svg>
          ) : (
            <span />
          )}
          <button type="button" className="btn petit" onClick={() => setSigne((s) => !s)}>
            {signe ? 'Reprendre le devis' : 'Signer et envoyer'}
          </button>
        </div>
      </div>
      <p className="mono exemple">Exemple. Dans casô, ce sont vos prix.</p>
    </div>
  )
}
