import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, forkJoin, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ExpenseFriend } from '../expense.types';

interface CurrentUser {
  username: string;
}

export interface FriendSharingData {
  friend: ExpenseFriend;
  currentUser: CurrentUser;
}

export const friendSharingResolver: ResolveFn<FriendSharingData> = (route) => {
  const friendId = route.paramMap.get('id');
  const http = new HttpClient(inject(HttpBackend));

  if (!friendId) {
    return throwNotFound();
  }

  return forkJoin({
    friend: http
      .get<{ data: ExpenseFriend }>(`${environment.apiBaseUrl}/expense-partners/${friendId}`, {
        withCredentials: true,
      })
      .pipe(map(({ data }) => data)),
    currentUser: http.get<CurrentUser>(`${environment.apiBaseUrl}/users/me`, {
      withCredentials: true,
    }),
  }).pipe(
    map((sharing) => {
      if (!sharing.friend || !sharing.currentUser.username.trim()) {
        throw new Error('Incomplete sharing data.');
      }
      return sharing;
    }),
    catchError((error: unknown) => throwNotFound(error)),
  );
};

function throwNotFound(error?: unknown) {
  return throwError(
    () =>
      new HttpErrorResponse({
        error,
        status: 404,
        statusText: 'Not Found',
      }),
  );
}
