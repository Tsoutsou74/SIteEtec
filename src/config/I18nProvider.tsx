import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { TOptions } from 'i18next';
import i18n, { Locale, Section, Key, setDocumentLanguage, toLocale } from './i18n';

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => Promise<void>;
  t: <S extends Section>(section: S, key: Key<S>, options?: TOptions) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(toLocale(i18n.resolvedLanguage));

  useEffect(() => {
    const syncLocale = (lng: string) => {
      const next = toLocale(lng);
      setLocaleState(next);
      setDocumentLanguage(next);
    };

    syncLocale(i18n.resolvedLanguage);
    i18n.on('languageChanged', syncLocale);

    return () => {
      i18n.off('languageChanged', syncLocale);
    };
  }, []);

  const setLocale = async (next: Locale) => {
    await i18n.changeLanguage(next);
    setDocumentLanguage(next);
  };

  const t = (section: Section, key: string, options?: TOptions) => i18n.t(`${section}.${key}`, options);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used inside <I18nProvider>');
  return ctx;
}
