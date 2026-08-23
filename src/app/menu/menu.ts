import { Component, Input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'squirrelli-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styles: `
    .menu-panel {
      animation: menu-in 180ms ease-out;
    }

    .menu-panel.menu-leave {
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
