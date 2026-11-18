import { Header } from '@/components/dom/Header'
import { Conversion, Fonctions, Footer, Parcours } from '@/components/dom/Sections'
import { Stage } from '@/components/dom/Stage'

/** Tout le texte est écrit dans la page dès le départ ; la 3D arrive ensuite. */
export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Stage />
        <Parcours />
        <Fonctions />
        <Conversion />
      </main>
      <Footer />
    </>
  )
}
