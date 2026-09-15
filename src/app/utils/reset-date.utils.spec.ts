import dayjs from 'dayjs/esm';
import { describe, expect, it } from 'vitest';
import { getNextResetDate } from './reset-date.utils';

describe('getNextResetDate', () => {
  it('uses the reset day in the current month when it is still upcoming', () => {
    expect(getNextResetDate(dayjs('2026-09-15'), 20).format('YYYY-MM-DD')).toBe('2026-09-20');
  });

  it('uses the reset day in the next month when this month has passed', () => {
    expect(getNextResetDate(dayjs('2026-09-15'), 10).format('YYYY-MM-DD')).toBe('2026-10-10');
  });

  it('clamps reset days to the last day of a shorter month', () => {
    expect(getNextResetDate(dayjs('2026-02-10'), 31).format('YYYY-MM-DD')).toBe('2026-02-28');
  });

  it('falls back to the end of the current month without a reset day', () => {
    expect(getNextResetDate(dayjs('2026-09-15'), null).format('YYYY-MM-DD')).toBe('2026-09-30');
  });
});
