import type { ReactNode } from 'react'

type Onglet = 'devis' | 'services' | 'pointage' | 'historique'

const ONGLETS: { id: Onglet; nom: string; trace: string }[] = [
  { id: 'devis', nom: 'Devis', trace: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5' },
  { id: 'services', nom: 'Mes services', trace: 'M3 12l9-9h8v8l-9 9zM15.5 8.5h.01' },
  { id: 'pointage', nom: 'Pointage', trace: 'M4 16a8 8 0 0 1 16 0M2 16h20M12 8v3' },
  { id: 'historique', nom: 'Historique', trace: 'M4 6h16v4H4zM6 10v9h12v-9M10 14h4' },
]

/**
 * Le cadre d'un écran de l'appli casô : même en-tête (retour, logo, nom de la page, profil)
 * et même barre du bas que dans l'appli. Les commandes du cadre sont une image de l'appli,
 * pas des boutons ; ce qui s'utilise vraiment est dans le contenu.
 */
export function EcranCaso({
  titre,
  retour = false,
  onglet,
  children,
}: {
  titre?: string
  retour?: boolean
  onglet?: Onglet
  children: ReactNode
}) {
  return (
    <div className="ecran">
      <div className="ecran-tete" aria-hidden="true">
        {retour && (
          <span className="ecran-rond">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="logo-caso.png" alt="" width={30} height={30} />
        <b>{titre}</b>
        <span className="ecran-rond profil">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="8" cy="5.4" r="2.6" />
            <path d="M3 14a5 5 0 0 1 10 0" />
          </svg>
        </span>
      </div>
      <div className="ecran-corps">{children}</div>
      <div className="ecran-barre" aria-hidden="true">
        {ONGLETS.map((o) => (
          <span key={o.id} className={onglet === o.id ? 'actif' : undefined}>
            <i>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d={o.trace} />
              </svg>
            </i>
            {o.nom}
          </span>
        ))}
      </div>
    </div>
  )
}

/** La barre d'écriture du chat de casô. */
export function BarreChat({ texte }: { texte?: ReactNode }) {
  return (
    <div className="barre-chat" aria-hidden="true">
      <span className="puce-3d">3D</span>
      <span className="saisie">{texte ?? 'Écris ici : client, travaux…'}</span>
      <span className="micro">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <rect x="5.6" y="1.6" width="4.8" height="7.6" rx="2.4" />
          <path d="M3.2 7.6a4.8 4.8 0 0 0 9.6 0M8 12.4v2" />
        </svg>
      </span>
    </div>
  )
}
