import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { startWith } from 'rxjs';
import { TranslatePipe } from '../i18n/translate.pipe';

export interface ExpenseFiltersValue {
  merchant: string;
  fromDate: Date | null;
  untilDate: Date | null;
  minimumAmount: number | null;
  maximumAmount: number | null;
}

export const EMPTY_EXPENSE_FILTERS: ExpenseFiltersValue = {
  merchant: '',
  fromDate: null,
  untilDate: null,
  minimumAmount: null,
  maximumAmount: null,
};

@Component({
  selector: 'squirrelli-expense-filters',
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './expense-filters.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ExpenseFilters {
  readonly filtersChange = output<ExpenseFiltersValue>();
  protected readonly open = signal(false);
  protected readonly activeFilterCount = signal(0);
  protected readonly form = new FormGroup({
    merchant: new FormControl('', { nonNullable: true }),
    fromDate: new FormControl<Date | null>(null),
    untilDate: new FormControl<Date | null>(null),
    minimumAmount: new FormControl<number | null>(null),
    maximumAmount: new FormControl<number | null>(null),
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    this.form.valueChanges
      .pipe(startWith(this.form.getRawValue()), takeUntilDestroyed(destroyRef))
      .subscribe(() => {
        const filters = this.form.getRawValue();
        this.activeFilterCount.set(
          Object.values(filters).filter((value) => value !== null && value !== '').length,
        );
        this.filtersChange.emit(filters);
      });
  }

  protected clear(): void {
    this.form.reset(EMPTY_EXPENSE_FILTERS);
  }
}
