import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import dayjs from 'dayjs/esm';
import { finalize } from 'rxjs';
import type { Income } from '../income.types';
import { IncomesService } from '../incomes.service';
import { TranslatePipe } from '../i18n/translate.pipe';
import { API_DATE_FORMAT } from '../utils/date.utils';

@Component({
  selector: 'squirrelli-edit-income',
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-income.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class EditIncome implements OnInit {
  protected readonly currencies = ['eur', 'chf'] as const;
  protected readonly form = new FormGroup({
    date: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    currency: new FormControl<'eur' | 'chf'>('eur', { nonNullable: true }),
  });
  protected incomeId: string | null = null;
  protected loading = false;

  constructor(
    private readonly incomesService: IncomesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.incomeId = this.route.snapshot.paramMap.get('id');
    const income = this.route.snapshot.data['income'] as Income | undefined;
    if (income) {
      this.form.setValue({
        date: income.date ? new Date(income.date) : null,
        amount: income.amount ?? null,
        currency: income.currency === 'chf' ? 'chf' : 'eur',
      });
    }
  }

  protected onSubmit(): void {
    const value = this.form.getRawValue();
    if (this.form.invalid || !value.date || value.amount === null || this.loading) {
      return;
    }

    const income = {
      date: dayjs(value.date).format(API_DATE_FORMAT),
      amount: value.amount,
      currency: value.currency,
    };
    this.loading = true;
    const request = this.incomeId
      ? this.incomesService.updateIncome(this.incomeId, income)
      : this.incomesService.createIncome(income);

    request
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => this.router.navigate(['/incomes']));
  }
}
