import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ── Période de l'année scolaire ──────────────────────────
// Le bouton "Connexion" n'apparaît que pendant cette période.
// Format : mois 1-12, jour 1-31
const ANNEE_SCOLAIRE = {
  debut: { mois: 1,  jour: 1 },   // 1er Septembre
  fin:   { mois: 3,  jour: 15 },  // 15 Juillet
};

function isPeriodeScolaireActive(): boolean {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() est 0-indexé
  const day = now.getDate();

  const { debut, fin } = ANNEE_SCOLAIRE;

  // Cas où l'année scolaire traverse le Nouvel An (ex: Sept → Juillet)
  if (debut.mois > fin.mois) {
    const apresDebut = month > debut.mois || (month === debut.mois && day >= debut.jour);
    const avantFin   = month < fin.mois   || (month === fin.mois   && day <= fin.jour);
    return apresDebut || avantFin;
  }

  // Cas simple où début < fin dans la même année
  const apresDebut = month > debut.mois || (month === debut.mois && day >= debut.jour);
  const avantFin   = month < fin.mois   || (month === fin.mois   && day <= fin.jour);
  return apresDebut && avantFin;
}

// Sous-menus par lien
const NAV_LINKS = [
  { label: 'Accueil', path: '/', active: true },
  {
    label: 'Université',
    submenu: [
      { label: 'Historique',         icon: '🏛️' },
      { label: 'Mot du Président',    icon: '🎓' },
      { label: 'Organigramme',        icon: '🗂️' },
      { label: 'Chiffres clés',       icon: '📊' },
      { label: 'Partenariats',        icon: '🤝' },
      { label: 'Campus Faravohitra',  icon: '📍' },
    ],
  },
  {
    label: 'Formations',
    submenu: [
      { label: 'Administration & Gestion',  icon: '💼' },
      { label: 'Génie Logiciel & Réseaux',  icon: '💻' },
      { label: 'Bâtiment & Travaux Publics', icon: '🏗️' },
      { label: 'Électromécanique',           icon: '⚙️' },
    ],
  },
  { label: 'Admissions', path: '/admission' },
  { label: 'Actualités' },
  { label: 'Contact', path: '/contact' },
];

interface NavItemProps {
  link: typeof NAV_LINKS[number];
  darkMode: boolean;
  onClick?: () => void;
}

