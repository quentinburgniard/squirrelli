import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { VERSION } from './version';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'penny-root',
  imports: [RouterOutlet, MatToolbarModule, Header, Footer],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Squirrelli');
  protected readonly version = VERSION;
}
