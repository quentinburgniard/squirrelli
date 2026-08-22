import { JsonPipe } from '@angular/common';
import { Component, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SettingsService } from '../settings.service';
import { Partners } from '../partners/partners';

type ConfigurationFormValue = {
  language: 'English' | 'Francais';
  baseCurrency: 'EUR' | 'CHF';
  monthlyResetDay: number | null;
  emergencyFund: number | null;
};

@Component({
  selector: 'squirrelli-settings',
  imports: [
    JsonPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    Partners,
  ],
  templateUrl: './settings.html',
  host: { class: 'block' },
})
export class Settings {
  protected readonly settings;
  protected readonly languages: ConfigurationFormValue['language'][] = ['English', 'Francais'];
  protected readonly currencies: ConfigurationFormValue['baseCurrency'][] = ['EUR', 'CHF'];
  protected readonly resetDays = Array.from({ length: 31 }, (_, index) => index + 1);
  protected readonly form: FormGroup<{
    configuration: FormGroup<{
      language: FormControl<ConfigurationFormValue['language']>;
      baseCurrency: FormControl<ConfigurationFormValue['baseCurrency']>;
      monthlyResetDay: FormControl<number | null>;
      emergencyFund: FormControl<number | null>;
    }>;
  }>;

  constructor(settingsService: SettingsService) {
    this.settings = settingsService.settings;
    const value = this.toFormValue(this.settings());
    this.form = new FormGroup({
      configuration: new FormGroup({
        language: new FormControl<ConfigurationFormValue['language']>(value.language, {
          nonNullable: true,
        }),
        baseCurrency: new FormControl<ConfigurationFormValue['baseCurrency']>(value.baseCurrency, {
          nonNullable: true,
        }),
        monthlyResetDay: new FormControl<number | null>(value.monthlyResetDay),
        emergencyFund: new FormControl<number | null>(value.emergencyFund),
      }),
    });

    effect(() => {
      const settings = this.settings();
      this.form.controls.configuration.patchValue(this.toFormValue(settings));
    });
  }

  private toFormValue(settings: ReturnType<SettingsService['settings']>): ConfigurationFormValue {
    const configuration: Record<string, unknown> =
      settings?.configuration !== null &&
      typeof settings?.configuration === 'object' &&
      !Array.isArray(settings?.configuration)
        ? (settings?.configuration as Record<string, unknown>)
        : {};
    const language = configuration['language'];
    const baseCurrency = configuration['baseCurrency'];
    const monthlyResetDay = configuration['monthlyResetDay'];
    const emergencyFund = configuration['emergencyFund'];

    return {
      language: language === 'Francais' ? 'Francais' : 'English',
      baseCurrency: baseCurrency === 'CHF' ? 'CHF' : 'EUR',
      monthlyResetDay: typeof monthlyResetDay === 'number' ? monthlyResetDay : null,
      emergencyFund: typeof emergencyFund === 'number' ? emergencyFund : null,
    };
  }
}
