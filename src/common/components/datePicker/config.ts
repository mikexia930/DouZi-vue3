import { getI18n } from '@/i18n/lib';

export enum EnumTimeSize {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Minute = 'minute',
  Hour = 'hour'
}

/**
 * 快捷时间
 */
export const configQuickDatetime = [
  {
    key: 'D0',
    name: getI18n('datePicker.today')
  },
  {
    key: 'D1',
    name: getI18n('datePicker.yesterday')
  },
  {
    key: 'W0',
    name: getI18n('datePicker.thisWeek')
  },
  {
    key: 'W1',
    name: getI18n('datePicker.lastWeek')
  },
  {
    key: 'M0',
    name: getI18n('datePicker.thisMonth')
  },
  {
    key: 'M1',
    name: getI18n('datePicker.lastMonth')
  },
  {
    key: 'D7',
    name: getI18n('datePicker.recentDays', { days: 7 })
  },
  {
    key: 'D8',
    name: getI18n('datePicker.lastDays', { days: 7 })
  },
  {
    key: 'D30',
    name: getI18n('datePicker.recentDays', { days: 30 })
  },
  {
    key: 'D31',
    name: getI18n('datePicker.lastDays', { days: 30 })
  },
  {
    key: 'D14-8',
    name: getI18n('datePicker.lastDaysRange', { begin: 14, end: 8 })
  },
  {
    key: 'D60-31',
    name: getI18n('datePicker.lastDaysRange', { begin: 60, end: 31 })
  }
];

export interface IFDatePickerChooseBack {
  diff: number;
  begin: string;
  end: string;
  choose: string;
  unit: string;
  type: string;
}
