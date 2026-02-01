import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

@Component({
  selector: 'penny-expenses-select-import-file',
  imports: [MatButtonModule, MatSnackBarModule],
  templateUrl: './expenses-select-import-file.html',
})
export class ExpensesSelectImportFile {
  @ViewChild('fileInput') private readonly fileInput?: HTMLInputElement;
  @Output() readonly parsed = new EventEmitter<{
    fileName: string;
    columnNames: string[];
  }>();

  constructor(private readonly snackBar: MatSnackBar) {}

  protected onFileSelected(element: HTMLInputElement): void {
    const file = element.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const workbook = XLSX.read(reader.result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          this.showError('No sheet found in the file.');
          return;
        }
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          this.showError('Unable to read the first sheet.');
          return;
        }
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true }) as Array<
          Array<unknown>
        >;
        const headers = rows[0] ?? [];
        const columnNames = headers
          .map((value) => `${value ?? ''}`.trim())
          .filter((value) => value.length > 0);

        if (columnNames.length === 0) {
          this.showError('No header row detected.');
          return;
        }

        this.parsed.emit({ fileName: file.name, columnNames });
      } catch (error) {
        this.showError('Failed to parse the file.');
      }
    };
    reader.onerror = () => this.showError('Failed to read the file.');
    reader.readAsArrayBuffer(file);
    element.value = '';
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
