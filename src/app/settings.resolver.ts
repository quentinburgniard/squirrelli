import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, switchMap } from 'rxjs';
import { SettingsService, type Configuration } from './settings.service';
import { resolveLanguage } from './i18n/language';

export const settingsResolver: ResolveFn<Configuration | null> = () => {
  const settingsService = inject(SettingsService);
  const translate = inject(TranslateService);
  return settingsService.fetchSettings().pipe(
    switchMap((settings) => {
      const configuration = settings?.configuration;
      const language =
        configuration && typeof configuration === 'object' && !Array.isArray(configuration)
          ? configuration['language']
          : null;
      return translate.use(resolveLanguage(language)).pipe(map(() => settings));
    }),
  );
};
