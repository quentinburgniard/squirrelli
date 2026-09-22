import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import type { ExpenseFriend } from './expense.types';
import { FriendsService } from './friends.service';

export const friendResolver: ResolveFn<ExpenseFriend | null> = (route) => {
  const id = route.paramMap.get('id');
  if (!id) {
    return of(null);
  }

  return inject(FriendsService).getFriend(id);
};
