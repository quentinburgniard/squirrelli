import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import type { TranslationKey } from '../i18n/translation-key';
import { ImageUrl } from '../images';

@Component({
  selector: 'squirrelli-empty',
  imports: [TranslatePipe],
  templateUrl: './empty.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col items-center gap-3 py-8' },
})
export class Empty {
  protected readonly imageUrl = ImageUrl.Empty;
  readonly message = input.required<TranslationKey>();
}
