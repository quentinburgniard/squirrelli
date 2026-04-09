import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SettingsService } from '../settings.service';
import { VERSION } from '../version';

@Component({
  selector: 'squirrelli-footer',
  imports: [MatToolbarModule],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly version = VERSION;

  protected readonly apiVersion: SettingsService['apiVersion'];

  constructor(settingsService: SettingsService) {
    this.apiVersion = settingsService.apiVersion;
  }
}
