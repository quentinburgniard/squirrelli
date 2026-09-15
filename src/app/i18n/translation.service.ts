import { Injectable, computed, inject, signal } from '@angular/core';
import { SettingsService } from '../settings.service';
import { type SupportedLanguage, type TranslationKey, translations } from './translations';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly settingsService = inject(SettingsService);
  private readonly selectedLanguage = signal<SupportedLanguage | null>(null);
  readonly language = computed<SupportedLanguage>(() => {
    const selected = this.selectedLanguage();
    if (selected) return selected;
    const configuration = this.settingsService.settings()?.configuration;
    const value =
      configuration && typeof configuration === 'object' && !Array.isArray(configuration)
        ? configuration['language']
        : null;
    if (value === 'Francais' || value === 'French' || value === 'fr') return 'fr';
    if (value === 'Portuguese' || value === 'Português' || value === 'pt') return 'pt';
    return 'en';
  });

  select(value: string): void {
    this.selectedLanguage.set(
      value === 'Francais' || value === 'French' || value === 'fr'
        ? 'fr'
        : value === 'Portuguese' || value === 'Português' || value === 'pt'
          ? 'pt'
          : 'en',
    );
  }

  translate(key: TranslationKey, params?: Record<string, string | number>): string {
    let value: string = translations[this.language()][key] ?? translations.en[key];
    for (const [name, replacement] of Object.entries(params ?? {})) {
      value = value.replaceAll(`{{${name}}}`, String(replacement));
    }
    return value;
  }
}
