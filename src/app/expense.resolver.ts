import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import type { Expense } from './expense.types';
import { ExpensesService } from './expenses.service';

export const expenseResolver: ResolveFn<Expense | null> = (route) => {
  const id = route.paramMap.get('id');
  if (!id) {
    return of(null);
  }

  return inject(ExpensesService).getExpense(id);
};
