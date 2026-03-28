import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Modules } from '@strapi/types';
import dayjs, { Dayjs } from 'dayjs/esm';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map,
  shareReplay,
  switchMap,
} from 'rxjs';
import { environment } from '../environments/environment';
import { API_DATE_FORMAT } from './utils/date.utils';
import { DateValue } from '@strapi/types/dist/schema/attribute';

type RawExpense = Modules.EntityService.Result<
  'api::expense.expense',
  { populate: ['merchant', 'category'] }
>;
export type Expense = Omit<RawExpense, 'date'> & {
  date?: Dayjs;
};

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
    filter(
      (value): value is { fromDate: Dayjs; untilDate: Dayjs } =>
        value.fromDate !== null && value.untilDate !== null,
    ),
    switchMap(({ fromDate, untilDate }) =>
      this.http
        .get<{ data: RawExpense[] }>(`${environment.apiBaseUrl}/expenses`, {
          params: {
            sort: 'date',
            populate: ['merchant', 'category'],
            'filters[date][$gte]': this.getApiDateString(fromDate),
            'filters[date][$lte]': this.getApiDateString(untilDate),
          },
          withCredentials: true,
        })
        .pipe(map(({ data }) => data.map((expense) => this.getExpenseFromRawExpense(expense)))),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor(private readonly http: HttpClient) {}

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

  private getDateFromRawDate(value: DateValue | null | undefined): Dayjs | undefined {
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
