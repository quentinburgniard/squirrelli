import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'penny-header',
  imports: [MatToolbarModule, RouterLink],
  templateUrl: './header.html',
})
export class Header {
  @Input() title = '';
}
