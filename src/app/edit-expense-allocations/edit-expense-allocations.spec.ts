import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { EditExpenseAllocations } from './edit-expense-allocations';

describe('EditExpenseAllocations', () => {
  let component: EditExpenseAllocations;
  let fixture: ComponentFixture<EditExpenseAllocations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExpenseAllocations],
      providers: [provideTranslateService({ lang: 'en' })],
    }).compileComponents();

    fixture = TestBed.createComponent(EditExpenseAllocations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
