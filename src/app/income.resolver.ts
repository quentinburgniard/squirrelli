import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import type { Income } from './income.types';
import { IncomesService } from './incomes.service';

export const incomeResolver: ResolveFn<Income | null> = (route) => {
  const id = route.paramMap.get('id');
  if (!id) {
    return of(null);
  }

  return inject(IncomesService).getIncome(id);
};
