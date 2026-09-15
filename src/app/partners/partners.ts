import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import type { ExpensePartner } from '../expense.types';
import { PartnersService } from '../partners.service';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'squirrelli-partners',
  imports: [MatButtonModule, MatCardModule, MatTableModule, RouterLink, TranslatePipe],
  templateUrl: './partners.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class Partners {
  protected readonly columns = ['name', 'email', 'actions'];
  protected readonly partners$: Observable<ExpensePartner[]>;

  constructor(partnersService: PartnersService) {
    this.partners$ = partnersService.getPartners();
  }
}
