import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Empty } from '../empty/empty';
import { TranslatePipe } from '@ngx-translate/core';

interface IncomeSource {
  documentId: string;
  name: string;
}

@Component({
  selector: 'squirrelli-income-sources',
  imports: [Empty, AsyncPipe, MatCardModule, TranslatePipe],
  templateUrl: './income-sources.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class IncomeSources {
  protected readonly sources$;

  constructor(http: HttpClient) {
    this.sources$ = http
      .get<{ data: IncomeSource[] }>(`${environment.apiBaseUrl}/income-sources`, {
        params: { sort: 'name:asc', 'pagination[pageSize]': 500 },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }
}
