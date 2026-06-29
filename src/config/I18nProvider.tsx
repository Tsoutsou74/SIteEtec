// ============================================================
//  E-TEC — Provider et hook i18n
//  src/config/I18nProvider.tsx
// ============================================================

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Locale, Section, Key, getT } from './i18n';

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: <S extends Section>(section: S, key: Key<S>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');

  const t = <S extends Section>(section: S, key: Key<S>): string =>
    getT(section, key, locale);

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