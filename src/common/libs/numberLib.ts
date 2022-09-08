import { split } from './lodashLib';

/**
 * 格式化数字,添加千分号
 */
export function formatNumberDot(number: number | string): string {
  const useNumber = parseFloat(String(number));
  let formattedNumber = '';
  if (useNumber && useNumber > 999) {
    let numberStr = ``;
    const strArr = split(String(useNumber), '.');
    numberStr = strArr[0];
    while (numberStr.length > 3) {
      formattedNumber = `,${numberStr.slice(-3)}${formattedNumber}`;
      numberStr = numberStr.slice(0, numberStr.length - 3);
    }
    if (numberStr) {
      formattedNumber = `${numberStr}${formattedNumber}`;
    }
    if (strArr[1]) {
      formattedNumber = `${formattedNumber}.${strArr[1]}`;
    }
  } else {
    formattedNumber = String(number);
  }
  return formattedNumber;
}

export function isNumber(number: number | string) {
  return isFinite(+number);
}

/**
 * 格式化两位小数
 */
export function formatNumberTwoBit(number: number | string): string {
  return isNumber(number) ? Number(number).toFixed(2) : String(number);
}

/**
 * 格式化数字，比例
 */
export function formatNumberPercent(number: number | string): string {
  return isNumber(number) ? `${getNumberPercent(Number(number))}%` : String(number);
}

/**
 * 获取百分比
 */
export function getNumberPercent(number: number) {
  let formattedNumber = 0;
  const useNumber = parseFloat(String(number));
  formattedNumber = useNumber * 100;
  formattedNumber = parseFloat(formattedNumber.toFixed(2));
  return formattedNumber;
}
