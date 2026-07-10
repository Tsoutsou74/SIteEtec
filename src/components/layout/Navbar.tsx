import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useT } from '../../config/I18nProvider';

const ANNEE_SCOLAIRE = {
  debut: { mois: 6, jour: 1 },
  fin: { mois: 12, jour: 15 },
};

function isPeriodeScolaireActive(): boolean {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const { debut, fin } = ANNEE_SCOLAIRE;

  if (debut.mois > fin.mois) {
    const apresDebut = month > debut.mois || (month === debut.mois && day >= debut.jour);
    const avantFin = month < fin.mois || (month === fin.mois && day <= fin.jour);
    return apresDebut || avantFin;
  }

  const apresDebut = month > debut.mois || (month === debut.mois && day >= debut.jour);
  const avantFin = month < fin.mois || (month === fin.mois && day <= fin.jour);
  return apresDebut && avantFin;
}

type NavLink =
  | { id: string; label: string; path: string }
  | { id: string; label: string; submenu: Array<{ id: string; label: string; icon: string; path: string }> };

function NavItem({
  link,
  darkMode,
  onNavigate,
}: {
  link: NavLink;
  darkMode: boolean;
  onNavigate: (path?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  if (!('submenu' in link)) {
    return (
      <li
        onClick={() => onNavigate(link.path)}
        className="cursor-pointer opacity-75 transition hover:opacity-100"
      >
        {link.label}
      </li>
    );
  }

  return (
    <li className="relative cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span className={`flex items-center gap-1 transition ${open ? (darkMode ? 'text-white' : 'text-black') : 'opacity-75 hover:opacity-100'}`}>
        {link.label}
        <ChevronDown size={11} className="transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </span>

      {open && (
        <div
          className="absolute left-1/2 top-full z-[300] mt-3 min-w-[230px] -translate-x-1/2 overflow-hidden rounded-2xl border shadow-2xl"
          style={{
            backgroundColor: darkMode ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.98)',
            borderColor: 'var(--border)',
            backdropFilter: 'blur(16px)',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ul className="py-2">
            {link.submenu.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onNavigate(item.path);
                    setOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold tracking-wide transition hover:opacity-70"
                  style={{ color: 'var(--text)' }}
                >
                  <span className="flex h-6 w-7 items-center justify-center rounded-lg bg-green-500/10 text-[10px] font-black text-green-500">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function Navbar() {
  const { darkMode } = useTheme();
  const { t } = useT();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const [connexionVisible] = useState(isPeriodeScolaireActive());

  const navLinks = useMemo<NavLink[]>(() => [
    { id: 'home', label: t('navbar', 'home'), path: '/' },
    {
      id: 'university',
      label: t('navbar', 'university'),
      submenu: [
        { id: 'history', label: t('navbar', 'history'), icon: 'H', path: '/historiques' },
        { id: 'president', label: t('navbar', 'president'), icon: 'P', path: '/motduPresidents' },
        { id: 'organigram', label: t('navbar', 'organigram'), icon: 'O', path: '/organigrammes' },
      ],
    },
    {
      id: 'training',
      label: t('navbar', 'training'),
      submenu: [
        { id: 'initialTraining', label: t('navbar', 'initialTraining'), icon: 'FI', path: '/formationInitiale' },
        { id: 'continuingTraining', label: t('navbar', 'continuingTraining'), icon: 'FC', path: '/formationContinue' },
        { id: 'onlineTraining', label: t('navbar', 'onlineTraining'), icon: 'EL', path: '/formationsEnligne' },
      ],
    },
    { id: 'admission', label: t('navbar', 'admission'), path: '/admission' },
    { id: 'news', label: t('navbar', 'news'), path: '/actualites' },
    { id: 'contact', label: t('navbar', 'contact'), path: '/contact' },
  ], [t]);

  const bgColor = darkMode ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.35)';
  const mobileBg = darkMode ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.98)';

  const handleNavigation = (path?: string) => {
    if (!path) return;
    navigate(path);
    setMenuOpen(false);
    setMobileExpanded(null);
  };

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav
        className="fixed top-10 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 shadow-lg transition-all duration-300 md:px-8 glass backdrop-blur-md animate-fade-in"
        style={{ backgroundColor: bgColor, color: 'var(--text)' }}
      >
        <div className="flex cursor-pointer items-center gap-2 md:gap-3" onClick={() => handleNavigation('/')}>
          <div
            className="flex h-9 w-14 items-center justify-center rounded-xl border transition-colors md:h-10 md:w-20"
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,128,0,0.08)',
              borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,128,0,0.3)',
            }}
          >
            <span className="text-sm font-black md:text-base" style={{ color: darkMode ? 'inherit' : '#16a34a' }}>
              E-TEC
            </span>
          </div>
          <div className="hidden sm:block">
            <h1
              className="text-[9px] font-bold uppercase leading-none tracking-widest opacity-90 md:text-[10px]"
              style={{ color: darkMode ? 'inherit' : '#16a34a' }}
            >
              Education in Training Employments and Communication
            </h1>
            <p className="mt-0.5 text-xs font-black uppercase tracking-wider" style={{ color: darkMode ? 'inherit' : '#15803d' }}>
              Faravohitra
            </p>
          </div>
        </div>

        {!searchOpen && (
          <ul className="hidden items-center gap-6 text-[11px] font-bold uppercase tracking-wider lg:flex xl:gap-8">
            {navLinks.map((link) => (
              <NavItem key={link.id} link={link} darkMode={darkMode} onNavigate={handleNavigation} />
            ))}
          </ul>
        )}

        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4 lg:flex-initial">
          <div ref={searchBoxRef} className="relative flex items-center">
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-300 sm:w-64 md:w-72"
                style={{
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                  borderColor: 'var(--border)',
                }}
              >
                <Search size={15} className="shrink-0 opacity-50" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('navbar', 'searchPlaceholder')}
                  className="min-w-0 flex-1 bg-transparent text-xs outline-none"
                  style={{ color: 'var(--text)' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="shrink-0 cursor-pointer opacity-50 transition hover:opacity-90"
                  aria-label={t('navbar', 'closeMenu')}
                >
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="cursor-pointer p-1 opacity-70 transition hover:opacity-100"
                aria-label={t('navbar', 'searchPlaceholder')}
              >
                <Search size={15} />
              </button>
            )}
          </div>

          {!searchOpen && connexionVisible && (
            <button
              onClick={() => handleNavigation('/log_in')}
              className="hidden shrink-0 cursor-pointer rounded-xl border px-3 py-2 text-[11px] font-bold transition-all duration-300 sm:block md:px-4"
              style={{
                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                color: 'var(--text)',
              }}
            >
              {t('navbar', 'login')}
            </button>
          )}

          {!searchOpen && (
            <button
              className="shrink-0 rounded-xl border p-2 transition-all lg:hidden"
              style={{
                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                color: 'var(--text)',
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? t('navbar', 'closeMenu') : t('navbar', 'openMenu')}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed top-[82px] left-0 right-0 z-40 max-h-[80vh] overflow-y-auto border-b shadow-xl lg:hidden"
          style={{ backgroundColor: mobileBg, borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          <ul className="flex flex-col px-6 py-2">
            {navLinks.map((link) => (
              <li key={link.id}>
                <div
                  className="flex cursor-pointer items-center justify-between border-b py-3 text-sm font-bold uppercase tracking-wider opacity-75 transition"
                  style={{ borderColor: 'var(--border)' }}
                  onClick={() => {
                    if ('submenu' in link) {
                      setMobileExpanded(mobileExpanded === link.id ? null : link.id);
                    } else {
                      handleNavigation(link.path);
                    }
                  }}
                >
                  <span>{link.label}</span>
                  {'submenu' in link && (
                    <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: mobileExpanded === link.id ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  )}
                </div>

                {'submenu' in link && mobileExpanded === link.id && (
                  <ul className="space-y-0.5 py-1 pl-4">
                    {link.submenu.map((sub) => (
                      <li
                        key={sub.id}
                        className="flex cursor-pointer items-center gap-3 py-2.5 text-xs font-semibold tracking-wide opacity-80 transition hover:opacity-100"
                        onClick={() => handleNavigation(sub.path)}
                      >
                        <span className="flex h-6 w-8 items-center justify-center rounded-lg bg-green-500/10 text-[10px] font-black text-green-500">
                          {sub.icon}
                        </span>
                        <span>{sub.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {connexionVisible && (
              <li className="flex justify-center pb-4 pt-4 sm:hidden">
                <button
                  onClick={() => handleNavigation('/log_in')}
                  className="w-full cursor-pointer rounded-xl border px-4 py-2.5 text-center text-[11px] font-bold transition-all duration-300"
                  style={{
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                    color: 'var(--text)',
                  }}
                >
                  {t('navbar', 'login')}
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
