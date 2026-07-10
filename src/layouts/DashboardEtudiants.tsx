import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import ApiService from '../services/ApiService';
import {
  LayoutDashboard, BookOpen, Calendar, FileText, Bell, MessageSquare,
  Settings, LogOut, Menu, Sun, Moon,
  Search, ChevronRight, GraduationCap, ClipboardList, TrendingUp, Loader2
} from 'lucide-react';

type NavItem = { icon: React.ReactNode; key: string; path: string; badge?: number };

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, key: 'home', path: '/etudiants' },
  { icon: <ClipboardList size={18} />, key: 'notes', path: '/etudiants/notes' },
  { icon: <Calendar size={18} />, key: 'schedule', path: '/etudiants/edt' },
  { icon: <BookOpen size={18} />, key: 'courses', path: '/etudiants/cours' },
  { icon: <FileText size={18} />, key: 'documents', path: '/etudiants/documents' },
  { icon: <TrendingUp size={18} />, key: 'results', path: '/etudiants/resultats' },
  { icon: <MessageSquare size={18} />, key: 'messages', path: '/etudiants/messages' },
  { icon: <Bell size={18} />, key: 'notifications', path: '/etudiants/notifications', badge: 3 },
  { icon: <Settings size={18} />, key: 'settings', path: '/etudiants/parametres' },
];

function SidebarItem({ item, isActive, onSelect, darkMode, collapsed, badgeCount, label }: {
  item: NavItem;
  isActive: boolean;
  onSelect: () => void;
  darkMode: boolean;
  collapsed: boolean;
  badgeCount?: number;
  label: string;
}) {
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
        onClick={onSelect}
        title={collapsed ? label : undefined}
      >
        <span className="shrink-0">{item.icon}</span>
        {!collapsed && <span className="flex-1 text-left">{label}</span>}
        {!collapsed && badgeCount && badgeCount > 0 ? (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: '#ef4444' }}>{badgeCount}</span>
        ) : null}
      </button>
    </li>
  );
}

