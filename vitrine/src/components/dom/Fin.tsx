import { LIENS } from '@/config/liens'
import { SIGNATURE } from '@/data/contenu'
import { Marque } from './Header'
import { Fleche } from './Icone'

export function Conversion() {
  return (
    <section className="appel" aria-label="Commencer avec casô">
      <h2>{SIGNATURE}</h2>
      <div className="actions">
        <a className="btn jaune" href={LIENS.creerCompte} target="_blank" rel="noopener">
          Créer mon compte <Fleche />
        </a>
        <a className="btn contour" href={LIENS.espace} target="_blank" rel="noopener">
          Me connecter
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
    </footer>
  )
}
