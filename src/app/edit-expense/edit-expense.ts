import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, finalize, forkJoin, iif, map, shareReplay } from 'rxjs';
import { isString } from 'lodash-es';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { EditExpenseAllocations } from '../edit-expense-allocations/edit-expense-allocations';

const EURO_DATE_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'squirrelli-edit-expense',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatButtonModule,
    EditExpenseAllocations,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: EURO_DATE_FORMATS },
  ],
  templateUrl: './edit-expense.html',
})
export class EditExpense implements OnInit {
  currencies = ['eur', 'chf'] as const;
  merchants$: Observable<Array<{ target: 'merchant' | 'category'; id: number; name: string }>>;
  filteredMerchants$: Observable<any>;
  projects$: Observable<any>;
  loading = false;
  expenseId: number | null = null;

  protected readonly _form = new FormGroup({
    merchant: new FormControl<any | null>(null),
    amount: new FormControl<number | null>(null),
    date: new FormControl<Date | null>(null),
    currency: new FormControl<'eur' | 'chf' | null>('eur'),
    allocations: new FormControl({
      gift: null,
      reimbursement: null,
    }),
    project: new FormControl<any | null>(null),
  });

  get value() {
    const { date } = this._form.value;
    return {
      date: date?.toLocaleDateString('en-CA') ?? null,
      merchant:
        this._form.value.merchant?.target === 'merchant' ? this._form.value.merchant.id : null,
      category:
        this._form.value.merchant?.target === 'category' ? this._form.value.merchant.id : null,
      amount: this._form.value.amount,
      currency: this._form.value.currency,
      project: this._form.value.project?.id ?? null,
      giftRate: this._form.value.allocations?.gift ?? null,
      reimbursementRate: this._form.value.allocations?.reimbursement ?? null,
    };
  }

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly _router: Router,
  ) {
    this.merchants$ = forkJoin({
      merchants: this.http
        .get<{ data: any }>(`${environment.apiBaseUrl}/merchants`, {
          params: {
            sort: 'name',
            'pagination[page]': 1,
            'pagination[pageSize]': 500,
          },
          withCredentials: true,
        })
        .pipe(map(({ data }) => data)),
      categories: this.http
        .get<{
          data: any;
        }>(`${environment.apiBaseUrl}/merchant-categories`, {
          params: {
            sort: 'name',
            'pagination[page]': 1,
            'pagination[pageSize]': 500,
          },
          withCredentials: true,
        })
        .pipe(map(({ data }) => data)),
    }).pipe(
      map(({ merchants, categories }) => [
        ...merchants.map((merchant: any) => ({ target: 'merchant' as const, ...merchant })),
        ...categories.map((category: any) => ({ target: 'category' as const, ...category })),
      ]),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.projects$ = this.http
      .get<{ data: any }>(`${environment.apiBaseUrl}/expense-projects`, { withCredentials: true })
      .pipe(map(({ data }) => data));
    this.filteredMerchants$ = this.merchants$;
  }

  ngOnInit() {
    this.route.data.subscribe(({ expense }) => {
      if (!expense) {
        return;
      }

      this.expenseId = expense.id ?? null;
      const merchant =
        expense.merchant?.id != null
          ? { target: 'merchant' as const, ...expense.merchant }
          : expense.category?.id != null
            ? { target: 'category' as const, ...expense.category }
            : null;

      this._form.patchValue({
        merchant,
        amount: expense.amount ?? null,
        date: expense.date ? new Date(expense.date) : null,
        currency: expense.currency ?? this._form.controls.currency.value,
        allocations: {
          gift: expense.giftRate ?? null,
          reimbursement: expense.reimbursementRate ?? null,
        },
        project: expense.project ?? null,
      });
    });

    this._form.controls.merchant.valueChanges.subscribe((value) => {
      this.filteredMerchants$ = this.merchants$.pipe(
        map((merchants) =>
          merchants.filter((merchant) =>
            isString(value) ? merchant.name.toLowerCase().includes(value.toLowerCase()) : true,
          ),
        ),
      );
    });

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.resetForm();
      }
    });
  }

  getName(value: any): string {
    return value ? value.name : '';
  }

  private resetForm() {
    this.expenseId = null;
    this.filteredMerchants$ = this.merchants$;
    this._form.reset({
      date: this._form.controls.date.value,
      currency: this._form.controls.currency.value,
    });
  }

  onSubmit() {
    this.save$(this.expenseId ?? undefined).subscribe(() => {
      this.loading = false;
      this._router.navigate(['/expenses/edit'], { onSameUrlNavigation: 'reload' });
    });
  }

  save$(id?: number): Observable<any> {
    this.loading = true;
    return iif(
      () => id !== undefined,
      this.http.put(
        `${environment.apiBaseUrl}/expenses/${id}`,
        { data: this.value },
        {
          withCredentials: true,
        },
      ),
      this.http.post(
        `${environment.apiBaseUrl}/expenses`,
        { data: this.value },
        {
          withCredentials: true,
        },
      ),
    ).pipe(
      finalize(() => {
        this.loading = false;
      }),
    );
  }
}
