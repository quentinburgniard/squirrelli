import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';
import type { TranslationKey } from './translations';

@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly translations = inject(TranslationService);

  transform(key: TranslationKey, params?: Record<string, string | number>): string {
    return this.translations.translate(key, params);
  }
}
