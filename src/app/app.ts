import {
  Component,
  ChangeDetectionStrategy,
  computed,
  effect,
  inject,
  type Signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, of, startWith, switchMap, type Observable } from 'rxjs';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'squirrelli-app',
  imports: [RouterOutlet, MatToolbarModule, Header, Footer],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.html',
})
export class App {
  protected readonly appName = 'Squirrelli';
  private readonly title: Signal<string>;

  constructor() {
    const router = inject(Router);
    const activatedRoute = inject(ActivatedRoute);
    const translateService = inject(TranslateService);

    const translationKey: Signal<string | undefined> = toSignal(
      router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(undefined),
        map(() => {
          let route = activatedRoute.snapshot;
          while (route.firstChild) route = route.firstChild;
          return route.data['title'] as string;
        }),
      ),
    );

    const translatedTitle: Signal<string | undefined> = toSignal(
      toObservable(translationKey).pipe(
        switchMap((key): Observable<string | undefined> =>
          key ? translateService.stream(key) : of(undefined),
        ),
      ),
    );

    this.title = computed(() => {
      const pageTitle = translatedTitle();
      return pageTitle ? `${pageTitle} • ${this.appName}` : this.appName;
    });

    effect(() => {
      document.title = this.title();
    });
  }
}
