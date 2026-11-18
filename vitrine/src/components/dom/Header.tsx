import { LIENS } from '@/config/liens'

export function Marque() {
  return (
    <a className="marque" href="#maison" aria-label="casô, haut de page">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="logo-caso.png" alt="" width={34} height={34} />
      casô
    </a>
  )
}

export function Header() {
  return (
    <header className="tete">
      <Marque />
      <nav aria-label="Navigation">
        <a href="#parcours">Parcours</a>
        <a href="#fonctionnalites">Fonctionnalités</a>
        <a className="btn petit" href={LIENS.espace} target="_blank" rel="noopener">
          Mon espace
        </a>
      </nav>
    </header>
  )
}
