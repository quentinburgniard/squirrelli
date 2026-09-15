import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import type { Asset } from '../asset.types';
import { AssetsService } from '../assets.service';
import { FloatingActions, type FloatingActionNav } from '../floating-actions/floating-actions';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'squirrelli-assets',
  imports: [AsyncPipe, MatCardModule, RouterLink, FloatingActions, TranslatePipe],
  templateUrl: './assets.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class Assets {
  protected readonly actions: readonly FloatingActionNav[] = [
    { label: 'addAsset', icon: 'add', routerLink: '/assets/edit' },
  ];
  protected readonly assets$: Observable<Asset[]>;

  constructor(assetsService: AssetsService) {
    this.assets$ = assetsService.getAssets();
  }
}
