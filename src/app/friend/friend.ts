import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import type { ExpenseFriend } from '../expense.types';
import {
  FloatingActions,
  type FloatingActionNav,
} from '../floating-actions/floating-actions';

@Component({
  selector: 'nutio-friend',
  imports: [
    FloatingActions,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './friend.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-4' },
})
export class Friend {
  protected readonly friend: ExpenseFriend;
  protected readonly actions: readonly FloatingActionNav[];

  constructor(route: ActivatedRoute) {
    const friend = route.snapshot.data['friend'] as ExpenseFriend | null;
    if (!friend) {
      throw new Error('A friend is required.');
    }

    this.friend = friend;
    this.actions = [
      {
        label: 'share',
        icon: 'share',
        routerLink: '/sharing/friends/' + friend.documentId,
        target: '_blank',
      },
      {
        label: 'editFriend',
        icon: 'edit',
        routerLink: '/expenses/friends/edit/' + friend.documentId,
      },
    ];
  }
}
