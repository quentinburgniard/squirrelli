import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import dayjs from 'dayjs/esm';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import type { Expense } from '../expense.types';
import { ExpensesService } from '../expenses.service';
import { formatDate } from '../utils/date.utils';

@Component({
  selector: 'squirrelli-expenses',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatTableModule,
    NgxChartsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    RouterLink,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './expenses.html',
  host: { class: 'flex flex-col gap-4' },
})
export class Expenses {
  protected readonly filteredExpenses$: Observable<Expense[]>;
  protected readonly columns: string[] = ['date', 'merchant', 'amount'];
  protected readonly formatDate = formatDate;
  protected readonly filterForm = new FormGroup({
    merchant: new FormControl('', { nonNullable: true }),
    fromDate: new FormControl<Date | null>(null),
    untilDate: new FormControl<Date | null>(null),
    minimumAmount: new FormControl<number | null>(null),
    maximumAmount: new FormControl<number | null>(null),
  });

  constructor(private readonly expensesService: ExpensesService) {
    this.expensesService.fromDate = null;
    this.expensesService.untilDate = null;
    this.filteredExpenses$ = combineLatest([
      this.expensesService.expenses$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue())),
    ]).pipe(
      map(([expenses, filters]) => {
        const merchant = filters.merchant?.trim().toLocaleLowerCase() ?? '';
        const fromDate = filters.fromDate ? dayjs(filters.fromDate).startOf('day') : null;
        const untilDate = filters.untilDate ? dayjs(filters.untilDate).endOf('day') : null;

        return expenses.filter((expense) => {
          const expenseMerchant = (
            expense.merchant?.name ??
            expense.category?.name ??
            ''
          ).toLocaleLowerCase();
          const amount = Number(expense.amount);

          return (
            (!merchant || expenseMerchant.includes(merchant)) &&
            (!fromDate || (!!expense.date && !expense.date.isBefore(fromDate))) &&
            (!untilDate || (!!expense.date && !expense.date.isAfter(untilDate))) &&
            (filters.minimumAmount == null || amount >= filters.minimumAmount) &&
            (filters.maximumAmount == null || amount <= filters.maximumAmount)
          );
        });
      }),
    );
  }

  protected clearFilters(): void {
    this.filterForm.reset({
      merchant: '',
      fromDate: null,
      untilDate: null,
      minimumAmount: null,
      maximumAmount: null,
    });
  }
}
