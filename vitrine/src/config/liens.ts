/**
 * Couche d'intégration avec l'appli casô.
 * La vitrine ne parle à aucune API : elle ouvre seulement l'appli, qui gère
 * elle-même la création de compte et la connexion.
 * Pour changer d'adresse : variable NEXT_PUBLIC_CASO_APP_URL au moment du build.
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_CASO_APP_URL ?? 'https://app-e6c6e91c-8623-4524-95ef-2cefb8b67f7b.cleverapps.io'

export const LIENS = {
  /** La création de compte se fait dans l'appli. */
  creerCompte: APP_URL,
  /** L'espace de l'usager est l'appli elle-même. */
  espace: APP_URL,
} as const
