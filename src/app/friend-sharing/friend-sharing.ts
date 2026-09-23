import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageUrl } from '../images';
import type { FriendSharingData } from './friend-sharing.resolver';

interface SharedExpenseExample {
  readonly description: string;
  readonly date: string;
  readonly share: number;
}

@Component({
  selector: 'nutio-friend-sharing',
  imports: [CurrencyPipe],
  templateUrl: './friend-sharing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendSharing {
  protected readonly friend: FriendSharingData['friend'];
  protected readonly ownerName: string;
  protected readonly logoUrl = ImageUrl.Logo;
  protected readonly imageUrl = ImageUrl.Friends;

  // Replace these examples when the API exposes allocations filtered by friend.
  protected readonly expenses: readonly SharedExpenseExample[] = [
    { description: 'Dinner with friends', date: '12 September 2026', share: 42.2 },
    { description: 'Train tickets', date: '8 September 2026', share: 18.5 },
    { description: 'Weekend groceries', date: '5 September 2026', share: 31.8 },
    { description: 'Museum tickets', date: '1 September 2026', share: 24 },
    { description: 'Fuel share', date: '29 August 2026', share: 36.4 },
    { description: 'Coffee and pastries', date: '24 August 2026', share: 11.5 },
    { description: 'Holiday supplies', date: '20 August 2026', share: 28.75 },
  ];

  protected readonly quickExpenses = this.expenses.slice(0, 3);
  protected readonly total = this.expenses.reduce((sum, expense) => sum + expense.share, 0);

  constructor(route: ActivatedRoute) {
    const sharing = route.snapshot.data['sharing'] as FriendSharingData | null;
    if (!sharing) {
      throw new Error('Sharing data is required.');
    }

    this.friend = sharing.friend;
    this.ownerName = sharing.currentUser.username.trim();
  }
}
