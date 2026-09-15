import { Component, Input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'squirrelli-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styles: `
    .menu-panel {
      top: var(--mat-toolbar-standard-height, 64px);
    }

    @media (max-width: 599px) {
      .menu-panel {
        top: var(--mat-toolbar-mobile-height, 56px);
      }
    }

    .menu-panel nav {
      animation: menu-in 180ms ease-out;
    }

    .menu-panel.menu-leave nav {
      animation: menu-out 150ms ease-in;
    }

    @keyframes menu-in {
      from {
        transform: translateX(32px);
        opacity: 0;
      }
    }

    @keyframes menu-out {
      to {
        transform: translateX(32px);
        opacity: 0;
      }
    }
  `,
})
export class Menu {
  @Input() open = false;
  readonly closed = output<void>();
}
