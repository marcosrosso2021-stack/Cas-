/** État de l'animation de la maison, lu à chaque image par les murs, le plan et les arbres. */
export const anim = { entree: 0, ouvert: 0, eclat: 0 }

export const borne = (v: number) => Math.min(1, Math.max(0, v))
export const doux = (t: number) => 1 - Math.pow(1 - t, 3)
