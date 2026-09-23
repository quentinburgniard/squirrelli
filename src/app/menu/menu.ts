import { Component, Input, output, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  SolarBanknote2BoldDuotone,
  SolarBillListBoldDuotone,
  SolarSettingsBoldDuotone,
  SolarWalletMoneyBoldDuotone,
  SolarWidget5BoldDuotone,
} from '@solar-icons/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { Submenu, type SubmenuItem } from '../submenu/submenu';

@Component({
  selector: 'nutio-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    SolarBanknote2BoldDuotone,
    SolarBillListBoldDuotone,
    SolarSettingsBoldDuotone,
    SolarWalletMoneyBoldDuotone,
    SolarWidget5BoldDuotone,
    Submenu,
    TranslatePipe,
  ],
  templateUrl: './menu.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .menu-panel {
      top: var(--mat-toolbar-standard-height, 64px);
      background: color-mix(in srgb, var(--mat-sys-scrim) 38%, transparent);
      backdrop-filter: blur(14px) saturate(115%);
      -webkit-backdrop-filter: blur(14px) saturate(115%);
    }

    @media (max-width: 599px) {
      .menu-panel {
        top: var(--mat-toolbar-mobile-height, 56px);
      }
    }

    .menu-panel nav {
      animation: menu-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .menu-panel.menu-leave nav {
      animation: menu-out 150ms ease-in;
    }

    @keyframes menu-in {
      from {
        transform: translateY(-12px) scale(0.98);
        opacity: 0;
      }
    }

    @keyframes menu-out {
      to {
        transform: translateY(-8px) scale(0.98);
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .menu-panel nav,
      .menu-panel.menu-leave nav {
        animation: none;
      }
    }
  `,
})
export class Menu {
  @Input() open = false;
  readonly closed = output<void>();
  protected readonly openSubmenu = signal<'expenses' | 'incomes' | 'assets' | null>(null);
  protected readonly expenseItems: readonly SubmenuItem[] = [
    { label: 'allExpenses', routerLink: '/expenses', exact: true },
    { label: 'merchantsAndCategories', routerLink: '/expenses/categories' },
    { label: 'friends', routerLink: '/expenses/friends' },
    { label: 'projects', routerLink: '/expenses/projects' },
  ];
  protected readonly incomeItems: readonly SubmenuItem[] = [
    { label: 'allIncomes', routerLink: '/incomes', exact: true },
    { label: 'sourcesAndCategories', routerLink: '/incomes/sources' },
  ];
  protected readonly assetItems: readonly SubmenuItem[] = [
    { label: 'allAssets', routerLink: '/assets', exact: true },
    { label: 'categories', routerLink: '/assets/categories' },
    { label: 'projects' },
  ];

  protected toggleSubmenu(submenu: 'expenses' | 'incomes' | 'assets'): void {
    this.openSubmenu.update((open) => (open === submenu ? null : submenu));
  }
}
