import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import type { Asset, AssetCategory, AssetInput } from './asset.types';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  constructor(private readonly http: HttpClient) {}

  getAssets(): Observable<Asset[]> {
    return this.http
      .get<{ data: Asset[] }>(`${environment.apiBaseUrl}/assets`, {
        params: {
          sort: 'name',
          populate: 'category',
          'pagination[page]': 1,
          'pagination[pageSize]': 500,
        },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  getAsset(id: string): Observable<Asset> {
    return this.http
      .get<{ data: Asset }>(`${environment.apiBaseUrl}/assets/${id}`, {
        params: { populate: 'category' },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  getCategories(): Observable<AssetCategory[]> {
    return this.http
      .get<{ data: AssetCategory[] }>(`${environment.apiBaseUrl}/asset-categories`, {
        params: { sort: 'name', 'pagination[page]': 1, 'pagination[pageSize]': 500 },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  createAsset(asset: AssetInput): Observable<Asset> {
    return this.http
      .post<{
        data: Asset;
      }>(`${environment.apiBaseUrl}/assets`, { data: asset }, { withCredentials: true })
      .pipe(map(({ data }) => data));
  }

  updateAsset(id: string, asset: AssetInput): Observable<Asset> {
    return this.http
      .put<{
        data: Asset;
      }>(`${environment.apiBaseUrl}/assets/${id}`, { data: asset }, { withCredentials: true })
      .pipe(map(({ data }) => data));
  }
}
