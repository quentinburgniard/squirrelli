import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Schema } from '@strapi/types';
import dayjs, { Dayjs } from 'dayjs/esm';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  forkJoin,
  map,
  shareReplay,
  switchMap,
} from 'rxjs';
import { environment } from '../environments/environment';
import type { Expense, RawExpense, RawExpenseAllocation } from './expense.types';
import { API_DATE_FORMAT } from './utils/date.utils';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private readonly fromDateSubject = new BehaviorSubject<Dayjs | null>(null);
  private readonly untilDateSubject = new BehaviorSubject<Dayjs | null>(null);

  readonly fromDate$ = this.fromDateSubject.asObservable();
  readonly untilDate$ = this.untilDateSubject.asObservable();
  readonly expenses$ = combineLatest({
    fromDate: this.fromDate$,
    untilDate: this.untilDate$,
  }).pipe(
    switchMap(({ fromDate, untilDate }) =>
      this.http
        .get<{ data: RawExpense[] }>(`${environment.apiBaseUrl}/expenses`, {
          params: {
            sort: 'date',
            populate: ['merchant', 'category'],
            'pagination[pageSize]': 500,
            ...(fromDate ? { 'filters[date][$gte]': this.getApiDateString(fromDate) } : {}),
            ...(untilDate ? { 'filters[date][$lte]': this.getApiDateString(untilDate) } : {}),
          },
          withCredentials: true,
        })
        .pipe(map(({ data }) => data.map((expense) => this.getExpenseFromRawExpense(expense)))),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor(private readonly http: HttpClient) {}

  getExpense(id: string): Observable<Expense> {
    return forkJoin({
      expense: this.http.get<{ data: RawExpense }>(`${environment.apiBaseUrl}/expenses/${id}`, {
        params: {
          'populate[merchant]': 'true',
          'populate[category]': 'true',
          'populate[project]': 'true',
        },
        withCredentials: true,
      }),
      allocations: this.http.get<{ data: RawExpenseAllocation[] }>(
        `${environment.apiBaseUrl}/expense-allocations`,
        {
          params: {
            'filters[expense][documentId][$eq]': id,
            'populate[type]': 'true',
            'populate[partner]': 'true',
            'pagination[pageSize]': 500,
          },
          withCredentials: true,
        },
      ),
    }).pipe(
      map(({ expense, allocations }) =>
        this.getExpenseFromRawExpense({ ...expense.data, allocations: allocations.data }),
      ),
    );
  }

  set fromDate(fromDate: Dayjs | null) {
    this.fromDateSubject.next(fromDate);
  }

  set untilDate(untilDate: Dayjs | null) {
    this.untilDateSubject.next(untilDate);
  }

  get fromDate(): Dayjs | null {
    return this.fromDateSubject.value;
  }

  get untilDate(): Dayjs | null {
    return this.untilDateSubject.value;
  }

  getExpensesBetweenDates(fromDate: Dayjs, untilDate: Dayjs): Observable<Expense[]> {
    return combineLatest({
      expenses: this.expenses$,
      storedFromDate: this.fromDate$,
      storedUntilDate: this.untilDate$,
    }).pipe(
      map(({ expenses, storedFromDate, storedUntilDate }) => {
        if (
          untilDate.isBefore(fromDate, 'day') ||
          storedFromDate === null ||
          storedUntilDate === null ||
          fromDate.isBefore(storedFromDate, 'day') ||
          untilDate.isAfter(storedUntilDate, 'day')
        ) {
          throw new Error('Invalid date range.');
        }

        return expenses.filter((expense) => {
          return (
            !expense.date?.isBefore(fromDate, 'day') && !expense.date?.isAfter(untilDate, 'day')
          );
        });
      }),
    );
  }

  private getApiDateString(value: Dayjs): string {
    return value.format(API_DATE_FORMAT);
  }

  private getDateFromRawDate(
    value: Schema.Attribute.DateValue | null | undefined,
  ): Dayjs | undefined {
    if (!value) {
      return undefined;
    }
    const date = dayjs(value);
    return date.isValid() ? date : undefined;
  }

  private getExpenseFromRawExpense(expense: RawExpense): Expense {
    const date = this.getDateFromRawDate(expense.date);
    return { ...expense, date };
  }
}
