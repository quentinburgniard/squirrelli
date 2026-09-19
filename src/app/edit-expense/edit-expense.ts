import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  combineLatest,
  finalize,
  forkJoin,
  iif,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { createNameSearch } from '../utils/name-search';
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
import { TranslatePipe } from '@ngx-translate/core';
import type { ExpenseAllocationValue, RawExpense } from '../expense.types';

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
    TranslatePipe,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: EURO_DATE_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './edit-expense.html',
})
export class EditExpense implements OnInit {
  protected readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 599px)')
      .pipe(map(({ matches }) => matches)),
    { initialValue: false },
  );
  currencies = ['eur', 'chf'] as const;
  merchants$: Observable<Array<{ target: 'merchant' | 'category'; id: number; name: string }>>;
  filteredMerchants$: Observable<any>;
  projects$: Observable<any>;
  loading = false;
  expenseId: string | null = null;
  private originalAllocationIds = new Set<string>();

  protected readonly _form = new FormGroup({
    merchant: new FormControl<any | null>(null),
    amount: new FormControl<number | null>(null),
    date: new FormControl<Date | null>(null),
    currency: new FormControl<'eur' | 'chf' | null>('eur'),
    allocations: new FormControl<ExpenseAllocationValue[]>([], { nonNullable: true }),
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
    this.filteredMerchants$ = combineLatest([
      this.merchants$.pipe(
        map((merchants) => createNameSearch(merchants, (merchant) => merchant.name)),
      ),
      this._form.controls.merchant.valueChanges.pipe(startWith(this._form.controls.merchant.value)),
    ]).pipe(
      map(([searchMerchants, value]) => searchMerchants(typeof value === 'string' ? value : '')),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  ngOnInit() {
    this.route.data.subscribe(({ expense }) => {
      if (!expense) {
        return;
      }

      this.expenseId = expense.documentId ?? null;
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
        allocations: (expense.allocations ?? []).map((allocation: any) => ({
          documentId: allocation.documentId,
          type: this.getRelationDocumentId(allocation.type),
          partner: this.getRelationDocumentId(allocation.partner),
          countsAsPaid: allocation.countsAsPaid ?? null,
          amount: allocation.amount == null ? null : Number(allocation.amount),
          rate: allocation.rate == null ? null : Number(allocation.rate),
        })),
        project: expense.project ?? null,
      });
      this.originalAllocationIds = new Set(
        (expense.allocations ?? [])
          .map((allocation: any) => allocation.documentId)
          .filter((id: unknown): id is string => typeof id === 'string'),
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

  private getRelationDocumentId(
    relation: string | { documentId?: string; data?: { documentId?: string } | null } | null,
  ): string | null {
    if (typeof relation === 'string') return relation;
    return relation?.documentId ?? relation?.data?.documentId ?? null;
  }

  private resetForm() {
    this.expenseId = null;
    this.originalAllocationIds.clear();
    this._form.reset({
      date: this._form.controls.date.value,
      currency: this._form.controls.currency.value,
    });
  }

  onSubmit() {
    if (this._form.invalid || this.loading) {
      this._form.markAllAsTouched();
      return;
    }
    this.save$(this.expenseId ?? undefined).subscribe(() => {
      this.loading = false;
      this._router.navigate(['/expenses/edit'], { onSameUrlNavigation: 'reload' });
    });
  }

  save$(id?: string): Observable<any> {
    this.loading = true;
    const saveExpense$ = iif(
      () => id !== undefined,
      this.http.put<{ data: RawExpense }>(
        `${environment.apiBaseUrl}/expenses/${id}`,
        { data: this.value },
        {
          withCredentials: true,
        },
      ),
      this.http.post<{ data: RawExpense }>(
        `${environment.apiBaseUrl}/expenses`,
        { data: this.value },
        {
          withCredentials: true,
        },
      ),
    ).pipe(map(({ data }) => data));

    return saveExpense$.pipe(
      switchMap((expense) =>
        this.saveAllocations$(expense.documentId, this._form.controls.allocations.value),
      ),
      finalize(() => {
        this.loading = false;
      }),
    );
  }

  private saveAllocations$(
    expenseId: string,
    allocations: ExpenseAllocationValue[],
  ): Observable<unknown> {
    const currentIds = new Set(
      allocations
        .map(({ documentId }) => documentId)
        .filter((id): id is string => id !== undefined),
    );
    const requests: Observable<unknown>[] = allocations.map((allocation) => {
      const data = {
        expense: expenseId,
        type: allocation.type,
        partner: allocation.partner,
        countsAsPaid: allocation.countsAsPaid,
        amount: allocation.amount,
        rate: allocation.rate,
      };
      return allocation.documentId
        ? this.http.put(
            `${environment.apiBaseUrl}/expense-allocations/${allocation.documentId}`,
            { data },
            { withCredentials: true },
          )
        : this.http.post(
            `${environment.apiBaseUrl}/expense-allocations`,
            { data },
            { withCredentials: true },
          );
    });

    for (const allocationId of this.originalAllocationIds) {
      if (!currentIds.has(allocationId)) {
        requests.push(
          this.http.delete(`${environment.apiBaseUrl}/expense-allocations/${allocationId}`, {
            withCredentials: true,
          }),
        );
      }
    }

    return requests.length ? forkJoin(requests) : of([]);
  }
}
