import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../i18n/translate.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Menu } from '../menu/menu';

@Component({
  selector: 'squirrelli-header',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink, Menu, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './header.html',
})
export class Header {
  @Input() title = '';

  protected _menuOpen = signal(false);
}
