import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import type { ExpenseFriend } from '../expense.types';
import { FriendSharing } from './friend-sharing';

describe('FriendSharing', () => {
  it('renders a personalized summary and export call to action', async () => {
    const friend = {
      documentId: 'friend-one',
      name: 'Taylor',
      email: 'taylor@example.com',
    } as ExpenseFriend;

    await TestBed.configureTestingModule({
      imports: [FriendSharing],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { sharing: { friend, currentUser: { username: 'Alex' } } },
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FriendSharing);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('Taylor');
    expect(element.querySelector('.introduction')?.textContent).toContain(
      'Alex is waiting for money from you.',
    );
    expect(element.querySelector('.balance-amount')?.textContent).toContain('CHF');
    expect(element.querySelectorAll('.screen-expenses li')).toHaveLength(3);
    expect(element.querySelectorAll('tbody tr')).toHaveLength(7);
    expect(element.querySelector('.call-to-action')?.textContent).toContain('Join Squirrelli');
  });
});
