import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import { NotificationsService } from '../services/ApiService';
import {
  LayoutDashboard, Users, BookOpen, Calendar,
  FileText, Bell, Settings, LogOut, Menu, ChevronDown,
  TrendingUp, UserCheck, ClipboardList, Sun, Moon,
  Search, ChevronRight, Presentation, Landmark, ClipboardCheck, MessageSquare, LibraryBig
} from 'lucide-react';

type ChildItem = { key: string; path: string; label?: string };
type NavItem = { icon: React.ReactNode; key: string; path: string; badge?: number; label?: string; children?: ChildItem[] };

type CurrentUser = {
  nom?: string;
  prenom?: string;
  email?: string;
  role?: string;
};

type NotificationItem = {
  id: string | number;
  titre?: string;
  message?: string;
  description?: string;
  date?: string;
  lu?: boolean;
};

const NAV_CONFIG: Array<Omit<NavItem, 'icon'> & { icon: React.ReactNode }> = [
  { icon: <LayoutDashboard size={18} />, key: 'home', path: '/admin' },
  { icon: <Presentation size={18} />, key: 'slides', path: '/admin/slide' },
  { icon: <Landmark size={18} />, key: 'university', path: '/admin/universite', children: [
    { key: 'organigram', path: '/admin/universite/organigramme' },
    { key: 'history', path: '/admin/universite/historique' },
    { key: 'president', path: '/admin/universite/mpresidents' },
  ]},
  { icon: <Users size={18} />, key: 'students', path: '/admin/etudiants', children: [
    { key: 'studentList', path: '/admin/etudiants' },
    { key: 'admissions', path: '/admin/etudiants/inscriptions' },
    { key: 'results', path: '/admin/etudiants/resultats' },
  ]},
  { icon: <UserCheck size={18} />, key: 'teachers', path: '/admin/enseignants', children: [
    { key: 'teacherList', path: '/admin/Enseignant/AdmineEnseignants' },
    { key: 'schedules', path: '/admin/Enseignant/EmploisDTemps' },
  ]},
  { icon: <BookOpen size={18} />, key: 'formations', path: '/admin/formations', children: [
    { key: 'initialTraining', path: '/admin/Formations/formationinitiale' },
    { key: 'continuingTraining', path: '/admin/Formations/formationcontinu' },
    { key: 'onlineTraining', path: '/admin/Formations/formationenligne' },
    { key: 'assignments', path: '/admin/Formations/devoir' },
    { key: 'quiz', path: '/admin/Formations/quiz' },
    { key: 'filieres', path: '/admin/Formations/Filiers' },
    { key: 'programs', path: '/admin/Formations/Programmes' },
    { key: 'modules', path: '/admin/Formations/Modules' },
    { key: 'courses', path: '/admin/Formations/Coures' },
  ]},
  { icon: <LibraryBig size={18} />, key: 'digitalLibrary', path: '/admin/bibliotheque' },
  { icon: <Calendar size={18} />, key: 'schedule', path: '/admin/edt' },
  { icon: <ClipboardList size={18} />, key: 'notesResults', path: '/admin/Notes&Resultats' },
  { icon: <FileText size={18} />, key: 'news', path: '/admin/actualites' },
  { icon: <MessageSquare size={18} />, key: 'messages', path: '/admin/messages' },
  { icon: <TrendingUp size={18} />, key: 'statistics', path: '/admin/statistiques' },
  { icon: <ClipboardCheck size={18} />, key: 'enrollmentOpen', path: '/admin/iouverts' },
  { icon: <Bell size={18} />, key: 'notifications', path: '/admin/notifications' },
  { icon: <Settings size={18} />, key: 'settings', path: '/admin/parametres' },
];

