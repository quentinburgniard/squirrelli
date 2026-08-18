import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import type { Asset } from '../asset.types';
import { AssetsService } from '../assets.service';

@Component({
  selector: 'squirrelli-assets',
  imports: [MatButtonModule, MatCardModule, MatTableModule, RouterLink],
  templateUrl: './assets.html',
  host: { class: 'flex flex-col gap-4' },
})
export class Assets {
  protected readonly columns = ['name', 'category', 'liquidity', 'actions'];
  protected readonly assets$: Observable<Asset[]>;

  constructor(assetsService: AssetsService) {
    this.assets$ = assetsService.getAssets();
  }
}
