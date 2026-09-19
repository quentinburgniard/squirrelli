import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, distinctUntilChanged, map, switchMap } from 'rxjs';
import type { MerchantCategoryWithRelations } from '../merchant-category.types';
import { MerchantCategoriesService } from '../merchant-categories.service';
import { Empty } from '../empty/empty';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'squirrelli-category',
  imports: [
    Empty,
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './category.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class Category {
  protected readonly category$: Observable<MerchantCategoryWithRelations>;

  constructor(route: ActivatedRoute, categoriesService: MerchantCategoriesService) {
    this.category$ = route.paramMap.pipe(
      map((params) => params.get('id')),
      distinctUntilChanged(),
      switchMap((id) => {
        if (!id) {
          throw new Error('A category id is required.');
        }
        return categoriesService.getCategory(id);
      }),
    );
  }
}
