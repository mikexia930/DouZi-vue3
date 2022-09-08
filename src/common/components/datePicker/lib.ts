import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(utc);
import { getI18n } from '@/i18n/lib';
import { storeCommon } from '@/common/stores/storeCommon';

/**
 * utc 的实例
 */
export function getUTCIns(datetime = '') {
  let dayIns;
  if (datetime) {
    dayIns = dayjs(datetime);
  } else {
    dayIns = dayjs().utcOffset(storeCommon.timezone);
  }
  return dayIns;
}

export function getFormat(type: string) {
  let format = '';
  switch (type) {
    case 'shortDate':
      format = 'YYYYMMDD';
      break;
    case 'date':
      format = 'YYYY-MM-DD';
      break;
    case 'shortTime':
      format = 'YYYY-MM-DD HH:mm';
      break;
    case 'time':
    default:
      format = 'YYYY-MM-DD HH:mm:ss';
      break;
  }
  return format;
}

export function getSpanDate(span: number, datetime = '', formatter = 'YYYY-MM-DD', unit = 'day') {
  let backDatetime: any;
  if (datetime) {
    backDatetime = getUTCIns(datetime).add(span, unit as any);
  } else {
    backDatetime = getUTCIns().add(span, unit as any);
  }
  return backDatetime.format(formatter);
}

export function getUnix(datetime = '') {
  let unix = 0;
  if (datetime) {
    unix = getUTCIns(datetime).unix();
  } else {
    unix = getUTCIns().unix();
  }
  return unix;
}

export function parseQuickDate(dateCode = '', format = 'YYYY-MM-DD', dateTime = '', dateDiff = 0) {
  let beginDate;
  let endDate;
  let dateUnix;
  let dateSplit;
  let tag = dateCode.substring(0, 2);
  if (tag === 'LD') {
    dateSplit = dateCode.split('|');
    if (dateSplit.length === 3) {
      beginDate = getUTCIns(dateSplit[1]);
      endDate = getUTCIns().subtract(parseInt(dateSplit[2]), 'day');
    }
  } else if (['DC', 'WC', 'MC', 'LC'].includes(tag)) {
    const dateSpan = parseInt(String(dateCode.substring(2)));
    switch (tag) {
      case 'DC':
        beginDate = getUTCIns(dateTime).subtract(dateSpan, 'day');
        dateUnix = beginDate.unix() + dateDiff;
        endDate = dayjs.unix(dateUnix);
        break;
      case 'WC':
        beginDate = getUTCIns(dateTime).subtract(dateSpan, 'week');
        dateUnix = beginDate.unix() + dateDiff;
        endDate = dayjs.unix(dateUnix);
        break;
      case 'MC':
        beginDate = getUTCIns(dateTime).subtract(dateSpan, 'month');
        dateUnix = beginDate.unix() + dateDiff;
        endDate = dayjs.unix(dateUnix);
        break;
      case 'LC':
        endDate = getUTCIns(dateTime).subtract(dateSpan, 'day');
        dateUnix = endDate.unix() - dateDiff;
        beginDate = dayjs.unix(dateUnix);
        break;
    }
  } else {
    tag = dateCode.substring(0, 1);
    const dateSymbol = dateCode.substring(1);
    let dateSplit = dateSymbol.split('-');
    let beginSpan = 0;
    let endSpan = 0;
    if (dateSplit.length === 2) {
      beginSpan = parseInt(String(dateSplit[0]));
      endSpan = parseInt(String(dateSplit[1]));
    } else {
      dateSplit = dateSymbol.split('|');
      if (dateSplit.length === 3) {
        beginSpan = parseInt(String(dateSplit[1]));
        endSpan = parseInt(String(dateSplit[2]));
      } else {
        beginSpan = parseInt(String(dateSplit[0]));
        // 兼容之前的快捷
        if ([1].includes(beginSpan)) {
          // D1 昨日 W1 上周 M1 上月
          beginSpan = 1;
          endSpan = 1;
        } else if ([7, 30].includes(beginSpan)) {
          // D7 近7日 D30 近 30日
          beginSpan -= 1;
          endSpan = 0;
        } else if ([8, 31].includes(beginSpan)) {
          // D8 过去7日 D31 过去30日
          beginSpan -= 1;
          endSpan = 1;
        } else {
          // DO 今日 WO 本周 M0 本月
          endSpan = 0;
        }
      }
    }
    switch (tag) {
      case 'D':
        beginDate = getUTCIns().subtract(beginSpan, 'day').startOf('date');
        endDate = getUTCIns().subtract(endSpan, 'day').endOf('date');
        break;
      case 'W':
        beginDate = getUTCIns().subtract(beginSpan, 'week').startOf('isoWeek');
        endDate = getUTCIns().subtract(endSpan, 'week').endOf('isoWeek');
        break;
      case 'M':
        beginDate = getUTCIns().subtract(beginSpan, 'month').startOf('month');
        endDate = getUTCIns().subtract(endSpan, 'month').endOf('month');
        break;
    }
  }
  return {
    begin: beginDate ? beginDate.format(format) : '',
    end: endDate ? endDate.format(format) : '',
  };
}

