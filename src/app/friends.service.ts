import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import type { ExpenseFriend, ExpenseFriendInput } from './expense.types';

@Injectable({ providedIn: 'root' })
export class FriendsService {
  constructor(private readonly http: HttpClient) {}

  getFriends(): Observable<ExpenseFriend[]> {
    return this.http
      .get<{ data: ExpenseFriend[] }>(`${environment.apiBaseUrl}/expense-partners`, {
        params: {
          sort: 'name',
          'pagination[page]': 1,
          'pagination[pageSize]': 500,
        },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  getFriend(id: string): Observable<ExpenseFriend> {
    return this.http
      .get<{ data: ExpenseFriend }>(`${environment.apiBaseUrl}/expense-partners/${id}`, {
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  createFriend(friend: ExpenseFriendInput): Observable<ExpenseFriend> {
    return this.http
      .post<{
        data: ExpenseFriend;
      }>(`${environment.apiBaseUrl}/expense-partners`, { data: friend }, { withCredentials: true })
      .pipe(map(({ data }) => data));
  }

  updateFriend(id: string, friend: ExpenseFriendInput): Observable<ExpenseFriend> {
    return this.http
      .put<{
        data: ExpenseFriend;
      }>(
        `${environment.apiBaseUrl}/expense-partners/${id}`,
        { data: friend },
        { withCredentials: true },
      )
      .pipe(map(({ data }) => data));
  }
}
