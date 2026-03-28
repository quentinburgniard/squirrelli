import { JsonPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ExpensesSelectImportFile } from '../expenses-select-import-file/expenses-select-import-file';

@Component({
  selector: 'squirrelli-expenses-import',
  imports: [
    JsonPipe,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ExpensesSelectImportFile,
  ],
  templateUrl: './expenses-import.html',
  host: { class: 'flex flex-col gap-4' },
})
export class ExpensesImport {
  @ViewChild(MatStepper) private readonly stepper?: MatStepper;

  protected readonly isLinear = true;
  protected readonly firstFormGroup: FormGroup;
  protected readonly secondFormGroup: FormGroup;
  protected columnNames: string[] = [];
  protected fileName = '';

  constructor(private readonly formBuilder: FormBuilder) {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  protected onFileParsed(payload: { fileName: string; columnNames: string[] }): void {
    this.fileName = payload.fileName;
    this.columnNames = payload.columnNames;
    this.firstFormGroup.get('firstCtrl')?.setValue(this.fileName);
    if (this.columnNames.length > 0) {
      this.stepper?.next();
    }
  }
}
