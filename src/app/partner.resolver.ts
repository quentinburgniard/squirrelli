import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import type { ExpensePartner } from './expense.types';
import { PartnersService } from './partners.service';

export const partnerResolver: ResolveFn<ExpensePartner | null> = (route) => {
  const id = route.paramMap.get('id');
  if (!id) {
    return of(null);
  }

  return inject(PartnersService).getPartner(id);
};
