import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Input,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BehaviorSubject, Observable, map, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import type { MerchantCategory } from '../merchant-category.types';
import { TranslatePipe } from '@ngx-translate/core';
import type {
  ExpenseAllocationType,
  ExpenseAllocationValue,
  ExpenseFriend,
} from '../expense.types';

type AllocationRow = FormGroup<{
  documentId: FormControl<string | null>;
  mode: FormControl<'quick' | 'advanced'>;
  valueMode: FormControl<'amount' | 'rate'>;
  type: FormControl<string | null>;
  friend: FormControl<string | null>;
  countsAsPaid: FormControl<boolean | null>;
  amount: FormControl<number | null>;
  rate: FormControl<number>;
}>;

@Component({
  selector: 'squirrelli-edit-expense-allocations',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditExpenseAllocations),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditExpenseAllocations),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './edit-expense-allocations.html',
})
export class EditExpenseAllocations implements ControlValueAccessor, Validator {
  @Input() amount?: number | null;

  readonly form = new FormGroup({ allocations: new FormArray<AllocationRow>([]) });
  readonly newTypeForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl<string | null>(null),
    friend: new FormControl<string | null>(null),
    countsAsPaid: new FormControl(true, { nonNullable: true }),
  });
  readonly friends$: Observable<ExpenseFriend[]>;
  readonly categories$: Observable<MerchantCategory[]>;
  readonly allocationTypes$: Observable<ExpenseAllocationType[]>;
  creatingTypeFor: number | null = null;
  savingType = false;

  private readonly reloadTypes = new BehaviorSubject<void>(undefined);
  private onChange: (value: ExpenseAllocationValue[]) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor(
    private readonly http: HttpClient,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.friends$ = this.getCollection<ExpenseFriend>('expense-partners');
    this.categories$ = this.getCollection<MerchantCategory>('merchant-categories');
    this.allocationTypes$ = this.reloadTypes.pipe(
      switchMap(() => this.getCollection<ExpenseAllocationType>('expense-allocation-types')),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.form.valueChanges.subscribe(({ allocations }) => {
      this.onChange((allocations ?? []).map((allocation) => this.toAllocationValue(allocation)));
      this.onTouched();
      this.onValidatorChange();
    });
  }

  writeValue(value: ExpenseAllocationValue[] | null): void {
    this.form.controls.allocations.clear({ emitEvent: false });
    for (const allocation of value ?? []) {
      this.form.controls.allocations.push(this.createRow(allocation), { emitEvent: false });
    }
    // writeValue can run after this component has already been checked (for example when
    // route data arrives). Make sure Angular renders the newly-created FormArray controls.
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: ExpenseAllocationValue[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    const invalid = this.form.controls.allocations.controls.some((row) => {
      const hasTarget =
        row.controls.mode.value === 'quick'
          ? row.controls.friend.value !== null && row.controls.countsAsPaid.value !== null
          : row.controls.type.value !== null;
      const hasValue =
        row.controls.valueMode.value === 'amount'
          ? (row.controls.amount.value ?? 0) > 0
          : row.controls.rate.value > 0;
      return !hasTarget || !hasValue;
    });
    return invalid ? { invalidAllocation: true } : null;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.form.disable({ emitEvent: false });
    else this.form.enable({ emitEvent: false });
  }

  addAllocation(): void {
    this.form.controls.allocations.push(this.createRow());
  }

  removeAllocation(index: number): void {
    this.form.controls.allocations.removeAt(index);
    if (this.creatingTypeFor === index) this.cancelCreateType();
  }

  startCreateType(index: number): void {
    this.creatingTypeFor = index;
    this.newTypeForm.reset({ name: '', category: null, friend: null, countsAsPaid: true });
  }

  cancelCreateType(): void {
    this.creatingTypeFor = null;
  }

  createType(): void {
    if (this.newTypeForm.invalid || this.creatingTypeFor === null || this.savingType) return;
    this.savingType = true;
    const value = this.newTypeForm.getRawValue();
    this.http
      .post<{ data: ExpenseAllocationType }>(
        `${environment.apiBaseUrl}/expense-allocation-types`,
        {
          data: {
            name: value.name.trim(),
            category: value.category,
            partner: value.friend,
            countsAsPaid: value.countsAsPaid,
          },
        },
        { withCredentials: true },
      )
      .subscribe({
        next: ({ data }) => {
          this.form.controls.allocations
            .at(this.creatingTypeFor!)
            .controls.type.setValue(data.documentId);
          this.savingType = false;
          this.creatingTypeFor = null;
          this.reloadTypes.next();
        },
        error: () => (this.savingType = false),
      });
  }

  setValueMode(row: AllocationRow, mode: 'amount' | 'rate'): void {
    row.controls.valueMode.setValue(mode, { emitEvent: false });
    if (mode === 'amount') row.controls.rate.setValue(0, { emitEvent: false });
    else row.controls.amount.setValue(null, { emitEvent: false });
    row.updateValueAndValidity();
  }

  getAllocatedAmount(row: AllocationRow): number {
    return row.controls.valueMode.value === 'amount'
      ? (row.controls.amount.value ?? 0)
      : Math.round((row.controls.rate.value / 12) * (this.amount ?? 0) * 100) / 100;
  }

  getAllocationPercentage(value: number): string {
    if (value === 0) return '0%';
    if (value === 12) return '100%';
    return `${Math.round((value / 12) * 10000) / 100}%`;
  }

  private createRow(value?: ExpenseAllocationValue): AllocationRow {
    return new FormGroup({
      documentId: new FormControl(value?.documentId ?? null),
      mode: new FormControl(value?.type ? 'advanced' : 'quick', { nonNullable: true }),
      valueMode: new FormControl(
        value?.amount !== null && value?.amount !== undefined ? 'amount' : 'rate',
        { nonNullable: true },
      ),
      type: new FormControl(value?.type ?? null),
      friend: new FormControl(value?.friend ?? null),
      countsAsPaid: new FormControl(value?.countsAsPaid ?? true),
      amount: new FormControl(value?.amount ?? null),
      rate: new FormControl(this.toSliderValue(value?.rate ?? 0), { nonNullable: true }),
    });
  }

  private toAllocationValue(
    allocation: Partial<{
      documentId: string | null;
      mode: 'quick' | 'advanced';
      valueMode: 'amount' | 'rate';
      type: string | null;
      friend: string | null;
      countsAsPaid: boolean | null;
      amount: number | null;
      rate: number;
    }>,
  ): ExpenseAllocationValue {
    const target =
      allocation.mode === 'advanced'
        ? { type: allocation.type!, friend: null, countsAsPaid: null }
        : {
            type: null,
            friend: allocation.friend!,
            countsAsPaid: allocation.countsAsPaid!,
          };
    const quantity =
      allocation.valueMode === 'amount'
        ? { amount: allocation.amount!, rate: null }
        : { amount: null, rate: this.toRate(allocation.rate ?? 0) };
    return {
      documentId: allocation.documentId ?? undefined,
      ...target,
      ...quantity,
    };
  }

  private getCollection<T>(endpoint: string): Observable<T[]> {
    return this.http
      .get<{ data: T[] }>(`${environment.apiBaseUrl}/${endpoint}`, {
        params: { sort: 'name', 'pagination[pageSize]': 500 },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }

  private toSliderValue(value: number): number {
    return Math.round(value * 12);
  }

  private toRate(value: number): number {
    return Math.round((value / 12) * 100) / 100;
  }
}
