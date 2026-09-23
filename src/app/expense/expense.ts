import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeFrCH from '@angular/common/locales/fr-CH';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import type { Expense as ExpenseModel } from '../expense.types';
import { SettingsService } from '../settings.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

registerLocaleData(localeFrCH);

const BADGE_ROLES = ['primary', 'secondary', 'tertiary'] as const;

@Component({
  selector: 'nutio-expense',
  imports: [CurrencyPipe, RouterLink, MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './expense.html',
  styleUrl: './expense.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Expense {
  readonly expense = input.required<ExpenseModel>();
  private readonly settingsService = inject(SettingsService);
  private readonly translations = inject(TranslateService);
  protected readonly consolidatedCurrency = computed(() => {
    const configuration = this.settingsService.settings()?.configuration;
    return configuration &&
      typeof configuration === 'object' &&
      !Array.isArray(configuration) &&
      configuration['baseCurrency'] === 'CHF'
      ? 'CHF'
      : 'EUR';
  });

  protected readonly name = computed(() => {
    this.translations.currentLang();
    return (
      this.expense().merchant?.name?.trim() ||
      this.expense().category?.name?.trim() ||
      (this.translations.instant('unknownExpense') as string)
    );
  });
  protected readonly initial = computed(() => Array.from(this.name())[0].toLocaleUpperCase());
  protected readonly badgeRole = computed(() => {
    const hash = Array.from(this.name().toLocaleLowerCase()).reduce(
      (value, character) => (value * 31 + character.codePointAt(0)!) >>> 0,
      0,
    );
    return BADGE_ROLES[hash % BADGE_ROLES.length];
  });
  protected readonly currency = computed(() => this.expense().currency?.toUpperCase() || 'EUR');
  protected readonly date = computed(() => {
    this.translations.currentLang();
    const date = this.expense().date;
    return date?.isValid()
      ? date.format('MMM D, YYYY')
      : (this.translations.instant('noDate') as string);
  });
}
