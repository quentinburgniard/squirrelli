import type { Dayjs } from 'dayjs/esm';

export function getNextResetDate(today: Dayjs, resetDay: number | null): Dayjs {
  if (resetDay === null || !Number.isInteger(resetDay) || resetDay < 1 || resetDay > 31) {
    return today.endOf('month');
  }

  const getResetDateForMonth = (month: Dayjs): Dayjs =>
    month.date(Math.min(resetDay, month.daysInMonth())).endOf('day');

  const thisMonthReset = getResetDateForMonth(today);
  return thisMonthReset.isBefore(today, 'day')
    ? getResetDateForMonth(today.add(1, 'month').startOf('month'))
    : thisMonthReset;
}
