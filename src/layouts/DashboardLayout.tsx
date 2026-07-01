import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Calendar,
  FileText, Bell, Settings, LogOut, Menu, ChevronDown,
  TrendingUp, UserCheck, ClipboardList, Building2, Sun, Moon,
  Search, ChevronRight,
} from 'lucide-react';

// ─── Navigation avec paths réels ─────────────────────────
const NAV_ITEMS = [
  {
    icon: <LayoutDashboard size={18} />,
    label: 'Tableau de bord',
    path: '/admin',
  },
  {
    icon: <Users size={18} />,
    label: 'Étudiants',
    path: '/admin/etudiants',
    badge: 12,
    children: [
      { label: 'Liste des étudiants', path: '/admin/etudiants' },
      { label: 'Inscriptions',        path: '/admin/etudiants/inscriptions' },
      { label: 'Résultats',           path: '/admin/etudiants/resultats' },
    ],
  },
  {
    icon: <UserCheck size={18} />,
    label: 'Enseignants',
    path: '/admin/enseignants',
    children: [
      { label: 'Liste des enseignants', path: '/admin/Enseignant/AdmineEnseignants' },
      { label: 'Emplois du temps',      path: '/admin/Enseignant/EmploisDTemps' },
    ],
  },
  {
    icon: <BookOpen size={18} />,
    label: 'Formations',
    path: '/admin/formations',
    children: [
      { label: 'Filières',    path: '/admin/Formations/Filiers' },
      { label: 'Programmes',  path: '/admin/Formations/Programmes' },
      { label: 'Modules',     path: '/admin/Formations/Modules' },
    ],
  },
  { icon: <Calendar size={18} />,      label: 'Emploi du temps',  path: '/admin/edt' },
  { icon: <ClipboardList size={18} />, label: 'Notes & Résultats', path: '/admin/Notes&Resultats', badge: 3 },
  { icon: <FileText size={18} />,      label: 'Actualités',        path: '/admin/actualites' },
  { icon: <Building2 size={18} />,     label: 'Campus',            path: '/admin/campus' },
  { icon: <TrendingUp size={18} />,    label: 'Statistiques',      path: '/admin/statistiques' },
  { icon: <Bell size={18} />,          label: 'Notifications',     path: '/admin/notifications', badge: 5 },
  { icon: <Settings size={18} />,      label: 'Paramètres',        path: '/admin/parametres' },
];

type NavItem = typeof NAV_ITEMS[number];

