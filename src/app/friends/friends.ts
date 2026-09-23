import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import type { ExpenseFriend } from '../expense.types';
import { FriendsService } from '../friends.service';
import { Empty } from '../empty/empty';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'nutio-friends',
  imports: [
    Empty,
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './friends.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'flex flex-col gap-4' },
})
export class Friends {
  protected readonly columns = ['name', 'email'];
  protected readonly friends$: Observable<ExpenseFriend[]>;

  constructor(friendsService: FriendsService) {
    this.friends$ = friendsService.getFriends();
  }
}
