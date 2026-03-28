import { Component, DestroyRef, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VERSION } from './version';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'squirrelli-root',
  imports: [RouterOutlet, MatToolbarModule, Header, Footer],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Squirrelli');
  protected readonly version = VERSION;
  protected readonly menuOpen = signal(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    destroyRef: DestroyRef,
  ) {
    this.route.fragment.pipe(takeUntilDestroyed(destroyRef)).subscribe((fragment) => {
      this.menuOpen.set(fragment === 'menu');
    });
  }
}