// ─── Sidebar Item ─────────────────────────────────────────
function SidebarItem({ item, active, onSelect, darkMode, collapsed }: {
  item: NavItem; active: string; onSelect: (path: string) => void;
  darkMode: boolean; collapsed: boolean;
}) {
  const isActive = active === item.path ||
    item.children?.some(c => active.startsWith(c.path));

  const [open, setOpen] = useState(isActive);

  const base = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer';

  return (
    <li>
      <button
        className={base}
        style={{
          backgroundColor: isActive
            ? (darkMode ? 'rgba(0,180,0,0.18)' : 'rgba(0,128,0,0.10)')
            : 'transparent',
          color: isActive ? 'var(--primary)' : 'var(--text)',
          opacity: isActive ? 1 : 0.75,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
        onClick={() => {
          if (item.children && !collapsed) { setOpen(o => !o); }
          else { onSelect(item.path); }
        }}
        title={collapsed ? item.label : undefined}
      >
        <span className="shrink-0">{item.icon}</span>
        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: 'var(--primary)' }}>
            {item.badge}
          </span>
        )}
        {!collapsed && item.children && (
          <ChevronDown size={13} className="transition-transform duration-200 shrink-0"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        )}
      </button>

      {/* Sous-menu */}
      {!collapsed && item.children && open && (
        <ul className="ml-4 mt-1 space-y-0.5 border-l pl-3"
          style={{ borderColor: 'var(--border)' }}>
          {item.children.map(child => (
            <li key={child.path}>
              <button
                className={base + ' py-2'}
                style={{
                  color: active === child.path ? 'var(--primary)' : 'var(--text)',
                  backgroundColor: active === child.path
                    ? (darkMode ? 'rgba(0,180,0,0.12)' : 'rgba(0,128,0,0.07)')
                    : 'transparent',
                  opacity: active === child.path ? 1 : 0.65,
                }}
                onClick={() => onSelect(child.path)}
              >
                <ChevronRight size={11} className="shrink-0 opacity-50" />
                {child.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

// ─── Main Layout ──────────────────────────────────────────
export default function DashboardLayout() {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);

  const sidebarBg = darkMode ? 'rgba(10,10,10,0.97)'  : 'rgba(255,255,255,0.98)';
  const topbarBg  = darkMode ? 'rgba(10,10,10,0.95)'  : 'rgba(255,255,255,0.95)';
  const contentBg = darkMode ? '#0d0d0d'              : '#f4f6f8';

  // Lien actif basé sur l'URL réelle
  const activeItem = NAV_ITEMS.find(i =>
    i.path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(i.path)
  );
  const activeLabel = activeItem?.label ?? 'Tableau de bord';
  const activePath  = location.pathname;

  const goTo = (path: string) => {
    navigate(path);
    setMobileSidebar(false);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b cursor-pointer"
        style={{ borderColor: 'var(--border)' }}
        onClick={() => goTo('/admin')}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
          style={{
            backgroundColor: darkMode ? 'rgba(0,180,0,0.15)' : 'rgba(0,128,0,0.10)',
            borderColor: darkMode ? 'rgba(0,180,0,0.3)' : 'rgba(0,128,0,0.25)',
          }}
        >
          <span className="font-black text-sm" style={{ color: 'var(--primary)' }}>E</span>
        </div>
        {sidebarOpen && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'var(--primary)' }}>E-TEC</p>
            <p className="text-[9px] opacity-50 uppercase tracking-wider">Administration</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(item => (
            <SidebarItem
              key={item.path}
              item={item}
              active={activePath}
              onSelect={goTo}
              darkMode={darkMode}
              collapsed={!sidebarOpen}
            />
          ))}
        </ul>
      </nav>

      {/* Profil admin */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:opacity-80 transition"
          onClick={() => goTo('/admin/parametres')}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0"
            style={{ backgroundColor: 'var(--primary)' }}>A</div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Administrateur</p>
              <p className="text-[10px] opacity-45 truncate">admin@etec.mg</p>
            </div>
          )}
          {sidebarOpen && (
            <button
              className="p-1.5 rounded-lg hover:opacity-70 transition cursor-pointer shrink-0"
              style={{ color: 'var(--text)' }}
              title="Déconnexion"
              onClick={(e) => { e.stopPropagation(); navigate('/log_in'); }}
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: contentBg, color: 'var(--text)' }}>

      {/* Sidebar desktop */}
      <aside
        className="hidden md:flex flex-col border-r transition-all duration-300 shrink-0"
        style={{ width: sidebarOpen ? '240px' : '68px', backgroundColor: sidebarBg, borderColor: 'var(--border)' }}
      >
        {SidebarContent}
      </aside>

      {/* Sidebar mobile overlay */}
      {mobileSidebar && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileSidebar(false)} />
          <aside className="fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r md:hidden"
            style={{ width: '260px', backgroundColor: sidebarBg, borderColor: 'var(--border)' }}>
            {SidebarContent}
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b shrink-0"
          style={{ backgroundColor: topbarBg, borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-xl border cursor-pointer transition hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              onClick={() => setMobileSidebar(true)}><Menu size={18} /></button>
            <button className="hidden md:flex p-2 rounded-xl border cursor-pointer transition hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs opacity-55">
              <span>Administration</span>
              <ChevronRight size={12} />
              <span className="font-bold opacity-100" style={{ color: 'var(--text)' }}>{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Recherche */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
              style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
              <Search size={13} className="opacity-40" />
              <input type="text" placeholder="Rechercher..."
                className="bg-transparent outline-none w-28 md:w-40 text-xs"
                style={{ color: 'var(--text)' }} />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 rounded-xl border cursor-pointer transition hover:opacity-70"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                onClick={() => setNotifOpen(o => !o)}>
                <Bell size={16} />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center"
                  style={{ backgroundColor: '#ef4444' }}>5</span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 rounded-2xl border shadow-2xl overflow-hidden w-72"
                  style={{ zIndex: 200, backgroundColor: sidebarBg, borderColor: 'var(--border)' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between"
                    style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs font-black uppercase tracking-wider">Notifications</span>
                    <button className="text-[10px] opacity-50 hover:opacity-80 cursor-pointer"
                      onClick={() => setNotifOpen(false)}>Tout lire</button>
                  </div>
                  {[
                    { msg: '12 nouvelles inscriptions en attente', time: 'Il y a 5 min',  dot: '#22c55e' },
                    { msg: 'Résultats S1 publiés — Dept. Info',    time: 'Il y a 1h',    dot: '#3b82f6' },
                    { msg: '3 dossiers à valider — BTP',           time: 'Il y a 2h',    dot: '#f59e0b' },
                    { msg: 'Nouveau message de la scolarité',       time: 'Hier',         dot: '#8b5cf6' },
                    { msg: 'Mise à jour du calendrier académique',  time: 'Hier',         dot: '#6b7280' },
                  ].map((n, i) => (
                    <div key={i}
                      className="flex items-start gap-3 px-4 py-3 border-b cursor-pointer hover:opacity-70 transition"
                      style={{ borderColor: 'var(--border)' }}
                      onClick={() => { goTo('/admin/notifications'); setNotifOpen(false); }}>
                      <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: n.dot }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-snug">{n.msg}</p>
                        <p className="text-[10px] opacity-40 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thème */}
            <button onClick={toggleTheme}
              className="p-2 rounded-xl border cursor-pointer transition hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              {darkMode
                ? <Sun size={16} className="text-amber-400" />
                : <Moon size={16} className="text-slate-600" />}
            </button>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white cursor-pointer"
              style={{ backgroundColor: 'var(--primary)' }}
              onClick={() => goTo('/admin/parametres')}
            >A</div>
          </div>
        </header>

        {/* ── CONTENU : rendu par la route active ─── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}