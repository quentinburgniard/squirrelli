import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import dayjs from 'dayjs/esm';
import { map, type Observable } from 'rxjs';
import { ExpensesService } from '../expenses.service';
import { Empty } from '../empty/empty';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../settings.service';

interface CategorySlice {
  name: string;
  value: number;
  color: string;
  start: number;
  end: number;
  other: boolean;
}

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#22c55e', '#3b82f6', '#64748b'];

@Component({
  selector: 'nutio-last-month-categories',
  imports: [Empty, AsyncPipe, MatCardModule, TranslatePipe],
  templateUrl: './last-month-categories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class LastMonthCategories {
  protected readonly categories$: Observable<CategorySlice[]>;
  protected readonly formatAmount: (value: number) => string;

  constructor(
    expensesService: ExpensesService,
    settingsService: SettingsService,
    translations: TranslateService,
  ) {
    const lastMonth = dayjs().subtract(1, 'month');
    const configuration = settingsService.settings()?.configuration;
    const currency =
      configuration &&
      typeof configuration === 'object' &&
      !Array.isArray(configuration) &&
      configuration['baseCurrency'] === 'CHF'
        ? 'CHF'
        : 'EUR';

    this.formatAmount = (value) =>
      new Intl.NumberFormat('fr-CH', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);

    this.categories$ = expensesService
      .getExpensesInDateRange(lastMonth.startOf('month'), lastMonth.endOf('month'))
      .pipe(
        map((expenses) => {
          const totals = new Map<string, number>();
          for (const expense of expenses) {
            const name =
              expense.category?.name ||
              expense.merchant?.category?.name ||
              translations.instant('noCategory');
            totals.set(name, (totals.get(name) ?? 0) + Number(expense.amount ?? 0));
          }

          const sorted = [...totals.entries()]
            .map(([name, value]) => ({ name, value, other: false }))
            .sort((a, b) => b.value - a.value);
          const visible = sorted.slice(0, 6);
          const otherValue = sorted.slice(6).reduce((total, item) => total + item.value, 0);
          if (otherValue > 0) {
            visible.push({ name: translations.instant('other'), value: otherValue, other: true });
          }

          const total = visible.reduce((sum, item) => sum + item.value, 0);
          let position = 0;
          return visible.map((item, index) => {
            const start = position;
            position += total ? (item.value / total) * 100 : 0;
            return { ...item, color: COLORS[index], start, end: position };
          });
        }),
      );
  }

  protected gradient(categories: readonly CategorySlice[]): string {
    if (!categories.length) return 'var(--mat-sys-surface-container-highest)';
    return `conic-gradient(${categories
      .map(({ color, start, end }) => `${color} ${start}% ${end}%`)
      .join(', ')})`;
  }

  protected total(categories: readonly CategorySlice[]): number {
    return categories.reduce((sum, category) => sum + category.value, 0);
  }
}
