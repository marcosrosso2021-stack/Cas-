import { create } from 'zustand'
import type { PieceId } from '@/data/maison'
import type { MursId, SolId } from '@/data/materiaux'

export type Qualite = 'high' | 'medium' | 'low'

/**
 * Ce que fait la scène 3D selon le moment de la visite.
 * libre : le visiteur explore la maison. eclate : la maison s'ouvre et montre ses cotes.
 * renov : salle de bain avant / après. cache : la 3D est masquée et arrêtée.
 */
export type Mode = 'libre' | 'eclate' | 'renov' | 'cache'
export type Statut = 'saisie' | 'mesuree' | 'estimee'

const MODES: Mode[] = ['libre', 'cache', 'cache', 'eclate', 'renov', 'cache', 'cache', 'cache', 'cache', 'cache']

/** Commandes que la caméra expose à l'interface (boutons de zoom). */
export interface ApiCamera {
  zoom: (facteur: number) => void
}

interface EtatShowcase {
  /** L'histoire du crayon est finie : la maison peut se monter. */
  depart: boolean
  setDepart: () => void
  /** Moment de la visite affiché à l'écran, de 0 à 9. */
  chapitre: number
  setChapitre: (c: number) => void
  mode: Mode
  piece: PieceId
  setPiece: (p: PieceId) => void
  /** Vue avant / après active dans la pièce courante. */
  renov: boolean
  /** Position du curseur avant / après, de 0 à 1. */
  partage: number
  setPartage: (v: number) => void
  sol: SolId
  setSol: (s: SolId) => void
  murs: MursId
  setMurs: (m: MursId) => void
  /** Origine de cote mise en avant dans la vue éclatée. */
  statut: Statut | null
  setStatut: (s: Statut | null) => void
  qualite: Qualite
  setQualite: (q: Qualite) => void
  /** null tant que la détection n'a pas eu lieu. */
  webgl: boolean | null
  setWebgl: (v: boolean) => void
  /** L'onglet est visible : sinon le rendu s'arrête. */
  visible: boolean
  setVisible: (v: boolean) => void
  /** Le visiteur a déjà manipulé la maison. */
  touche: boolean
  setTouche: () => void
  camera: ApiCamera | null
  setCamera: (c: ApiCamera | null) => void
}

export const useShowcase = create<EtatShowcase>((set) => ({
  depart: false,
  setDepart: () => set({ depart: true }),
  chapitre: 0,
  setChapitre: (chapitre) =>
    set((s) => {
      if (chapitre === s.chapitre) return s
      const mode = MODES[chapitre] ?? 'cache'
      if (mode === 'renov') return { chapitre, mode, piece: 'bain', renov: true }
      if (mode === 'libre' || mode === 'eclate') return { chapitre, mode, piece: 'exterieur', renov: false }
      return { chapitre, mode, renov: false }
    }),
  mode: 'libre',
  piece: 'exterieur',
  setPiece: (piece) => set({ piece, touche: true }),
  renov: false,
  partage: 0.5,
  setPartage: (partage) => set({ partage: Math.min(0.97, Math.max(0.03, partage)) }),
  sol: 'chene',
  setSol: (sol) => set({ sol }),
  murs: 'blanc',
  setMurs: (murs) => set({ murs }),
  statut: null,
  setStatut: (statut) => set({ statut }),
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
