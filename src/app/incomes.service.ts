import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import type { Income, IncomeInput } from './income.types';

@Injectable({ providedIn: 'root' })
export class IncomesService {
  constructor(private readonly http: HttpClient) {}

  getIncomes(): Observable<Income[]> {
    return this.http
      .get<{ data: Income[] }>(`${environment.apiBaseUrl}/incomes`, {
        params: { sort: 'date:desc', 'pagination[page]': 1, 'pagination[pageSize]': 500 },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  getIncome(id: string): Observable<Income> {
    return this.http
      .get<{ data: Income }>(`${environment.apiBaseUrl}/incomes/${id}`, {
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  createIncome(income: IncomeInput): Observable<Income> {
    return this.http
      .post<{
        data: Income;
      }>(`${environment.apiBaseUrl}/incomes`, { data: income }, { withCredentials: true })
      .pipe(map(({ data }) => data));
  }

  updateIncome(id: string, income: IncomeInput): Observable<Income> {
    return this.http
      .put<{
        data: Income;
      }>(`${environment.apiBaseUrl}/incomes/${id}`, { data: income }, { withCredentials: true })
      .pipe(map(({ data }) => data));
  }
}
