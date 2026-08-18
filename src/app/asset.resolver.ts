import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import type { Asset } from './asset.types';
import { AssetsService } from './assets.service';

export const assetResolver: ResolveFn<Asset | null> = (route) => {
  const id = route.paramMap.get('id');
  if (!id) {
    return of(null);
  }

  return inject(AssetsService).getAsset(id);
};
