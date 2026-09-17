import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import dayjs from 'dayjs/esm';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import type { Expense } from '../expense.types';
import {
  EMPTY_EXPENSE_FILTERS,
  ExpenseFilters,
  type ExpenseFiltersValue,
} from '../expense-filters/expense-filters';
import { ExpensesService } from '../expenses.service';
import { Expense as ExpenseComponent } from '../expense/expense';
import { FloatingActions, type FloatingActionNav } from '../floating-actions/floating-actions';
import { TranslatePipe } from '../i18n/translate.pipe';
import { createNameSearch } from '../utils/name-search';

@Component({
  selector: 'squirrelli-expenses',
  imports: [
    AsyncPipe,
    ExpenseComponent,
    MatCardModule,
    ExpenseFilters,
    FloatingActions,
    TranslatePipe,
  ],
  templateUrl: './expenses.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class Expenses {
  protected readonly actions: readonly FloatingActionNav[] = [
    { label: 'importExpenses', icon: 'upload_file', routerLink: '/expenses/import' },
    { label: 'addExpense', icon: 'add', routerLink: '/expenses/edit' },
  ];
  protected readonly filteredExpenses$: Observable<Expense[]>;
  private readonly filtersSubject = new BehaviorSubject<ExpenseFiltersValue>(EMPTY_EXPENSE_FILTERS);

  constructor(private readonly expensesService: ExpensesService) {
    this.expensesService.fromDate = null;
    this.expensesService.untilDate = null;
    this.filteredExpenses$ = combineLatest([
      this.expensesService.expenses$.pipe(
        map((expenses) =>
          createNameSearch(
            expenses,
            (expense) => expense.merchant?.name?.trim() || expense.category?.name || '',
          ),
        ),
      ),
      this.filtersSubject,
    ]).pipe(
      map(([searchExpenses, filters]) => {
        const fromDate = filters.fromDate ? dayjs(filters.fromDate).startOf('day') : null;
        const untilDate = filters.untilDate ? dayjs(filters.untilDate).endOf('day') : null;

        return searchExpenses(filters.merchant ?? '').filter((expense) => {
          const amount = Number(expense.amount);

          return (
            (!fromDate || (!!expense.date && !expense.date.isBefore(fromDate))) &&
            (!untilDate || (!!expense.date && !expense.date.isAfter(untilDate))) &&
            (filters.minimumAmount == null || amount >= filters.minimumAmount) &&
            (filters.maximumAmount == null || amount <= filters.maximumAmount)
          );
        });
      }),
    );
  }

  protected updateFilters(filters: ExpenseFiltersValue): void {
    this.filtersSubject.next(filters);
  }
}
