import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import type { TranslationKey } from '../utils/translation.utils';
import { ImageUrl } from '../images';

@Component({
  selector: 'nutio-empty',
  imports: [TranslatePipe],
  templateUrl: './empty.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col items-center gap-3 py-8' },
})
export class Empty {
  protected readonly imageUrl = ImageUrl.Empty;
  readonly message = input.required<TranslationKey>();
}
