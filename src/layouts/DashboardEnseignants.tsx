import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import {
  LayoutDashboard, BookOpen, Calendar, FileText, Bell, MessageSquare,
  Settings, LogOut, Menu, ChevronRight, Sun, Moon,
  Search, Users, GraduationCap, FileCheck
} from 'lucide-react';

type NavItem = { icon: React.ReactNode; key: string; path: string; badge?: number };

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, key: 'home', path: '/enseignants' },
  { icon: <BookOpen size={18} />, key: 'courses', path: '/enseignants/Cours' },
  { icon: <Users size={18} />, key: 'classes', path: '/enseignants/Niveaux' },
  { icon: <Calendar size={18} />, key: 'schedule', path: '/enseignants/EDTE' },
  { icon: <FileCheck size={18} />, key: 'evaluations', path: '/enseignants/Evaluations' },
  { icon: <FileText size={18} />, key: 'resources', path: '/enseignants/Ressource' },
  { icon: <MessageSquare size={18} />, key: 'messages', path: '/enseignants/Messages' },
  { icon: <Bell size={18} />, key: 'notifications', path: '/enseignants/Notification', badge: 2 },
  { icon: <Settings size={18} />, key: 'settings', path: '/enseignants/Parametre' },
];

function SidebarItem({ item, active, onSelect, darkMode, collapsed, label }: {
  item: NavItem;
  active: string;
  onSelect: () => void;
  darkMode: boolean;
  collapsed: boolean;
  label: string;
}) {
  const isActive = active === item.path;
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
        {!collapsed && item.badge && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--primary)' }}>{item.badge}</span>
        )}
      </button>
    </li>
  );
}

export default function DashboardEnseignantsLayout() {
  const { darkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = location.pathname;

  const sidebarBg = darkMode ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.98)';
  const topbarBg = darkMode ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.95)';
  const contentBg = darkMode ? '#0d0d0d' : '#f4f6f8';

  const goTo = (path: string) => {
    navigate(path);
    setMobileSidebar(false);
  };

  const navItems = NAV_ITEMS.map((item) => ({ ...item, label: t(`dashboard.teacher.layout.${item.key}`) }));
  const activeLabel = navItems.find((item) => item.path === activeKey)?.label ?? t('dashboard.teacher.layout.space');

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0" style={{ backgroundColor: darkMode ? 'rgba(0,180,0,0.15)' : 'rgba(0,128,0,0.10)', borderColor: darkMode ? 'rgba(0,180,0,0.3)' : 'rgba(0,128,0,0.25)' }}>
          <GraduationCap size={18} style={{ color: 'var(--primary)' }} />
        </div>
        {sidebarOpen && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'var(--primary)' }}>E-TEC</p>
            <p className="text-[9px] opacity-50 uppercase tracking-wider">{t('dashboard.teacher.layout.space')}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem key={item.key} item={item} active={activeKey} onSelect={() => goTo(item.path)} darkMode={darkMode} collapsed={!sidebarOpen} label={item.label} />
          ))}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:opacity-80 transition">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0" style={{ backgroundColor: '#22c55e' }}>M</div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Dr. MIARITSOA</p>
              <p className="text-[10px] opacity-45 truncate">Enseignant Chercheur</p>
            </div>
          )}
          {sidebarOpen && (
            <button className="p-1.5 rounded-lg hover:opacity-70 transition cursor-pointer shrink-0" style={{ color: 'var(--text)' }} title={t('dashboard.shared.logout')}>
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
              <span>{t('dashboard.shared.teacherSpace')}</span>
              <ChevronRight size={12} />
              <span className="font-bold opacity-100" style={{ color: 'var(--text)' }}>{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs" style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
              <Search size={13} className="opacity-40" />
              <input type="text" placeholder={t('dashboard.shared.searchPlaceholder')} className="bg-transparent outline-none w-28 md:w-44 text-xs" style={{ color: 'var(--text)' }} />
            </div>

            <div className="relative">
              <button className="relative p-2 rounded-xl border cursor-pointer transition hover:opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} onClick={() => setNotifOpen((value) => !value)}>
                <Bell size={16} />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>2</span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 rounded-2xl border shadow-2xl overflow-hidden w-72" style={{ zIndex: 200, backgroundColor: sidebarBg, borderColor: 'var(--border)' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs font-black uppercase tracking-wider">{t('dashboard.shared.notifications')}</span>
                    <button className="text-[10px] opacity-50 hover:opacity-80 cursor-pointer" onClick={() => setNotifOpen(false)}>{t('dashboard.shared.markAllRead')}</button>
                  </div>
                  {[
                    { msg: 'Rendu de TP : 45 nouvelles copies (Web L3)', time: 'Il y a 30 min', dot: '#3b82f6' },
                    { msg: 'Conseil des professeurs prévu ce vendredi', time: 'Hier', dot: '#f59e0b' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 border-b cursor-pointer hover:opacity-70 transition" style={{ borderColor: 'var(--border)' }}>
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

            <LanguageSwitcher />

            <button onClick={toggleTheme} className="p-2 rounded-xl border cursor-pointer transition hover:opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
            </button>

            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white cursor-pointer" style={{ backgroundColor: '#22c55e' }}>M</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
