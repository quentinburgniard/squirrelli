export type TranslationKey = keyof typeof import('../../../public/i18n/en.json');

export type SupportedLanguage = 'en' | 'fr' | 'pt' | 'es' | 'de' | 'it';

export function resolveLanguage(value: unknown): SupportedLanguage {
  if (value === 'Francais' || value === 'French' || value === 'fr') return 'fr';
  if (value === 'Portuguese' || value === 'Português' || value === 'pt') return 'pt';
  if (value === 'Spanish' || value === 'Español' || value === 'es') return 'es';
  if (value === 'German' || value === 'Deutsch' || value === 'de') return 'de';
  if (value === 'Italian' || value === 'Italiano' || value === 'it') return 'it';
  return 'en';
}
