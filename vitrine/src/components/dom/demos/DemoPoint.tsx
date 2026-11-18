'use client'

import { useState, type CSSProperties } from 'react'

/** L'artisan demande où il en est : casô répond avec les chiffres du chantier. */
export function DemoPoint() {
  const [relance, setRelance] = useState(false)
  return (
    <div className="chat carte">
      <div className="chat-tete">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="logo-caso.png" alt="" width={26} height={26} />
        casô
      </div>
      <p className="bulle">Combien j’ai gagné chez Martin ?</p>
      <div className="reponse ap" style={{ '--a': 0.12 } as CSSProperties}>
        <strong>Chantier Martin</strong>
        <dl>
          <dt>Devis signé</dt>
          <dd>3 410,00 €</dd>
          <dt>Achats</dt>
          <dd>− 1 180,00 €</dd>
          <dt>21 h pointées</dt>
          <dd>− 630,00 €</dd>
          <dt className="fort">Il vous reste</dt>
          <dd className="fort">1 600,00 €</dd>
        </dl>
      </div>
      <div className="reponse ap" style={{ '--a': 0.3 } as CSSProperties}>
        <strong>{relance ? 'Message de relance prêt' : 'Un devis attend depuis 7 jours'}</strong>
        <span>{relance ? 'À envoyer par SMS, WhatsApp ou e-mail.' : 'M. Leroy · cuisine'}</span>
        {!relance && (
          <button type="button" className="btn petit" style={{ justifySelf: 'start', marginTop: 8 }} onClick={() => setRelance(true)}>
            Relancer
          </button>
        )}
      </div>
      <p className="mono">Exemple</p>
    </div>
  )
}
