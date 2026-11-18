'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { rampe, suivre } from '@/lib/recit'

const ADRESSE = '12 rue des Lilas, Angers'

/** L'artisan dicte : la fiche client et le chantier se créent dans le chat de casô. */
export function DemoAppel() {
  const [nom, setNom] = useState('Mme Martin')
  const texte = useRef<HTMLSpanElement>(null)
  const client = nom.trim() || 'Mme Martin'
  const phrase = `Nouveau client : ${client}, ${ADRESSE}. Salle de bain à refaire.`

  // La phrase s'écrit avec le défilement.
  useEffect(
    () =>
      suivre(1, (p) => {
        if (texte.current) texte.current.textContent = phrase.slice(0, Math.round(phrase.length * rampe(p, 0.06, 0.42)))
      }),
    [phrase],
  )

  return (
    <div className="chat carte">
      <div className="chat-tete">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="logo-caso.png" alt="" width={26} height={26} />
        casô
      </div>
      <p className="bulle">
        <span ref={texte} />
        <i className="curs" />
      </p>
      <div className="reponse ap" style={{ '--a': 0.44 } as CSSProperties}>
        <strong>Client créé</strong>
        <span>
          {client} · {ADRESSE}
        </span>
      </div>
      <div className="reponse ap" style={{ '--a': 0.52 } as CSSProperties}>
        <strong>Chantier créé</strong>
        <span>
          {client} – {ADRESSE}
        </span>
      </div>
      <label className="essai" htmlFor="essai-nom">
        <span className="mono">Essayez avec un autre nom</span>
        <input id="essai-nom" value={nom} maxLength={28} onChange={(e) => setNom(e.target.value)} autoComplete="off" />
      </label>
    </div>
  )
}
