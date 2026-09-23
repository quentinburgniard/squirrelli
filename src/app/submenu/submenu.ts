import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SolarAltArrowDownBold } from '@solar-icons/angular';
import { TranslatePipe } from '@ngx-translate/core';
import type { TranslationKey } from '../utils/translation.utils';

export interface SubmenuItem {
  label: TranslationKey;
  routerLink?: string;
  exact?: boolean;
}

@Component({
  selector: 'nutio-submenu',
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
