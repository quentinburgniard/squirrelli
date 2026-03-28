import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import type { Modules } from '@strapi/types';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../environments/environment';

export type Configuration = Modules.EntityService.Result<'api::configuration.configuration'>;

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly settings = signal<Configuration | null>(null);

  constructor(private readonly http: HttpClient) {}

  fetchSettings(): Observable<Configuration> {
    return this.http
      .get<{ data: Configuration }>(`${environment.apiBaseUrl}/configurations/squirelli`, {
        withCredentials: true,
      })
      .pipe(
        map(({ data }) => data),
        tap((settings) => this.settings.set(settings)),
      );
  }
}
