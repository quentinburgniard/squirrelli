import { AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import type { Asset, AssetCategory, AssetInput } from '../asset.types';
import { AssetsService } from '../assets.service';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'squirrelli-edit-asset',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './edit-asset.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class EditAsset implements OnInit {
  protected readonly liquidities = ['low', 'medium', 'high'] as const;
  protected readonly categories$: Observable<AssetCategory[]>;
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    liquidity: new FormControl<'low' | 'medium' | 'high'>('medium', { nonNullable: true }),
    category: new FormControl<string | null>(null),
  });
  protected assetId: string | null = null;
  protected loading = false;

  constructor(
    private readonly assetsService: AssetsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.categories$ = assetsService.getCategories();
  }

  ngOnInit(): void {
    this.assetId = this.route.snapshot.paramMap.get('id');
    const asset = this.route.snapshot.data['asset'] as Asset | undefined;
    if (asset) {
      this.form.setValue({
        name: asset.name ?? '',
        liquidity:
          asset.liquidity === 'low' || asset.liquidity === 'high' ? asset.liquidity : 'medium',
        category: asset.category?.documentId ?? null,
      });
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    const value = this.form.getRawValue();
    const asset: AssetInput = { ...value, name: value.name.trim() };
    this.loading = true;
    const request = this.assetId
      ? this.assetsService.updateAsset(this.assetId, asset)
      : this.assetsService.createAsset(asset);

    request
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => this.router.navigate(['/assets']));
  }
}
