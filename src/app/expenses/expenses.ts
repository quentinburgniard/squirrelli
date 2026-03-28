import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { type Expense, ExpensesService } from '../expenses.service';
import { formatDate } from '../utils/date.utils';

@Component({
  selector: 'squirrelli-expenses',
  imports: [MatTableModule, NgxChartsModule, MatIconModule, MatCardModule],
  templateUrl: './expenses.html',
  host: { class: 'flex flex-col gap-4' },
})
export class Expenses {
  protected readonly expenses$: Observable<Expense[]>;
  protected readonly columns: string[] = ['date', 'merchant', 'amount'];
  protected readonly formatDate = formatDate;

  constructor(private readonly expensesService: ExpensesService) {
    this.expensesService.fromDate = null;
    this.expensesService.untilDate = null;
    this.expenses$ = this.expensesService.expenses$;
  }
}