export default function DashboardEtudiant() {
  const { darkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [etudiant, setEtudiant] = useState<{ nom: string; prenom: string; matricule: string; niveau: string } | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: number; msg: string; time: string; dot: string; lu: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sidebarBg = darkMode ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.98)';
  const topbarBg = darkMode ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.95)';
  const contentBg = darkMode ? '#0d0d0d' : '#f4f6f8';

  const getRequestConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } };
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      const config = getRequestConfig();
      try {
        if (ApiService.etudiant?.getProfile) {
          const profileRes = await ApiService.etudiant.getProfile(config);
          if (profileRes && profileRes.data) {
            setEtudiant({
              nom: profileRes.data.nom || 'RAKOTO',
              prenom: profileRes.data.prenom || 'Andry',
              matricule: profileRes.data.matricule || 'ETU-2024-0042',
              niveau: profileRes.data.niveau || 'L3 Info',
            });
          }
        } else {
          setEtudiant({ nom: 'RAKOTO', prenom: 'Andry', matricule: 'ETU-2024-0042', niveau: 'L3 Info' });
        }

        if (ApiService.notifications?.getAll) {
          const notifRes = await ApiService.notifications.getAll(config);
          if (notifRes && notifRes.data) {
            const mappedNotifs = notifRes.data.map((n: any) => ({
              id: n.id,
              msg: n.message || n.msg || '',
              time: n.time || 'Récemment',
              dot: n.type === 'error' ? '#ef4444' : n.type === 'warning' ? '#f59e0b' : '#3b82f6',
              lu: !!n.lu,
            }));
            setNotifications(mappedNotifs);
          }
        } else {
          setNotifications([
            { id: 1, msg: 'Note de BDD publiée : 17/20', time: 'Il y a 10 min', dot: '#22c55e', lu: false },
            { id: 2, msg: 'Emploi du temps S2 mis à jour', time: 'Il y a 2h', dot: '#3b82f6', lu: false },
            { id: 3, msg: 'Rappel : TP Réseaux demain 08h00', time: 'Hier', dot: '#f59e0b', lu: false },
          ]);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données du tableau de bord:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const activeItem = NAV_ITEMS.find((item) => item.path === '/etudiants' ? location.pathname === '/etudiants' : location.pathname.startsWith(item.path));
  const goTo = (path: string) => {
    navigate(path);
    setMobileSidebar(false);
  };

  const unreadCount = notifications.filter((n) => !n.lu).length;
  const navItems = NAV_ITEMS.map((item) => ({ ...item, label: t(`dashboard.student.layout.${item.key}`) }));
  const activeLabel = activeItem ? t(`dashboard.student.layout.${activeItem.key}`) : t('dashboard.student.layout.space');

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b cursor-pointer" style={{ borderColor: 'var(--border)' }} onClick={() => goTo('/etudiants')}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0" style={{ backgroundColor: darkMode ? 'rgba(0,180,0,0.15)' : 'rgba(0,128,0,0.10)', borderColor: darkMode ? 'rgba(0,180,0,0.3)' : 'rgba(0,128,0,0.25)' }}>
          <GraduationCap size={18} style={{ color: 'var(--primary)' }} />
        </div>
        {sidebarOpen && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'var(--primary)' }}>E-TEC</p>
            <p className="text-[9px] opacity-50 uppercase tracking-wider">{t('dashboard.student.layout.space')}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={activeItem?.path === item.path} onSelect={() => goTo(item.path)} darkMode={darkMode} collapsed={!sidebarOpen} badgeCount={item.path === '/etudiants/notifications' ? unreadCount : undefined} label={item.label} />
          ))}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:opacity-80 transition" onClick={() => goTo('/etudiants/parametres')}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0 bg-blue-500">
            {etudiant ? etudiant.prenom.charAt(0) : 'R'}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="h-3 w-24 bg-black/10 dark:bg-white/10 animate-pulse rounded" />
              ) : (
                <>
                  <p className="text-xs font-bold truncate">{etudiant?.nom} {etudiant?.prenom}</p>
                  <p className="text-[10px] opacity-45 truncate">{etudiant?.matricule} · {etudiant?.niveau}</p>
                </>
              )}
            </div>
          )}
          {sidebarOpen && (
            <button className="p-1.5 rounded-lg hover:opacity-70 transition cursor-pointer shrink-0" style={{ color: 'var(--text)' }} title={t('dashboard.shared.logout')} onClick={(e) => { e.stopPropagation(); localStorage.removeItem('token'); localStorage.removeItem('etec_access_token'); localStorage.removeItem('etec_refresh_token'); localStorage.removeItem('userId'); localStorage.removeItem('etec_user_id'); localStorage.removeItem('role'); localStorage.removeItem('etec_user_role'); navigate('/log_in'); }}>
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
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b shrink-0" style={{ backgroundColor: topbarBg, borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-xl border cursor-pointer transition hover:opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} onClick={() => setMobileSidebar(true)}><Menu size={18} /></button>
            <button className="hidden md:flex p-2 rounded-xl border cursor-pointer transition hover:opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} onClick={() => setSidebarOpen((value) => !value)}><Menu size={16} /></button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs opacity-55">
              <span>{t('dashboard.shared.studentSpace')}</span>
              <ChevronRight size={12} />
              <span className="font-bold opacity-100" style={{ color: 'var(--text)' }}>{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs" style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
              <Search size={13} className="opacity-40" />
              <input type="text" placeholder={t('dashboard.shared.searchPlaceholder')} className="bg-transparent outline-none w-28 md:w-36 text-xs" style={{ color: 'var(--text)' }} />
            </div>

            <div className="relative">
              <button className="relative p-2 rounded-xl border cursor-pointer transition hover:opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} onClick={() => setNotifOpen((value) => !value)}>
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center animate-pulse" style={{ backgroundColor: '#ef4444' }}>{unreadCount}</span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 rounded-2xl border shadow-2xl overflow-hidden w-72" style={{ zIndex: 200, backgroundColor: sidebarBg, borderColor: 'var(--border)' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs font-black uppercase tracking-wider">{t('dashboard.shared.notifications')}</span>
                    <button className="text-[10px] opacity-50 hover:opacity-80 cursor-pointer" onClick={() => setNotifications(notifications.map((n) => ({ ...n, lu: true })))}>{t('dashboard.shared.markAllRead')}</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center opacity-40 text-[11px]">{t('dashboard.shared.noNotifications')}</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition ${!n.lu ? 'bg-black/5 dark:bg-white/5' : 'hover:opacity-70'}`} style={{ borderColor: 'var(--border)' }} onClick={() => { goTo('/etudiants/notifications'); setNotifOpen(false); }}>
                          <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: n.dot }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs leading-snug font-medium">{n.msg}</p>
                            <p className="text-[10px] opacity-40 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <LanguageSwitcher />

            <button onClick={toggleTheme} className="p-2 rounded-xl border cursor-pointer transition hover:opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
            </button>

            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white cursor-pointer bg-blue-500" onClick={() => goTo('/etudiants/parametres')}>
              {etudiant ? etudiant.prenom.charAt(0) : 'R'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
