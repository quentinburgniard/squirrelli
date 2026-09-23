import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import dayjs from 'dayjs/esm';
import { map, type Observable } from 'rxjs';
import { ExpensesService } from '../expenses.service';
import { TranslatePipe } from '@ngx-translate/core';
import { SettingsService } from '../settings.service';
import { TrendChart } from '../trend-chart/trend-chart';
import { createLinearTrend } from '../utils/trend.utils';

interface TrendPoint {
  name: string;
  value: number;
  changePercentage: number | null;
  trend: 'up' | 'down' | 'flat';
}
interface ExpenseTrend {
  name: string;
  series: TrendPoint[];
}
const MONTH_COUNT = 6;

@Component({
  selector: 'nutio-last-months',
  imports: [AsyncPipe, MatCardModule, TranslatePipe, TrendChart],
  templateUrl: './last-months.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class LastMonths {
  protected readonly trend$: Observable<ExpenseTrend[]>;
  protected readonly formatAmount: (value: number) => string;
  protected readonly formatMonth = (value: string): string => value.split(' ')[0];
  protected readonly formatChange = (value: number): string => `${Math.abs(value).toFixed(0)}%`;

  constructor(expensesService: ExpensesService, settingsService: SettingsService) {
    const untilDate = dayjs().endOf('month');
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
    this.trend$ = expensesService.getExpensesInDateRange(fromDate, untilDate).pipe(
      map((expenses) => {
        const totals = new Map<string, number>();
        for (const expense of expenses) {
          if (!expense.date) continue;
          const month = expense.date.format('YYYY-MM');
          totals.set(month, (totals.get(month) ?? 0) + Number(expense.amount ?? 0));
        }
        const base = Array.from({ length: MONTH_COUNT }, (_, index) => {
          const month = fromDate.add(index, 'month');
          return {
            name: month.format('MMM YYYY'),
            value: totals.get(month.format('YYYY-MM')) ?? 0,
          };
        });
        const series = base.map((point, index): TrendPoint => {
          const previous = base[index - 1]?.value;
          if (previous === undefined || previous === 0)
            return {
              ...point,
              changePercentage: previous === 0 && point.value === 0 ? 0 : null,
              trend: 'flat',
            };
          const changePercentage = ((point.value - previous) / previous) * 100;
          return {
            ...point,
            changePercentage,
            trend: changePercentage > 0 ? 'up' : changePercentage < 0 ? 'down' : 'flat',
          };
        });
        const trend = createLinearTrend(series).map(
          (point): TrendPoint => ({ ...point, changePercentage: null, trend: 'flat' }),
        );
        return [
          { name: 'Expenses', series },
          { name: 'Trend', series: trend },
        ];
      }),
    );
  }
}
