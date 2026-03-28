import { Component, DestroyRef, Input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Menu } from '../menu/menu';

@Component({
  selector: 'squirrelli-header',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink, Menu],
  templateUrl: './header.html',
})
export class Header {
  @Input() title = '';

  protected _menuOpen = signal(false);

  constructor(
    private route: ActivatedRoute,
    destroyRef: DestroyRef,
  ) {
    this.route.fragment
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((fragment) => this._menuOpen.set(fragment === 'menu'));
  }
}
