import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import dayjs from 'dayjs/esm';
import { map, type Observable } from 'rxjs';
import { ExpensesService } from '../expenses.service';
import { TranslatePipe } from '@ngx-translate/core';
import type { TranslationKey } from '../utils/translation.utils';
import { SettingsService } from '../settings.service';

interface MonthlyExpense {
  name: string;
  value: number;
}

interface SummaryBar {
  label: TranslationKey;
  value: number;
  lastMonth: boolean;
}
const MONTH_COUNT = 6;

@Component({
  selector: 'squirrelli-monthly-expense-summary',
  imports: [AsyncPipe, MatCardModule, TranslatePipe],
  templateUrl: './monthly-expense-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class MonthlyExpenseSummary {
  protected readonly months$: Observable<MonthlyExpense[]>;
  protected readonly formatAmount: (value: number) => string;

  constructor(expensesService: ExpensesService, settingsService: SettingsService) {
    const untilDate = dayjs().subtract(1, 'month').endOf('month');
    const fromDate = untilDate.subtract(MONTH_COUNT - 1, 'month').startOf('month');
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
    this.months$ = expensesService.getExpensesInDateRange(fromDate, untilDate).pipe(
      map((expenses) => {
        const totals = new Map<string, number>();
        for (const expense of expenses) {
          if (!expense.date) continue;
          const month = expense.date.format('YYYY-MM');
          totals.set(month, (totals.get(month) ?? 0) + Number(expense.amount ?? 0));
        }
        return Array.from({ length: MONTH_COUNT }, (_, index) => {
          const month = fromDate.add(index, 'month');
          return {
            name: month.format('MMM YYYY'),
            value: totals.get(month.format('YYYY-MM')) ?? 0,
          };
        });
      }),
    );
  }

  protected maximum(months: readonly MonthlyExpense[]): number {
    return Math.max(0, ...months.map(({ value }) => value));
  }
  protected minimum(months: readonly MonthlyExpense[]): number {
    return months.length ? Math.min(...months.map(({ value }) => value)) : 0;
  }
  protected average(months: readonly MonthlyExpense[]): number {
    return months.length
      ? months.reduce((total, { value }) => total + value, 0) / months.length
      : 0;
  }
  protected barWidth(value: number, maximum: number): number {
    return maximum ? (value / maximum) * 100 : 0;
  }

  protected summary(months: readonly MonthlyExpense[]): SummaryBar[] {
    const bars: SummaryBar[] = [
      { label: 'maximum', value: this.maximum(months), lastMonth: false },
      { label: 'minimum', value: this.minimum(months), lastMonth: false },
      { label: 'average', value: this.average(months), lastMonth: false },
      { label: 'lastMonth', value: months.at(-1)?.value ?? 0, lastMonth: true },
    ];
    return bars.sort((a, b) => b.value - a.value);
  }
}
