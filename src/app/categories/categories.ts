import { AsyncPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import type { MerchantCategory } from '../merchant-category.types';
import { MerchantCategoriesService } from '../merchant-categories.service';
import { Empty } from '../empty/empty';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'nutio-categories',
  imports: [Empty, AsyncPipe, MatCardModule, MatIconModule, RouterLink, TranslatePipe],
  templateUrl: './categories.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class Categories {
  protected readonly categories$: Observable<MerchantCategory[]>;

  constructor(categoriesService: MerchantCategoriesService) {
    this.categories$ = categoriesService.getCategories();
  }
}
