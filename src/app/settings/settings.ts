import { JsonPipe } from '@angular/common';
import { Component, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../settings.service';
import { TranslatePipe } from '../i18n/translate.pipe';
import { ImageUrl } from '../images';
import { TranslationService } from '../i18n/translation.service';

type ConfigurationFormValue = {
  language: 'English' | 'Francais' | 'Portuguese';
  baseCurrency: 'EUR' | 'CHF';
  monthlyResetDay: number | null;
  emergencyFund: number | null;
};

@Component({
  selector: 'squirrelli-settings',
  imports: [
    JsonPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './settings.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'block' },
})
export class Settings {
  protected readonly imageUrl = ImageUrl.Settings;
  protected readonly settings;
  protected readonly languages = [
    { value: 'English', label: 'english' },
    { value: 'Francais', label: 'french' },
    { value: 'Portuguese', label: 'portuguese' },
  ] as const;
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

  constructor(
    settingsService: SettingsService,
    private readonly translationService: TranslationService,
  ) {
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

  protected selectLanguage(language: ConfigurationFormValue['language']): void {
    this.translationService.select(language);
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
      language: language === 'Francais' || language === 'Portuguese' ? language : 'English',
      baseCurrency: baseCurrency === 'CHF' ? 'CHF' : 'EUR',
      monthlyResetDay: typeof monthlyResetDay === 'number' ? monthlyResetDay : null,
      emergencyFund: typeof emergencyFund === 'number' ? emergencyFund : null,
    };
  }
}
