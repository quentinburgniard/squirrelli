import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map, Observable } from 'rxjs';
import dayjs from 'dayjs/esm';
import type { Expense } from '../expense.types';
import { ExpensesService } from '../expenses.service';
import { Expense as ExpenseComponent } from '../expense/expense';
import { LastMonths } from '../last-months/last-months';
import { LastWeeks } from '../last-weeks/last-weeks';
import { SettingsService } from '../settings.service';
import { TranslatePipe } from '../i18n/translate.pipe';
import { getNextResetDate } from '../utils/reset-date.utils';

@Component({
  selector: 'squirrelli-home',
  imports: [MatCardModule, ExpenseComponent, LastMonths, LastWeeks, AsyncPipe, TranslatePipe],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block' },
})
export class Home {
  protected readonly expenses$: Observable<Expense[]>;
  protected readonly untilDateLabel$: Observable<string>;

  constructor(
    private readonly expensesService: ExpensesService,
    settingsService: SettingsService,
  ) {
    const today = dayjs().startOf('day');
    const configuration = settingsService.settings()?.configuration;
    const resetDay =
      configuration && typeof configuration === 'object' && !Array.isArray(configuration)
        ? configuration['monthlyResetDay']
        : null;

    this.expensesService.fromDate = today;
    this.expensesService.untilDate = getNextResetDate(
      today,
      typeof resetDay === 'number' ? resetDay : null,
    );
    this.expenses$ = this.expensesService.expenses$;
    this.untilDateLabel$ = this.expensesService.untilDate$.pipe(
      map((untilDate) => (untilDate ? untilDate.format('D MMMM') : 'All dates')),
    );
  }
}
