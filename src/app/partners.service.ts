import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import type { ExpensePartner, ExpensePartnerInput } from './expense.types';

@Injectable({ providedIn: 'root' })
export class PartnersService {
  constructor(private readonly http: HttpClient) {}

  getPartners(): Observable<ExpensePartner[]> {
    return this.http
      .get<{ data: ExpensePartner[] }>(`${environment.apiBaseUrl}/expense-partners`, {
        params: {
          sort: 'name',
          'pagination[page]': 1,
          'pagination[pageSize]': 500,
        },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  getPartner(id: string): Observable<ExpensePartner> {
    return this.http
      .get<{ data: ExpensePartner }>(`${environment.apiBaseUrl}/expense-partners/${id}`, {
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  createPartner(partner: ExpensePartnerInput): Observable<ExpensePartner> {
    return this.http
      .post<{
        data: ExpensePartner;
      }>(`${environment.apiBaseUrl}/expense-partners`, { data: partner }, { withCredentials: true })
      .pipe(map(({ data }) => data));
  }

  updatePartner(id: string, partner: ExpensePartnerInput): Observable<ExpensePartner> {
    return this.http
      .put<{
        data: ExpensePartner;
      }>(
        `${environment.apiBaseUrl}/expense-partners/${id}`,
        { data: partner },
        { withCredentials: true },
      )
      .pipe(map(({ data }) => data));
  }
}
