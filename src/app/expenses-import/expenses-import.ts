import { JsonPipe } from '@angular/common';
import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ExpensesSelectImportFile } from '../expenses-select-import-file/expenses-select-import-file';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'squirrelli-expenses-import',
  imports: [
    JsonPipe,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ExpensesSelectImportFile,
    TranslatePipe,
  ],
  templateUrl: './expenses-import.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class ExpensesImport {
  @ViewChild(MatStepper) private readonly stepper?: MatStepper;

  protected readonly isLinear = true;
  protected readonly firstFormGroup = new FormGroup({
    firstCtrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  protected readonly secondFormGroup = new FormGroup({
    secondCtrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  protected columnNames: string[] = [];
  protected fileName = '';

  protected onFileParsed(payload: { fileName: string; columnNames: string[] }): void {
    this.fileName = payload.fileName;
    this.columnNames = payload.columnNames;
    this.firstFormGroup.get('firstCtrl')?.setValue(this.fileName);
    if (this.columnNames.length > 0) {
      this.stepper?.next();
    }
  }
}
