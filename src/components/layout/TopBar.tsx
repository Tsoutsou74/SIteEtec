import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Mail, Moon, Phone, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useT } from '../../config/I18nProvider';

const LOCALES = [
  { code: 'fr' as const, label: 'Francais', short: 'FR', flag: '🇫🇷' },
  { code: 'en' as const, label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'mg' as const, label: 'Malagasy', short: 'MG', flag: '🇲🇬' },
];

export default function TopBar() {
  const { darkMode, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useT();
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between border-b px-4 py-2 text-[13px] transition-colors duration-300 md:px-8 md:text-[15px]"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
    >
      <div className="hidden items-center gap-4 opacity-80 md:flex lg:gap-6">
        <span className="flex items-center gap-1.5">
          <Phone size={16} style={{ color: 'var(--primary)' }} />
          <span className="hidden lg:inline">{t('topbar', 'phone')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Mail size={16} style={{ color: 'var(--primary)' }} />
          <span className="hidden lg:inline">{t('topbar', 'email')}</span>
        </span>
      </div>

      <div className="flex items-center opacity-80 md:hidden">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
          E-TEC
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden items-center gap-3 sm:flex">
          <a href="#" className="transition-opacity hover:opacity-80" aria-label={t('footer', 'facebook')}>
            <svg className="h-4 w-4 fill-current md:h-5 md:w-5" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href="#" className="transition-opacity hover:opacity-80" aria-label={t('footer', 'linkedin')}>
            <svg className="h-4 w-4 fill-current md:h-5 md:w-5" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        <span className="hidden h-4 w-px opacity-30 sm:block" style={{ backgroundColor: 'var(--border)' }} />

        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setOpen((value) => !value)}
            className="flex cursor-pointer select-none items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-80 md:px-3"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            <span className="text-sm">{current.flag}</span>
            <span className="hidden sm:inline">{current.short}</span>
            <ChevronDown size={11} className="transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {open && (
            <div
              className="absolute right-0 top-full mt-2 min-w-[140px] overflow-hidden rounded-xl border shadow-xl"
              style={{ zIndex: 200, backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              {LOCALES.map((l, idx) => (
                <button
                  key={l.code}
                  onClick={() => {
                    void setLocale(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all duration-150 hover:opacity-70 ${idx < LOCALES.length - 1 ? 'border-b' : ''}`}
                  style={{
                    color: locale === l.code ? 'var(--primary)' : 'var(--text)',
                    backgroundColor: locale === l.code ? 'rgba(0,128,0,0.07)' : 'transparent',
                    borderColor: 'var(--border)',
                  }}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="flex-1 text-left">{l.label}</span>
                  {locale === l.code && <span style={{ color: 'var(--primary)' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          className="flex cursor-pointer items-center justify-center rounded-xl border p-1.5 transition-all duration-300 hover:scale-105 active:scale-95 md:p-2"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
          aria-label={t('topbar', 'theme')}
        >
          {darkMode ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-slate-700" />}
        </button>
      </div>
    </div>
  );
}
