import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import english from '../../../public/i18n/en.json';
import type { ExpenseFriend } from '../expense.types';
import { Friend } from './friend';

describe('Friend', () => {
  it('shows the friend and links to its sharing and edit views', async () => {
    const friend = {
      documentId: 'friend-one',
      name: 'Taylor',
      email: 'taylor@example.com',
    } as ExpenseFriend;

    await TestBed.configureTestingModule({
      imports: [Friend],
      providers: [
        provideRouter([]),
        provideTranslateService({ lang: 'en' }),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { friend } } } },
      ],
    }).compileComponents();
    TestBed.inject(TranslateService).setTranslation('en', english);

    const fixture = TestBed.createComponent(Friend);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('Taylor');
    expect(element.querySelector('a[href="mailto:taylor@example.com"]')).toBeTruthy();
    const sharingLink = element.querySelector<HTMLAnchorElement>(
      'a[href="/sharing/friends/friend-one"]',
    );
    expect(sharingLink?.target).toBe('_blank');
    expect(element.querySelector('a[href="/expenses/friends/edit/friend-one"]')).toBeTruthy();
  });
});
