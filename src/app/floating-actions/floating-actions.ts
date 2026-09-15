import { Component, input, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../i18n/translate.pipe';
import type { TranslationKey } from '../i18n/translations';

export interface FloatingActionNav {
  label: TranslationKey;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'squirrelli-floating-actions',
  imports: [MatIconModule, RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './floating-actions.html',
})
export class FloatingActions {
  readonly nav = input.required<readonly FloatingActionNav[]>();
  protected readonly open = signal(false);
}