function NavItem({ link, darkMode, onClick }: NavItemProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (!link.submenu) {
    return (
      <li
        onClick={onClick}
        className={`cursor-pointer transition ${
          link.active
            ? `border-b-2 border-amber-400 pb-0.5 ${darkMode ? 'text-white' : 'text-black'}`
            : 'opacity-75 hover:opacity-100'
        }`}
      >
        {link.label}
      </li>
    );
  }

  return (
    <li
      ref={ref}
      className="relative cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={`flex items-center gap-1 transition ${
          open ? (darkMode ? 'text-white' : 'text-black') : 'opacity-75 hover:opacity-100'
        }`}
      >
        {link.label}
        <ChevronDown
          size={11}
          className="transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </span>

      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 rounded-2xl border shadow-2xl overflow-hidden min-w-[220px]"
          style={{
            zIndex: 300,
            backgroundColor: darkMode ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.98)',
            borderColor: 'var(--border)',
            backdropFilter: 'blur(16px)',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 overflow-hidden">
            <div
              className="w-3 h-3 rotate-45 mx-auto mt-1 border-l border-t"
              style={{
                backgroundColor: darkMode ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.98)',
                borderColor: 'var(--border)',
              }}
            />
          </div>

          <ul className="py-2">
            {link.submenu.map((item, idx) => (
              <li key={idx}>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold tracking-wide text-left transition-all duration-150 hover:opacity-70 cursor-pointer"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,128,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Le bouton Connexion est visible uniquement pendant l'année scolaire
  const [connexionVisible] = useState(isPeriodeScolaireActive());

  const bgColor  = darkMode ? 'rgba(0,0,0,0.15)'    : 'rgba(255,255,255,0.35)';
  const mobileBg = darkMode ? 'rgba(10,10,10,0.97)'  : 'rgba(255,255,255,0.98)';

  const handleNavigation = (path?: string) => {
    if (path) {
      window.location.href = path;
      setMenuOpen(false);
    }
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
      console.log('Recherche :', searchQuery);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav
        className="fixed top-10 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-8 py-3 glass backdrop-blur-md animate-fade-in shadow-lg transition-all duration-300"
        style={{ backgroundColor: bgColor, color: 'var(--text)' }}
      >
        {/* LOGO */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => handleNavigation('/')}>
          <div
            className="w-14 md:w-20 h-9 md:h-10 rounded-xl flex items-center justify-center border transition-colors"
            style={{
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,128,0,0.08)',
              borderColor:      darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,128,0,0.3)',
            }}
          >
            <span className="font-black text-sm md:text-base" style={{ color: darkMode ? 'inherit' : '#16a34a' }}>
              E-TEC
            </span>
          </div>
          <div className="hidden sm:block">
            <h1
              className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase leading-none opacity-90"
              style={{ color: darkMode ? 'inherit' : '#16a34a' }}
            >
              Education in Training Employments and Communication
            </h1>
            <p className="text-xs font-black tracking-wider uppercase mt-0.5" style={{ color: darkMode ? 'inherit' : '#15803d' }}>
              Faravohitra
            </p>
          </div>
        </div>

        {/* LIENS DESKTOP */}
        {!searchOpen && (
          <ul className="hidden lg:flex gap-6 xl:gap-8 text-[11px] font-bold uppercase tracking-wider items-center">
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.label}
                link={link}
                darkMode={darkMode}
                onClick={() => handleNavigation(link.path)}
              />
            ))}
          </ul>
        )}

        {/* DROITE */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 lg:flex-initial justify-end">

          {/* Barre de recherche */}
          <div ref={searchBoxRef} className="relative flex items-center">
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-300 w-full sm:w-64 md:w-72"
                style={{
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                  borderColor: 'var(--border)',
                }}
              >
                <Search size={15} className="opacity-50 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher sur E-TEC..."
                  className="flex-1 bg-transparent outline-none text-xs min-w-0"
                  style={{ color: 'var(--text)' }}
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="shrink-0 opacity-50 hover:opacity-90 transition cursor-pointer"
                  aria-label="Fermer la recherche"
                >
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="cursor-pointer opacity-70 hover:opacity-100 transition p-1"
                aria-label="Ouvrir la recherche"
              >
                <Search size={15} />
              </button>
            )}
          </div>

          {/* Bouton Connexion — masqué hors période scolaire ET hors recherche */}
          {!searchOpen && connexionVisible && (
            <button
              onClick={() => handleNavigation('/log_in')}
              className="hidden sm:block text-[11px] font-bold px-3 md:px-4 py-2 rounded-xl border transition-all duration-300 cursor-pointer shrink-0"
              style={{
                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                borderColor:      darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                color: 'var(--text)',
              }}
            >
              Connexion
            </button>
          )}

          {/* Burger mobile */}
          {!searchOpen && (
            <button
              className="lg:hidden p-2 rounded-xl border transition-all shrink-0"
              style={{
                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                borderColor:      darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                color: 'var(--text)',
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Ouvrir le menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </nav>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div
          className="fixed top-[82px] left-0 right-0 z-40 lg:hidden shadow-xl border-b overflow-y-auto max-h-[80vh]"
          style={{ backgroundColor: mobileBg, borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          <ul className="flex flex-col py-2 px-6">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <div
                  className={`flex items-center justify-between py-3 text-sm font-bold uppercase tracking-wider border-b cursor-pointer transition ${
                    link.active ? 'text-amber-500' : 'opacity-75'
                  }`}
                  style={{ borderColor: 'var(--border)' }}
                  onClick={() => {
                    if (link.submenu) {
                      setMobileExpanded(mobileExpanded === link.label ? null : link.label);
                    } else {
                      handleNavigation(link.path);
                    }
                  }}
                >
                  <span>{link.label}</span>
                  {link.submenu && (
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200"
                      style={{ transform: mobileExpanded === link.label ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  )}
                </div>

                {link.submenu && mobileExpanded === link.label && (
                  <ul className="pl-4 py-1 space-y-0.5">
                    {link.submenu.map((sub, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 py-2.5 text-xs font-semibold tracking-wide cursor-pointer opacity-80 hover:opacity-100 transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span>{sub.icon}</span>
                        <span>{sub.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {/* Connexion mobile — même condition de période scolaire */}
            {connexionVisible && (
              <li className="pt-4 pb-4 flex justify-center sm:hidden">
                <button
                  onClick={() => handleNavigation('/log_in')}
                  className="w-full text-center text-[11px] font-bold px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                    color: 'var(--text)',
                  }}
                >
                  Connexion
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}