import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import type { MerchantCategory, MerchantCategoryWithRelations } from './merchant-category.types';

@Injectable({ providedIn: 'root' })
export class MerchantCategoriesService {
  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<MerchantCategory[]> {
    return this.http
      .get<{ data: MerchantCategory[] }>(`${environment.apiBaseUrl}/merchant-categories`, {
        params: {
          sort: 'name',
          'pagination[pageSize]': 500,
        },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  getCategory(id: string): Observable<MerchantCategoryWithRelations> {
    return this.http
      .get<{ data: MerchantCategoryWithRelations }>(
        `${environment.apiBaseUrl}/merchant-categories/${id}`,
        {
          params: {
            'populate[children]': 'true',
            'populate[parent]': 'true',
          },
          withCredentials: true,
        },
      )
      .pipe(map(({ data }) => data));
  }
}
