import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import type { Income } from '../income.types';
import { IncomesService } from '../incomes.service';
import { formatDate } from '../utils/date.utils';

@Component({
  selector: 'squirrelli-incomes',
  imports: [MatButtonModule, MatCardModule, MatTableModule, RouterLink],
  templateUrl: './incomes.html',
  host: { class: 'flex flex-col gap-4' },
})
export class Incomes {
  protected readonly columns = ['date', 'amount', 'actions'];
  protected readonly incomes$: Observable<Income[]>;
  protected readonly formatDate = formatDate;

  constructor(incomesService: IncomesService) {
    this.incomes$ = incomesService.getIncomes();
  }
}
