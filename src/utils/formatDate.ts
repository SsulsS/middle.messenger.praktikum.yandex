import { LOCALE } from 'constants/general';

const dayFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
});

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
});

export const formatDay = (isoDate: string): string => {
  return dayFormatter.format(new Date(isoDate));
};

export const formatTime = (isoDate: string): string => {
  return timeFormatter.format(new Date(isoDate));
};
