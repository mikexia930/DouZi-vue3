import { i18n } from './i18n';

// @ts-ignore
const { t, tc } = i18n.global;

export function getI18n(key: string, params?: any) {
  if (params) {
    return tc(key, params);
  } else {
    return t(key);
  }
}