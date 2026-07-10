import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useT } from '../../config/I18nProvider';

const LOCALES = [
  { code: 'fr' as const, label: 'Francais', short: 'FR' },
  { code: 'en' as const, label: 'English', short: 'EN' },
  { code: 'mg' as const, label: 'Malagasy', short: 'MG' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useT();
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

  const current = LOCALES.find((item) => item.code === locale) ?? LOCALES[0];

  return (
    <div className="relative" ref={dropRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex cursor-pointer select-none items-center gap-1.5 rounded-xl border px-2 py-1.5 text-xs font-bold uppercase tracking-wider transition hover:opacity-80 md:px-3"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--text)' }}
      >
        <span className="hidden sm:inline">{current.short}</span>
        <ChevronDown
          size={11}
          className="transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 min-w-[160px] overflow-hidden rounded-xl border shadow-xl"
          style={{ zIndex: 210, backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          {LOCALES.map((item, index) => (
            <button
              key={item.code}
              onClick={() => {
                void setLocale(item.code);
                setOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-xs font-semibold tracking-wide transition hover:opacity-70 ${index < LOCALES.length - 1 ? 'border-b' : ''}`}
              style={{
                color: locale === item.code ? 'var(--primary)' : 'var(--text)',
                backgroundColor: locale === item.code ? 'rgba(0,128,0,0.07)' : 'transparent',
                borderColor: 'var(--border)',
              }}
            >
              <span className="flex-1 text-left">{item.label}</span>
              {locale === item.code && <span style={{ color: 'var(--primary)' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
