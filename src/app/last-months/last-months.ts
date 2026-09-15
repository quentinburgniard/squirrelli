import { AsyncPipe } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '../i18n/translate.pipe';
import { AreaChartModule } from '@swimlane/ngx-charts';
import dayjs from 'dayjs/esm';
import { map, type Observable } from 'rxjs';
import { ExpensesService } from '../expenses.service';
import { SettingsService } from '../settings.service';
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

const MONTH_COUNT = 6;

@Component({
  selector: 'squirrelli-last-months',
  imports: [AsyncPipe, AreaChartModule, MatCardModule, TranslatePipe],
  templateUrl: './last-months.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class LastMonths {
  protected readonly trend$: Observable<ExpenseTrend[]>;
  protected readonly formatAmount: (value: number) => string;
  protected readonly formatAxisAmount: (value: number) => string;
  protected readonly formatMonth = (value: string): string => value.split(' ')[0];
  protected readonly formatChange = (value: number): string => `${Math.abs(value).toFixed(0)}%`;
  protected readonly isMobile;
  protected readonly chartColors = [
    { name: 'Expenses', value: 'var(--mat-sys-primary)' },
    { name: 'Trend', value: 'var(--mat-sys-on-surface-variant)' },
  ];

  constructor(
    expensesService: ExpensesService,
    settingsService: SettingsService,
    breakpointObserver: BreakpointObserver,
  ) {
    const untilDate = dayjs().endOf('month');
    const fromDate = untilDate.subtract(MONTH_COUNT - 1, 'month').startOf('month');
    const currency = this.getCurrency(settingsService);

    this.formatAmount = (value) =>
      new Intl.NumberFormat('fr-CH', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    this.formatAxisAmount = (value) =>
      new Intl.NumberFormat('fr-CH', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value);
    this.isMobile = toSignal(
      breakpointObserver.observe('(max-width: 599px)').pipe(map(({ matches }) => matches)),
      { initialValue: false },
    );

    this.trend$ = expensesService.getExpensesInDateRange(fromDate, untilDate).pipe(
      map((expenses) => {
        const totals = new Map<string, number>();
        for (const expense of expenses) {
          if (!expense.date) {
            continue;
          }
          const month = expense.date.format('YYYY-MM');
          totals.set(month, (totals.get(month) ?? 0) + Number(expense.amount ?? 0));
        }

        const series = Array.from({ length: MONTH_COUNT }, (_, index) => {
          const month = fromDate.add(index, 'month');
          return {
            name: month.format('MMM YYYY'),
            value: totals.get(month.format('YYYY-MM')) ?? 0,
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
