import dayjs, { Dayjs } from 'dayjs/esm';

export const API_DATE_FORMAT = 'YYYY-MM-DD';

export function formatDate(value: string | Date | Dayjs): string {
  const date = dayjs(value);

  if (!date.isValid()) {
    throw new TypeError();
  }

  const today = dayjs();
  if (date.isSame(today, 'day')) {
    return 'Today';
  }
  if (date.isSame(today.subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  }
  if (date.isSame(today.add(1, 'day'), 'day')) {
    return 'Tomorrow';
  }

  if (date.year() !== today.year()) {
    return date.format('MMM D, YYYY');
  }

  return date.format('MMMM D');
}
