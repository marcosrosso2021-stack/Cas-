import { create } from 'zustand'
import type { PieceId } from '@/data/maison'
import type { MursId, SolId } from '@/data/materiaux'

export type Qualite = 'high' | 'medium' | 'low'

/** Commandes que la caméra expose à l'interface (boutons de zoom). */
export interface ApiCamera {
  zoom: (facteur: number) => void
}

interface EtatShowcase {
  piece: PieceId
  setPiece: (p: PieceId) => void
  /** Vue avant / après active dans la pièce courante. */
  renov: boolean
  setRenov: (v: boolean) => void
  /** Position du curseur avant / après, de 0 à 1. */
  partage: number
  setPartage: (v: number) => void
  sol: SolId
  setSol: (s: SolId) => void
  murs: MursId
  setMurs: (m: MursId) => void
  qualite: Qualite
  setQualite: (q: Qualite) => void
  /** null tant que la détection n'a pas eu lieu. */
  webgl: boolean | null
  setWebgl: (v: boolean) => void
  /** La scène est à l'écran : sinon le rendu s'arrête. */
  visible: boolean
  setVisible: (v: boolean) => void
  /** Le visiteur a déjà manipulé la maison. */
  touche: boolean
  setTouche: () => void
  camera: ApiCamera | null
  setCamera: (c: ApiCamera | null) => void
}

export const useShowcase = create<EtatShowcase>((set) => ({
  piece: 'exterieur',
  setPiece: (piece) => set((s) => ({ piece, renov: piece === s.piece ? s.renov : false, partage: 0.5, touche: true })),
  renov: false,
  setRenov: (renov) => set({ renov }),
  partage: 0.5,
  setPartage: (partage) => set({ partage: Math.min(0.97, Math.max(0.03, partage)) }),
  sol: 'chene',
  setSol: (sol) => set({ sol }),
  murs: 'blanc',
  setMurs: (murs) => set({ murs }),
  qualite: 'medium',
  setQualite: (qualite) => set({ qualite }),
  webgl: null,
  setWebgl: (webgl) => set({ webgl }),
  visible: true,
  setVisible: (visible) => set({ visible }),
  touche: false,
  setTouche: () => set({ touche: true }),
  camera: null,
  setCamera: (camera) => set({ camera }),
}))
