import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SolarAltArrowDownBold } from '@solar-icons/angular';
import { TranslatePipe } from '../i18n/translate.pipe';
import type { TranslationKey } from '../i18n/translations';

export interface SubmenuItem {
  label: TranslationKey;
  routerLink?: string;
  exact?: boolean;
}

@Component({
  selector: 'squirrelli-submenu',
  imports: [RouterLink, RouterLinkActive, SolarAltArrowDownBold, TranslatePipe],
  templateUrl: './submenu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Submenu {
  readonly label = input.required<TranslationKey>();
  readonly items = input.required<readonly SubmenuItem[]>();
  readonly open = input(false);
  readonly toggled = output<void>();
  readonly selected = output<void>();
}
