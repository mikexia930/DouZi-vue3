import { createI18n } from 'vue-i18n';
import zh_CN from './locales/zh_CN';
import en from './locales/en';

export enum EnumLang {
  Zh_CN = 'zh_CN',
  EN = 'en'
}

export const i18n = createI18n({
  locale: EnumLang.Zh_CN,
  fallbackLocale: EnumLang.Zh_CN,
  allowComposition: true,
  messages: {
    zh_CN,
    en
  }
});
