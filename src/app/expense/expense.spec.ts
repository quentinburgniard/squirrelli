import { signal } from '@angular/core';
import { SettingsService } from '../settings.service';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import dayjs from 'dayjs/esm';
import type { Expense as ExpenseModel } from '../expense.types';
import { Expense } from './expense';

describe('Expense', () => {
  it('links to the expense document and updates the badge when its input changes', async () => {
    await TestBed.configureTestingModule({
      imports: [Expense],
      providers: [provideRouter([]), { provide: SettingsService, useValue: { settings: signal(null) } }],
    }).compileComponents();
    const fixture = TestBed.createComponent(Expense);
    fixture.componentRef.setInput('expense', {
      documentId: 'expense-one',
      merchant: { name: 'Dribbble' },
      amount: 12,
      consolidatedPaidAmount: 10,
      currency: 'eur',
      date: dayjs('2026-02-07'),
    } as ExpenseModel);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/expenses/edit/expense-one');
    expect(element.querySelector('.expense-badge')?.textContent?.trim()).toBe('D');
    expect(element.querySelector('.expense-amount')?.textContent).toContain('10.00 €');
    expect(element.querySelector('.expense-original-amount')?.textContent).toContain('12.00 €');

    fixture.componentRef.setInput('expense', {
      documentId: 'expense-two',
      merchant: { name: ' ' },
      category: { name: 'Groceries' },
      amount: 25,
      consolidatedPaidAmount: 0,
      currency: 'chf',
    } as ExpenseModel);
    fixture.detectChanges();
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/expenses/edit/expense-two');
    expect(element.querySelector('.expense-name')?.textContent).toBe('Groceries');
    expect(element.querySelector('.expense-badge')?.textContent?.trim()).toBe('G');
    expect(element.querySelector('.expense-amount')?.textContent).toContain('0.00 €');
    expect(element.querySelector('.expense-original-amount')?.textContent).toContain('CHF');
    expect(element.querySelector('.expense-date')?.textContent).toBe('No date');
    expect(element.querySelector('.expense-pending')).toBeNull();

    fixture.componentRef.setInput('expense', {
      documentId: 'expense-pending',
      amount: 25,
      currency: 'chf',
    } as ExpenseModel);
    fixture.detectChanges();
    const pending = element.querySelector<HTMLButtonElement>('.expense-pending')!;
    expect(pending.textContent).toContain('schedule');
    expect(pending.closest('a')).toBeNull();
    pending.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.querySelector('mat-tooltip-component')?.textContent).toContain(
      'The consolidated amount will be available soon',
    );
  });
});
