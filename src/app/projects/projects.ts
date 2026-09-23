import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Empty } from '../empty/empty';
import { TranslatePipe } from '@ngx-translate/core';

interface ExpenseProject {
  documentId: string;
  name: string;
}

@Component({
  selector: 'nutio-projects',
  imports: [Empty, AsyncPipe, MatCardModule, TranslatePipe],
  templateUrl: './projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class Projects {
  protected readonly projects$;

  constructor(http: HttpClient) {
    this.projects$ = http
      .get<{ data: ExpenseProject[] }>(`${environment.apiBaseUrl}/expense-projects`, {
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }
}
