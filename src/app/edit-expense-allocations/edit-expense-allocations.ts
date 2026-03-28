import { Component, Input, forwardRef } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'squirrelli-edit-expense-allocations',
  imports: [MatSliderModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditExpenseAllocations),
      multi: true,
    },
  ],
  templateUrl: './edit-expense-allocations.html',
})
export class EditExpenseAllocations implements ControlValueAccessor {
  @Input() amount?: number | null;

  readonly form = new FormGroup({
    gift: new FormControl<number | null>(null),
    reimbursement: new FormControl<number | null>(null),
  });

  private onChange: (value: { gift: number | null; reimbursement: number | null } | null) => void =
    () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.form.valueChanges.subscribe((value) => {
      const gift = this.toBase100(value.gift ?? null);
      const reimbursement = this.toBase100(value.reimbursement ?? null);
      this.onChange({ gift, reimbursement });
      this.onTouched();
    });
  }

  writeValue(value: { gift: number | null; reimbursement: number | null } | null): void {
    if (!value) {
      this.form.reset({ gift: null, reimbursement: null }, { emitEvent: false });
      return;
    }
    this.form.setValue(
      {
        gift: this.toBase12(value.gift ?? null),
        reimbursement: this.toBase12(value.reimbursement ?? null),
      },
      { emitEvent: false },
    );
  }

  registerOnChange(
    fn: (value: { gift: number | null; reimbursement: number | null } | null) => void,
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  private toBase12(value: number | null): number | null {
    if (value === null) {
      return null;
    }
    return Math.round(value * 12);
  }

  private toBase100(value: number | null): number | null {
    if (value === null) {
      return null;
    }
    return Math.round((value / 12) * 100) / 100;
  }

  get giftAmount(): number | undefined {
    return this.form.controls.gift.value && this.amount
      ? Math.round((this.form.controls.gift.value / 12) * this.amount * 100) / 100
      : undefined;
  }

  get reimbursementAmount(): number | undefined {
    return this.form.controls.reimbursement.value && this.amount
      ? Math.round((this.form.controls.reimbursement.value / 12) * this.amount * 100) / 100
      : undefined;
  }

  getAllocationPercentage(value: number): string {
    switch (value) {
      case 0:
        return '0 %';
      case 1:
        return '1/12';
      case 2:
        return '1/6';
      case 3:
        return '1/4';
      case 4:
        return '1/3';
      case 5:
        return '5/12';
      case 6:
        return '1/2';
      case 7:
        return '7/12';
      case 8:
        return '2/3';
      case 9:
        return '3/4';
      case 10:
        return '5/6';
      case 11:
        return '11/12';
      case 12:
        return '100 %';
    }
    const percentage = Math.round((value / 12) * 10000) / 100;
    return `${percentage} %`;
  }
}
