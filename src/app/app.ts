import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'squirrelli-root',
  imports: [RouterOutlet, MatToolbarModule, Header, Footer],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Squirrelli');
}
