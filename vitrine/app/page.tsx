import { Conversion, Footer } from '@/components/dom/Fin'
import { Fond3D } from '@/components/dom/Fond3D'
import { Header } from '@/components/dom/Header'
import { Rail } from '@/components/dom/Rail'
import { Recit } from '@/components/dom/Recit'

/** Tout le texte est écrit dans la page dès le départ ; la 3D arrive ensuite, derrière. */
export default function Page() {
  return (
    <>
      <Header />
      <Fond3D />
      <main>
        <Recit />
        <Conversion />
      </main>
      <Footer />
      <Rail />
    </>
  )
}
