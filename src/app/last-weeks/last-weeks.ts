import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import dayjs, { type Dayjs } from 'dayjs/esm';
import { map, type Observable } from 'rxjs';
import { ExpensesService } from '../expenses.service';
import { SettingsService } from '../settings.service';
import { TrendChart } from '../trend-chart/trend-chart';
import { createLinearTrend } from '../utils/trend.utils';

interface ExpenseTrend {
  name: string;
  series: TrendPoint[];
}

interface TrendPoint {
  name: string;
  value: number;
  changePercentage: number | null;
  trend: 'up' | 'down' | 'flat';
}

const WEEK_COUNT = 6;

@Component({
  selector: 'squirrelli-last-weeks',
  imports: [AsyncPipe, MatCardModule, TranslatePipe, TrendChart],
  templateUrl: './last-weeks.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class LastWeeks {
  protected readonly trend$: Observable<ExpenseTrend[]>;
  protected readonly formatAmount: (value: number) => string;
  protected readonly formatChange = (value: number): string => `${Math.abs(value).toFixed(0)}%`;

  constructor(expensesService: ExpensesService, settingsService: SettingsService) {
    const currentWeek = this.startOfWeek(dayjs());
    const fromDate = currentWeek.subtract(WEEK_COUNT - 1, 'week');
    const untilDate = currentWeek.add(6, 'day').endOf('day');
    const currency = this.getCurrency(settingsService);

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
          if (!expense.date) {
            continue;
          }
          const week = this.startOfWeek(expense.date).format('YYYY-MM-DD');
          totals.set(week, (totals.get(week) ?? 0) + Number(expense.amount ?? 0));
        }

        const series = Array.from({ length: WEEK_COUNT }, (_, index) => {
          const week = fromDate.add(index, 'week');
          return {
            name: week.format('D MMM'),
            value: totals.get(week.format('YYYY-MM-DD')) ?? 0,
          };
        }).map((point, index, points): TrendPoint => {
          const previous = points[index - 1]?.value;
          if (previous === undefined) {
            return { ...point, changePercentage: null, trend: 'flat' };
          }
          if (previous === 0) {
            return {
              ...point,
              changePercentage: point.value === 0 ? 0 : null,
              trend: 'flat',
            };
          }
          const changePercentage = ((point.value - previous) / previous) * 100;
          return {
            ...point,
            changePercentage,
            trend: changePercentage > 0 ? 'up' : changePercentage < 0 ? 'down' : 'flat',
          };
        });

        const trend = createLinearTrend(series).map(
          (point): TrendPoint => ({
            ...point,
            changePercentage: null,
            trend: 'flat',
          }),
        );

        return [
          {
            name: 'Expenses',
            series,
          },
          {
            name: 'Trend',
            series: trend,
          },
        ];
      }),
    );
  }

  private startOfWeek(date: Dayjs): Dayjs {
    const daysSinceMonday = (date.day() + 6) % 7;
    return date.subtract(daysSinceMonday, 'day').startOf('day');
  }

  private getCurrency(settingsService: SettingsService): string {
    const configuration = settingsService.settings()?.configuration;
    return configuration &&
      typeof configuration === 'object' &&
      !Array.isArray(configuration) &&
      configuration['baseCurrency'] === 'CHF'
      ? 'CHF'
      : 'EUR';
  }
}
