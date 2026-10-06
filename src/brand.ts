// ── Fill these in once; every guide uses them. ──
export const brand = {
  companyName: 'C-Data Cloud',
  /** Path inside public/. Transparent PNG or SVG works best. */
  logo: 'brand/logo.svg',
  colors: {
    primary: '#1565FF', // TODO: C-Data Cloud brand color
    accent: '#FFB020', // highlight boxes
    dark: '#0E1726', // backgrounds
    text: '#FFFFFF',
  },
  supportLine: {
    he: 'צריכים עזרה? צוות התמיכה של C-Data Cloud כאן בשבילכם',
    en: 'Need help? The C-Data Cloud support team is here for you',
  },
  /** e.g. email or portal URL shown under the support line; '' to hide. */
  supportContact: 'c-data-cloud.co.il/support',
  /** Optional background music in public/, played quietly under everything. null to disable. */
  music: null as string | null,
  musicVolume: 0.08,
};
