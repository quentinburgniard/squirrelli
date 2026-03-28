import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SettingsService, type Configuration } from './settings.service';

export const settingsResolver: ResolveFn<Configuration> = () => {
  const settingsService = inject(SettingsService);
  return settingsService.fetchSettings();
};
