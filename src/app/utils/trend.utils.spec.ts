import { describe, expect, it } from 'vitest';
import { createLinearTrend } from './trend.utils';

describe('createLinearTrend', () => {
  it('returns the best-fit linear progression', () => {
    const trend = createLinearTrend([
      { name: 'A', value: 10 },
      { name: 'B', value: 20 },
      { name: 'C', value: 30 },
    ]);

    expect(trend.map(({ value }) => value)).toEqual([10, 20, 30]);
  });

  it('does not produce negative expense values', () => {
    const trend = createLinearTrend([
      { name: 'A', value: 100 },
      { name: 'B', value: 0 },
    ]);

    expect(trend[1].value).toBe(0);
  });
});
