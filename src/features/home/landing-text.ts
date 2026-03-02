/**
 * Landing page copy. Edit this file to change all hero and future section text
 * without touching component code.
 */

export const landingText = {
  hero: {
    /** Headline: split with rounded image in center (like DOMIEN layout) */
    headline: {
      line1: 'Descubre tu',
      line2: 'vocación perfecta',
      /** Rounded image in center of title. Use /images/... or leave empty for placeholder */
      centerImage: '/images/laptop-mockup.webp',
    },
    /** Short line under the headline */
    subhead:
      'Orientación vocacional conversacional con IA. Test RIASEC interactivo, recomendaciones personalizadas, encuentra tu carrera ideal.',
    /** Primary CTA (blue button) – when not logged in */
    ctaPrimary: 'Probar gratis',
    /** Primary CTA when logged in */
    ctaPrimaryAuthenticated: 'Comenzar Análisis',
    /** Secondary CTA (dark green button) */
    ctaSecondary: 'Ver cómo funciona',
  },
  // Add more sections here as we redesign, e.g.:
  // features: { title: '...', items: [...] },
  // cta: { title: '...', button: '...' },
}
