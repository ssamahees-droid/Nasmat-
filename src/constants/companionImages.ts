/**
 * Default realistic portrait images for Nesmat Hayat's Refiqi personas.
 * Generated studio-quality portraits matching psychological profiles.
 */
export const COMPANION_PERSONA_IMAGES = {
  child: '/src/assets/images/inner_child_avatar_1791878516397.jpg',
  adult: '/src/assets/images/balanced_adult_avatar_1791878517977.jpg',
  father: '/src/assets/images/wise_parent_avatar_1791878516950.jpg'
} as const;

export type RealisticPersonaKey = keyof typeof COMPANION_PERSONA_IMAGES;
