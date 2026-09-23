import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SolarCloseLinear, SolarHamburgerMenuLinear } from '@solar-icons/angular';
import { Menu } from '../menu/menu';
import { ImageUrl } from '../images';

@Component({
  selector: 'nutio-header',
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
  protected readonly logoUrl = ImageUrl.Logo;
  @Input() title = '';

  protected _menuOpen = signal(false);
}
