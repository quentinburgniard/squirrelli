import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'penny-footer',
  imports: [MatToolbarModule],
  templateUrl: './footer.html',
})
export class Footer {
  @Input() version = '';
}
