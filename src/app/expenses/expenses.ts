import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'squirrelli-expenses',
  imports: [MatTableModule, NgxChartsModule, MatIconModule, MatCardModule],
  templateUrl: './expenses.html',
  host: { class: 'flex flex-col gap-4' },
})
export class Expenses {
  protected readonly expenses$: Observable<any[]>;
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
