'use client'

import { useState, type CSSProperties } from 'react'
import { EcranCaso } from '../EcranCaso'

interface Info {
  genre: 'Nouveauté du métier' | 'Règle'
  titre: string
  pour: string
  quand: string
  faire: string
}

/** Informations fictives, pour montrer la forme. Dans casô, chacune vient d'une source nommée. */
const METIERS: { nom: string; infos: Info[] }[] = [
  {
    nom: 'Carreleur',
    infos: [
      {
        genre: 'Nouveauté du métier',
        titre: 'Des croisillons autonivelants réutilisables',
        pour: 'Les carreleurs qui posent du grand format',
        quand: 'Disponible chez les négoces',
        faire: 'À essayer sur un prochain chantier',
      },
      {
        genre: 'Règle',
        titre: 'Une pièce de plus à garder pour la TVA réduite',
        pour: 'Les artisans qui facturent des travaux de rénovation',
        quand: 'À la date indiquée par le texte officiel',
        faire: 'Faire signer le document au client avant la facture',
      },
    ],
  },
  {
    nom: 'Plaquiste',
    infos: [
      {
        genre: 'Nouveauté du métier',
        titre: 'Une plaque plus légère pour les plafonds',
        pour: 'Les plaquistes qui travaillent seuls',
        quand: 'Disponible chez les négoces',
        faire: 'Comparer le prix avec votre plaque habituelle',
      },
      {
        genre: 'Règle',
        titre: 'Le tri des déchets de plâtre change',
        pour: 'Les entreprises qui déposent en déchetterie',
        quand: 'À la date indiquée par le texte officiel',
        faire: 'Prévoir une benne à part sur le devis',
      },
    ],
  },
  {
    nom: 'Électricien',
    infos: [
      {
        genre: 'Nouveauté du métier',
        titre: 'Un testeur qui range ses mesures tout seul',
        pour: 'Les électriciens qui font des mises en conformité',
        quand: 'Disponible chez les grossistes',
        faire: 'Voir s’il remplace votre carnet de mesures',
      },
      {
        genre: 'Règle',
        titre: 'Une mention de plus sur l’attestation de conformité',
        pour: 'Les installateurs en logement',
        quand: 'À la date indiquée par le texte officiel',
        faire: 'Mettre à jour votre modèle d’attestation',
      },
    ],
  },
]

/** L'écran Newsletter : les informations du métier, avec « Ça me concerne ? ». */
export function DemoVeille() {
  const [metier, setMetier] = useState(0)
  const [ouvert, setOuvert] = useState<number | null>(0)
  const m = METIERS[metier]

  return (
    <div>
      <EcranCaso titre="Newsletter" retour>
        <div className="segments" role="group" aria-label="Votre métier">
          {METIERS.map((x, i) => (
            <button
              key={x.nom}
              type="button"
              aria-pressed={metier === i}
              onClick={() => {
                setMetier(i)
                setOuvert(0)
              }}
            >
              {x.nom}
            </button>
          ))}
        </div>
        <ul className="infos">
          {m.infos.map((info, i) => (
            <li key={info.titre} className="ap" style={{ '--a': 0.06 + i * 0.12 } as CSSProperties}>
              <span className={`genre${info.genre === 'Règle' ? ' regle' : ''}`}>{info.genre}</span>
              <b>{info.titre}</b>
              <button type="button" aria-expanded={ouvert === i} onClick={() => setOuvert(ouvert === i ? null : i)}>
                Ça me concerne ?
              </button>
              {ouvert === i && (
                <dl>
                  <dt>Pour qui</dt>
                  <dd>{info.pour}</dd>
                  <dt>Quand</dt>
                  <dd>{info.quand}</dd>
                  <dt>À faire</dt>
                  <dd>{info.faire}</dd>
                </dl>
              )}
            </li>
          ))}
        </ul>
      </EcranCaso>
      <p className="mono exemple">Exemple fictif. Dans casô, chaque information cite sa source.</p>
    </div>
  )
}
