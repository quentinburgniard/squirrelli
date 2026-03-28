import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { JsonPipe } from '@angular/common';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'squirrelli-settings',
  imports: [MatCardModule, JsonPipe],
  templateUrl: './settings.html',
  host: { class: 'block' },
})
export class Settings {
  protected readonly settings;

  constructor(settingsService: SettingsService) {
    this.settings = settingsService.settings;
  }
}