function SidebarItem({ item, active, onSelect, darkMode, collapsed, label, childLabels }: {
  item: NavItem;
  active: string;
  onSelect: (path: string) => void;
  darkMode: boolean;
  collapsed: boolean;
  label: string;
  childLabels?: Record<string, string>;
}) {
  const isActive = active === item.path || item.children?.some((c) => active.startsWith(c.path));
  const [open, setOpen] = useState(isActive);
  const base = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer';

  return (
    <li>
      <button
        className={base}
        style={{
          backgroundColor: isActive ? (darkMode ? 'rgba(0,180,0,0.18)' : 'rgba(0,128,0,0.10)') : 'transparent',
          color: isActive ? 'var(--primary)' : 'var(--text)',
          opacity: isActive ? 1 : 0.75,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
        onClick={() => {
          if (item.children && !collapsed) {
            setOpen((value) => !value);
          } else {
            onSelect(item.path);
          }
        }}
        title={collapsed ? label : undefined}
      >
        <span className="shrink-0">{item.icon}</span>
        {!collapsed && <span className="flex-1 text-left truncate">{label}</span>}
        {!collapsed && !!item.badge && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--primary)' }}>
            {item.badge}
          </span>
        )}
        {!collapsed && item.children && (
          <ChevronDown size={13} className="transition-transform duration-200 shrink-0" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        )}
      </button>
      {!collapsed && item.children && open && (
        <ul className="ml-4 mt-1 space-y-0.5 border-l pl-3" style={{ borderColor: 'var(--border)' }}>
          {item.children.map((child) => (
            <li key={child.path}>
              <button
                className={base + ' py-2'}
                style={{
                  color: active === child.path ? 'var(--primary)' : 'var(--text)',
                  backgroundColor: active === child.path ? (darkMode ? 'rgba(0,180,0,0.12)' : 'rgba(0,128,0,0.07)') : 'transparent',
                  opacity: active === child.path ? 1 : 0.65,
                }}
                onClick={() => onSelect(child.path)}
              >
                <ChevronRight size={11} className="shrink-0 opacity-50" />
                <span className="truncate text-left flex-1">{childLabels?.[child.key] ?? child.key}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function DashboardLayout() {
  const { darkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);

  // --- Utilisateur connecté (récupéré depuis localStorage après le login) ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        setCurrentUser(JSON.parse(raw));
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  // --- Notifications réelles ---
  useEffect(() => {
    let cancelled = false;
    setNotifLoading(true);
    NotificationsService.getAll()
      .then((data: NotificationItem[]) => {
        if (!cancelled) setNotifications(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      })
      .finally(() => {
        if (!cancelled) setNotifLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.lu).length;

  const displayName = useMemo(() => {
    if (!currentUser) return t('dashboard.shared.administration');
    const full = [currentUser.prenom, currentUser.nom].filter(Boolean).join(' ');
    return full || currentUser.email || t('dashboard.shared.administration');
  }, [currentUser, t]);

  const displayEmail = currentUser?.email ?? '';
  const avatarLetter = (currentUser?.prenom || currentUser?.nom || currentUser?.email || 'A').charAt(0).toUpperCase();

  const sidebarBg = darkMode ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.98)';
  const topbarBg = darkMode ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.95)';
  const contentBg = darkMode ? '#0d0d0d' : '#f4f6f8';
  const activePath = location.pathname;

  const navItems = useMemo<NavItem[]>(() => NAV_CONFIG.map((item) => ({
    ...item,
    badge: item.key === 'notifications' ? (unreadCount || undefined) : item.badge,
    label: t(`dashboard.admin.layout.${item.key}`),
    children: item.children?.map((child) => ({ ...child, label: t(`dashboard.admin.layout.${child.key}`) })),
  })) as NavItem[], [t, unreadCount]);

  const activeItem = navItems.find((item) => item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path));
  const activeLabel = activeItem ? t(`dashboard.admin.layout.${activeItem.key}`) : t('dashboard.admin.layout.home');

  const goTo = (path: string) => {
    navigate(path);
    setMobileSidebar(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('isConnected');
    navigate('/log_in');
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b cursor-pointer" style={{ borderColor: 'var(--border)' }} onClick={() => goTo('/admin')}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0" style={{ backgroundColor: darkMode ? 'rgba(0,180,0,0.15)' : 'rgba(0,128,0,0.10)', borderColor: darkMode ? 'rgba(0,180,0,0.3)' : 'rgba(0,128,0,0.25)' }}>
          <span className="font-black text-sm" style={{ color: 'var(--primary)' }}>E</span>
        </div>
        {sidebarOpen && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'var(--primary)' }}>E-TEC</p>
            <p className="text-[9px] opacity-50 uppercase tracking-wider">{t('dashboard.shared.administration')}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              active={activePath}
              onSelect={goTo}
              darkMode={darkMode}
              collapsed={!sidebarOpen}
              label={item.label}
              childLabels={Object.fromEntries((item.children ?? []).map((child) => [child.key, child.label]))}
            />
          ))}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:opacity-80 transition" onClick={() => goTo('/admin/parametres')}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0" style={{ backgroundColor: 'var(--primary)' }}>{avatarLetter}</div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{displayName}</p>
              <p className="text-[10px] opacity-45 truncate">{displayEmail}</p>
            </div>
          )}
          {sidebarOpen && (
            <button className="p-1.5 rounded-lg hover:opacity-70 transition cursor-pointer shrink-0" style={{ color: 'var(--text)' }} title={t('dashboard.shared.logout')} onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: contentBg, color: 'var(--text)' }}>
      <aside className="hidden md:flex flex-col border-r transition-all duration-300 shrink-0" style={{ width: sidebarOpen ? '240px' : '68px', backgroundColor: sidebarBg, borderColor: 'var(--border)' }}>
        {SidebarContent}
      </aside>

      {mobileSidebar && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileSidebar(false)} />
          <aside className="fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r md:hidden" style={{ width: '260px', backgroundColor: sidebarBg, borderColor: 'var(--border)' }}>
            {SidebarContent}
          </aside>
        </>
      )}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-4 md:px-6 h-[60px] border-b shrink-0" style={{ backgroundColor: topbarBg, borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-xl border cursor-pointer transition hover:opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} onClick={() => setMobileSidebar(true)}><Menu size={18} /></button>
            <button className="hidden md:flex p-2 rounded-xl border cursor-pointer transition hover:opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} onClick={() => setSidebarOpen((value) => !value)}><Menu size={16} /></button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs opacity-55">
              <span>{t('dashboard.shared.administration')}</span>
              <ChevronRight size={12} />
              <span className="font-bold opacity-100 truncate max-w-[150px]" style={{ color: 'var(--text)' }}>{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs" style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
              <Search size={13} className="opacity-40" />
              <input type="text" placeholder={t('dashboard.shared.searchPlaceholder')} className="bg-transparent outline-none w-28 md:w-40 text-xs" style={{ color: 'var(--text)' }} />
            </div>

            <div className="relative">
              <button className="relative p-2 rounded-xl border cursor-pointer transition hover:opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} onClick={() => setNotifOpen((value) => !value)}>
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 rounded-2xl border shadow-2xl overflow-hidden w-72" style={{ zIndex: 200, backgroundColor: sidebarBg, borderColor: 'var(--border)' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs font-black uppercase tracking-wider">{t('dashboard.shared.notifications')}</span>
                    <button
                      className="text-[10px] opacity-50 hover:opacity-80 cursor-pointer"
                      onClick={() => {
                        setNotifOpen(false);
                        goTo('/admin/notifications');
                      }}
                    >
                      {t('dashboard.shared.markAllRead')}
                    </button>
                  </div>

                  {notifLoading && (
                    <div className="px-4 py-6 text-center text-xs opacity-50">…</div>
                  )}

                  {!notifLoading && notifications.length === 0 && (
                    <div className="px-4 py-6 text-center text-xs opacity-50">
                      {t('dashboard.shared.noNotifications', 'Aucune notification')}
                    </div>
                  )}

                  {!notifLoading && notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 border-b cursor-pointer hover:opacity-70 transition"
                      style={{ borderColor: 'var(--border)' }}
                      onClick={() => { goTo('/admin/notifications'); setNotifOpen(false); }}
                    >
                      <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: n.lu ? '#6b7280' : 'var(--primary)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-snug">{n.titre ?? n.message ?? n.description}</p>
                        {n.date && <p className="text-[10px] opacity-40 mt-0.5">{n.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <LanguageSwitcher />

            <button onClick={toggleTheme} className="p-2 rounded-xl border cursor-pointer transition hover:opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
            </button>

            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white cursor-pointer" style={{ backgroundColor: 'var(--primary)' }} onClick={() => goTo('/admin/parametres')}>{avatarLetter}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