/**
 * 一年中的第几周
 * @param datetime
 */
export function getWeekOfYear(datetime: string) {
  return getUTCIns(datetime).isoWeek();
}

/**
 * 星期几
 * @param datetime
 */
export function getDayOfWeek(datetime: string) {
  let backData = 0;
  if (datetime) {
    backData = getUTCIns(datetime).isoWeekday();
  } else {
    backData = getUTCIns().isoWeekday();
  }
  return backData;
}

/**
 * 获取星期名称
 * @param date
 */
export function getDayOfWeekShortName(date: string) {
  const weekNum = getDayOfWeek(date);
  let lanTag = '';
  switch (String(weekNum)) {
    case '1':
      lanTag = 'datetime.tuesdayShort';
      break;
    case '2':
      lanTag = 'datetime.wednesdayShort';
      break;
    case '3':
      lanTag = 'datetime.thursdayShort';
      break;
    case '4':
      lanTag = 'datetime.fridayShort';
      break;
    case '5':
      lanTag = 'datetime.saturdayShort';
      break;
    case '6':
      lanTag = 'datetime.sundayShort';
      break;
    case '0':
    default:
      lanTag = 'datetime.mondayShort';
      break;
  }
  return getI18n(lanTag);
}

/**
 * 获取周的开始和结束日期
 * @param datetime
 * @param formatter 日期格式
 */
export function getWeekBeginAndEndDate(datetime: string, formatter: string) {
  const backData = {
    begin: '',
    end: ''
  };
  if (datetime) {
    backData.begin = getUTCIns(datetime).startOf('isoWeek').format(formatter);
    backData.end = getUTCIns(datetime).endOf('isoWeek').format(formatter);
  } else {
    backData.begin = getUTCIns().startOf('isoWeek').format(formatter);
    backData.end = getUTCIns().endOf('isoWeek').format(formatter);
  }
  return backData;
}

export function formatDate(datetime: string, formatter: string) {
  return getUTCIns(datetime).format(formatter);
}

export const formatParticleDate = (date: string, type = 'day') => {
  const [year, month, week] = formatDate(date, 'YYYY-MM-WW').split('-');
  switch (type) {
    case 'minute':
      return formatDate(date, 'YYYY-MM-DD HH:mm');
    case 'hour':
      return formatDate(date, 'YYYY-MM-DD HH:00');
    case 'day':
      return formatDate(date, 'YYYY-MM-DD');
    case 'week':
      return getI18n('datetime.weekDateFormat', { week });
    case 'month':
      return getI18n('datetime.monthDateFormat', { year, month });
    default:
      return formatDate(date, 'YYYY-MM-DD');
  }
};

export function formatUnixDate(datetime: number, formatter: string) {
  return dayjs.unix(datetime).format(formatter);
}

/**
 * 返回时间差
 */
export function getDatetimeDiff(beginDatetime: string, endDatetime: string, unit = 'day') {
  if (beginDatetime) {
    return getUTCIns(beginDatetime).diff(getUTCIns(endDatetime), unit as any);
  } else {
    return getUTCIns().diff(getUTCIns(endDatetime), unit as any);
  }
}

/**
 * 获取天的结束时间
 */
export function getEndOfDatetime(datetime?: string) {
  if (datetime) {
    return getUTCIns(datetime).endOf('date').format(getFormat('time'));
  } else {
    return getUTCIns().endOf('date').format(getFormat('time'));
  }
}

/**
 * 验证时间是否大于当前时间，如果大于，则约束为当前时间
 */
export function datetimeForceToCur(datetime: string, timeParticleSize: any) {
  let validDatetime = '';
  if (getUTCIns().isBefore(datetime, timeParticleSize)) {
    switch (timeParticleSize) {
      case 'minute':
        validDatetime = getUTCIns().format('YYYY-MM-DD HH:mm');
        validDatetime += ':59';
        break;
      case 'hour':
      default:
        validDatetime = getUTCIns().format('YYYY-MM-DD HH');
        validDatetime += ':59:59';
        break;
    }
  } else {
    validDatetime = datetime;
  }
  return validDatetime;
}

/**
 * 比较两个日期段是否相等
 * @param beginDatetime
 * @param endDatetime
 * @param beginDatetimeCompare
 * @param endDatetimeCompare
 */
export function checkDateSpanIsEqual(
  beginDatetime: string,
  endDatetime: string,
  beginDatetimeCompare: string,
  endDatetimeCompare: string
) {
  let isEqual = true;
  const beginTimeUnix = getUnix(beginDatetime);
  const endTimeUnix = getUnix(endDatetime);
  const beginTimeCompareUnix = getUnix(beginDatetimeCompare);
  const endTimeCompareUnix = getUnix(endDatetimeCompare);
  if (endTimeCompareUnix - beginTimeCompareUnix !== endTimeUnix - beginTimeUnix) {
    isEqual = false;
  }
  return isEqual;
}
