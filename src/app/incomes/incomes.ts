import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import type { Income } from '../income.types';
import { FloatingActions, type FloatingActionNav } from '../floating-actions/floating-actions';
import { Empty } from '../empty/empty';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ImageUrl } from '../images';
import { IncomesService } from '../incomes.service';
import { formatDate } from '../utils/date.utils';

@Component({
  selector: 'squirrelli-incomes',
  imports: [
    Empty,
    AsyncPipe,
    CurrencyPipe,
    MatCardModule,
    RouterLink,
    FloatingActions,
    TranslatePipe,
  ],
  templateUrl: './incomes.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class Incomes {
  protected readonly imageUrl = ImageUrl.Incomes;
  private readonly translations: TranslateService;
  protected readonly actions: readonly FloatingActionNav[] = [
    { label: 'addIncome', icon: 'add', routerLink: '/incomes/edit' },
  ];
  protected readonly incomes$: Observable<Income[]>;

  protected formatIncomeDate(value: Income['date']): string {
    if (!value) return this.translations.instant('noDate');
    const formatted = formatDate(value as string | Date);
    const relativeDates = {
      Today: 'today',
      Yesterday: 'yesterday',
      Tomorrow: 'tomorrow',
    } as const;
    return formatted in relativeDates
      ? this.translations.instant(relativeDates[formatted as keyof typeof relativeDates])
      : formatted;
  }

  constructor(incomesService: IncomesService, translations: TranslateService) {
    this.translations = translations;
    this.incomes$ = incomesService.getIncomes();
  }
}
