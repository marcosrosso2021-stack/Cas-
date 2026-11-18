'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { rampe, suivre } from '@/lib/recit'
import { BarreChat, EcranCaso } from '../EcranCaso'

const ADRESSE = '12 rue des Lilas, Angers'

/** L'accueil de casô, le chat : l'artisan dicte, la fiche client et le chantier se créent. */
export function DemoAppel() {
  const [nom, setNom] = useState('Mme Martin')
  const texte = useRef<HTMLSpanElement>(null)
  const client = nom.trim() || 'Mme Martin'
  const phrase = `Nouveau client : ${client}, ${ADRESSE}. Salle de bain à refaire.`

  // La phrase s'écrit avec le défilement.
  useEffect(
    () =>
      suivre(1, (p) => {
        if (texte.current) texte.current.textContent = phrase.slice(0, Math.round(phrase.length * rampe(p, 0.06, 0.4)))
      }),
    [phrase],
  )

  return (
    <div>
      <EcranCaso>
        <div className="fil">
          <p className="msg-bot">Bonjour ! Dis-moi le client, les travaux et les quantités : je prépare ton devis.</p>
          <p className="msg-moi">
            <span ref={texte} />
            <i className="curs" />
          </p>
          <div className="msg-bot ap" style={{ '--a': 0.42 } as CSSProperties}>
            <strong>Client créé</strong>
            <span>
              {client} · {ADRESSE}
            </span>
          </div>
          <div className="msg-bot ap" style={{ '--a': 0.5 } as CSSProperties}>
            <strong>Chantier créé</strong>
            <span>
              {client} – {ADRESSE}
            </span>
          </div>
        </div>
        <BarreChat />
      </EcranCaso>
      <label className="essai" htmlFor="essai-nom">
        <span className="mono">Essayez avec un autre nom</span>
        <input id="essai-nom" value={nom} maxLength={28} onChange={(e) => setNom(e.target.value)} autoComplete="off" />
      </label>
    </div>
  )
}
