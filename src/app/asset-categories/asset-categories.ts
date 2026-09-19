import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AssetsService } from '../assets.service';
import { Empty } from '../empty/empty';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'squirrelli-asset-categories',
  imports: [Empty, AsyncPipe, MatCardModule, TranslatePipe],
  templateUrl: './asset-categories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class AssetCategories {
  protected readonly categories$;

  constructor(assetsService: AssetsService) {
    this.categories$ = assetsService.getCategories();
  }
}
