import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'squirrelli-home',
  imports: [MatCardModule, MatTableModule, AsyncPipe, CurrencyPipe],
  templateUrl: './home.html',
  host: { class: 'block' },
})
export class Home {
  protected readonly expenses$: Observable<any[]>;
  protected readonly total$: Observable<number>;
  protected readonly columns: string[] = ['date', 'merchant', 'amount'];

  constructor(private readonly http: HttpClient) {
    this.expenses$ = this.http
      .get<{
        data: any;
      }>(`${environment.apiBaseUrl}/expenses`, {
        params: {
          sort: 'date:desc',
          populate: ['merchant', 'category'],
        },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));

    this.total$ = this.expenses$.pipe(
      map((items) => items.reduce((total, item) => total + Number(item.amount ?? 0), 0)),
    );
  }

  protected formatDate(value: string | Date): string {
    const date = dayjs(value);
    if (!date.isValid()) {
      return '';
    }

    const today = dayjs();
    if (date.isSame(today, 'day')) {
      return 'Today';
    }
    if (date.isSame(today.subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    }
    if (date.isSame(today.add(1, 'day'), 'day')) {
      return 'Tomorrow';
    }

    if (date.year() !== today.year()) {
      return date.format('MMM D, YYYY');
    }

    return date.format('MMMM D');
  }
}
