import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../i18n/translate.pipe';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SolarCloseLinear, SolarHamburgerMenuLinear } from '@solar-icons/angular';
import { Menu } from '../menu/menu';

@Component({
  selector: 'squirrelli-header',
  imports: [
    MatToolbarModule,
    Menu,
    RouterLink,
    SolarCloseLinear,
    SolarHamburgerMenuLinear,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './header.html',
})
export class Header {
  @Input() title = '';

  protected _menuOpen = signal(false);
}
