import type { CSSProperties } from 'react'
import { LIENS } from '@/config/liens'
import { ETAPES, FONCTIONS } from '@/data/contenu'
import { Marque } from './Header'
import { Fleche, Icone } from './Icone'

/** De la pièce filmée au devis : le parcours dans l'appli. */
export function Parcours() {
  return (
    <section className="bloc" id="parcours">
      <p className="mono">Dans l’appli</p>
      <h2>De la pièce filmée au devis.</h2>
      <ol className="etapes">
        {ETAPES.map((e, i) => (
          <li className="carte" key={e.nom} style={{ '--i': i } as CSSProperties}>
            <h3>{e.nom}</h3>
            <p>{e.phrase}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** Les modules de casô, une ligne chacun. */
export function Fonctions() {
  return (
    <section className="bloc" id="fonctionnalites" style={{ paddingTop: 0 }}>
      <p className="mono">Fonctionnalités</p>
      <h2>Tout le chantier, une seule appli.</h2>
      <ul className="fonctions">
        {FONCTIONS.map((f) => (
          <li className="carte" key={f.nom}>
            <span className="ico">
              <Icone nom={f.icone} />
            </span>
            <h3>{f.nom}</h3>
            <p>{f.phrase}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Conversion() {
  return (
    <section className="appel" aria-label="Commencer">
      <h2>Votre prochain projet commence ici.</h2>
      <div className="actions">
        <a className="btn jaune" href={LIENS.creerCompte} target="_blank" rel="noopener">
          Créer mon compte <Fleche />
        </a>
        <a className="btn contour" href={LIENS.espace} target="_blank" rel="noopener">
          Accéder à mon espace
        </a>
      </div>
      <p>Deux entrées : Artisan, pour votre entreprise. Bricoleur du dimanche, pour voir vos travaux avant de les lancer.</p>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="pied">
      <Marque />
      <span>Devis, 3D et chantier pour le bâtiment.</span>
      <nav aria-label="Pied de page">
        <a href="#maison">Maison 3D</a>
        <a href="#parcours">Parcours</a>
        <a href="#fonctionnalites">Fonctionnalités</a>
      </nav>
    </footer>
  )
}
