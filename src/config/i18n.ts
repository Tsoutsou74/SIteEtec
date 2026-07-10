import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import fr from '../locales/fr/common.json';
import en from '../locales/en/common.json';
import mg from '../locales/mg/common.json';

export const supportedLocales = ['fr', 'en', 'mg'] as const;
export type Locale = (typeof supportedLocales)[number];

export const resources = {
  fr: { common: fr },
  en: { common: en },
  mg: { common: mg },
} as const;

export type Section = keyof (typeof resources)['fr']['common'];
export type Key<S extends Section> = keyof (typeof resources)['fr']['common'][S];

const fallbackLocale: Locale = 'fr';

function normalizeLocale(value?: string | null): Locale {
  const code = (value ?? '').toLowerCase();
  if (code.startsWith('en')) return 'en';
  if (code.startsWith('mg') || code.startsWith('mlg')) return 'mg';
  return fallbackLocale;
}

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: fallbackLocale,
      supportedLngs: supportedLocales as unknown as string[],
      defaultNS: 'common',
      ns: ['common'],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
      load: 'languageOnly',
      react: {
        useSuspense: false,
      },
    });
}

export function getT<S extends Section>(section: S, key: Key<S>, locale: Locale) {
  const normalized = normalizeLocale(locale);
  return i18n.t(`${section}.${String(key)}`, { lng: normalized });
}

export function setDocumentLanguage(locale: Locale) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
}

export function toLocale(value?: string | null): Locale {
  return normalizeLocale(value);
}

export default i18n;
