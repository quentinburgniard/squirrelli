import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map, Observable } from 'rxjs';
import dayjs from 'dayjs/esm';
import type { Expense } from '../expense.types';
import { ExpensesService } from '../expenses.service';
import { Expense as ExpenseComponent } from '../expense/expense';

@Component({
  selector: 'squirrelli-home',
  imports: [MatCardModule, ExpenseComponent, AsyncPipe, CurrencyPipe],
  templateUrl: './home.html',
  host: { class: 'block' },
})
export class Home {
  protected readonly expenses$: Observable<Expense[]>;
  protected readonly total$: Observable<number>;
  protected readonly untilDateLabel$: Observable<string>;

  constructor(private readonly expensesService: ExpensesService) {
    this.expensesService.fromDate = dayjs().startOf('month');
    this.expensesService.untilDate = dayjs().endOf('month');
    this.expenses$ = this.expensesService.expenses$;
    this.total$ = this.expenses$.pipe(
      map((items) => items.reduce((total, item) => total + Number(item.amount ?? 0), 0)),
    );
    this.untilDateLabel$ = this.expensesService.untilDate$.pipe(
      map((untilDate) => (untilDate ? untilDate.format('D MMMM') : 'All dates')),
    );
  }
}
