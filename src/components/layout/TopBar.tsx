import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useT } from '../../config/I18nProvider';
import { Phone, Mail, Sun, Moon, ChevronDown } from 'lucide-react';

const LOCALES = [
  { code: 'fr' as const, label: 'Français', short: 'FR', flag: '🇫🇷' },
  { code: 'en' as const, label: 'English',  short: 'EN', flag: '🇬🇧' },
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

  const current = LOCALES.find(l => l.code === locale) ?? LOCALES[0];

  return (
    // z-[100] > z-50 de la Navbar — la TopBar et son dropdown passent toujours au-dessus
    <div
      className="fixed top-0 left-0 right-0 text-[13px] md:text-[15px] py-2 px-4 md:px-8 lg:px-12 flex justify-between items-center border-b z-[100] transition-colors duration-300"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}
    >
      {/* GAUCHE */}
      <div className="hidden md:flex items-center gap-4 lg:gap-6 opacity-80">
        <span className="flex items-center gap-1.5">
          <Phone size={16} style={{ color: 'var(--primary)' }} />
          <span className="hidden lg:inline">{t('topbar', 'phone')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Mail size={16} style={{ color: 'var(--primary)' }} />
          <span className="hidden lg:inline">{t('topbar', 'email')}</span>
        </span>
      </div>

      <div className="flex md:hidden items-center opacity-80">
        <span className="font-bold text-xs tracking-widest uppercase" style={{ color: 'var(--primary)' }}>
          E-TEC
        </span>
      </div>

      {/* DROITE */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Réseaux */}
        <div className="hidden sm:flex items-center gap-3">
          <a href="#" className="hover:opacity-80 transition-opacity">
            <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        <span className="hidden sm:block w-px h-4 opacity-30" style={{ backgroundColor: 'var(--border)' }} />

        {/* SÉLECTEUR DE LANGUE */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:opacity-80 cursor-pointer select-none"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)',
              color: 'var(--text)',
            }}
          >
            <span className="text-sm">{current.flag}</span>
            <span className="hidden sm:inline">{current.short}</span>
            <ChevronDown
              size={11}
              className="transition-transform duration-200"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {/* Dropdown — z-[200] pour passer AU-DESSUS de tout */}
          {open && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl border shadow-xl overflow-hidden min-w-[140px]"
              style={{
                zIndex: 200,
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              {LOCALES.map((l, idx) => (
                <button
                  key={l.code}
                  onClick={() => { setLocale(l.code); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer hover:opacity-70 ${idx < LOCALES.length - 1 ? 'border-b' : ''}`}
                  style={{
                    color: locale === l.code ? 'var(--primary)' : 'var(--text)',
                    backgroundColor: locale === l.code ? 'rgba(0,128,0,0.07)' : 'transparent',
                    borderColor: 'var(--border)',
                  }}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="flex-1 text-left">{l.label}</span>
                  {locale === l.code && (
                    <span style={{ color: 'var(--primary)' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thème */}
        <button
          onClick={toggleTheme}
          className="p-1.5 md:p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
          aria-label={t('topbar', 'theme')}
        >
          {darkMode
            ? <Sun size={16} className="text-amber-500 animate-fade-in" />
            : <Moon size={16} className="text-slate-700 animate-fade-in" />}
        </button>
      </div>
    </div>
  );
}