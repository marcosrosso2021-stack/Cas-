'use client'

import { useState, type CSSProperties } from 'react'
import { BarreChat, EcranCaso } from '../EcranCaso'

/** L'artisan demande où il en est : casô répond avec les chiffres du chantier. */
export function DemoPoint() {
  const [relance, setRelance] = useState(false)
  return (
    <div>
      <EcranCaso>
        <div className="fil">
          <p className="msg-moi">Combien j’ai gagné chez Martin ?</p>
          <div className="msg-bot ap" style={{ '--a': 0.1 } as CSSProperties}>
            <strong>Chantier Martin</strong>
            <dl>
              <dt>Devis signé</dt>
              <dd>3 410,00 €</dd>
              <dt>Achats</dt>
              <dd>− 1 180,00 €</dd>
              <dt>21 h pointées</dt>
              <dd>− 630,00 €</dd>
              <dt className="fort">Il te reste</dt>
              <dd className="fort">1 600,00 €</dd>
            </dl>
          </div>
          <div className="msg-bot ap" style={{ '--a': 0.26 } as CSSProperties}>
            <strong>{relance ? 'Message de relance prêt' : 'Un devis attend depuis 7 jours'}</strong>
            <span>{relance ? 'À envoyer par SMS, WhatsApp ou e-mail.' : 'M. Leroy · cuisine'}</span>
            {!relance && (
              <button type="button" className="btn-app" onClick={() => setRelance(true)}>
                Relancer
              </button>
            )}
          </div>
        </div>
        <BarreChat />
      </EcranCaso>
      <p className="mono exemple">Exemple</p>
    </div>
  )
}
