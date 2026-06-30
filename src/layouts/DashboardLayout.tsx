import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Calendar,
  FileText, Bell, Settings, LogOut, Menu, X, ChevronDown,
  TrendingUp, UserCheck, ClipboardList, Building2, Sun, Moon,
  Search, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

// ─── Data pour les charts ─────────────────────────────────
const inscriptionsData = [
  { mois: 'Jan', etudiants: 820,  enseignants: 12 },
  { mois: 'Fév', etudiants: 950,  enseignants: 8  },
  { mois: 'Mar', etudiants: 1100, enseignants: 15 },
  { mois: 'Avr', etudiants: 980,  enseignants: 6  },
  { mois: 'Mai', etudiants: 1250, enseignants: 18 },
  { mois: 'Juin',etudiants: 1480, enseignants: 22 },
  { mois: 'Juil',etudiants: 1200, enseignants: 10 },
  { mois: 'Août',etudiants: 900,  enseignants: 5  },
  { mois: 'Sep', etudiants: 1600, enseignants: 30 },
  { mois: 'Oct', etudiants: 1750, enseignants: 20 },
  { mois: 'Nov', etudiants: 1400, enseignants: 14 },
  { mois: 'Déc', etudiants: 1100, enseignants: 9  },
];

const filiereData = [
  { name: 'Génie Logiciel', value: 3820, color: '#3b82f6' },
  { name: 'Administration',  value: 2940, color: '#22c55e' },
  { name: 'BTP',             value: 2100, color: '#f59e0b' },
  { name: 'Électroméca.',    value: 1680, color: '#8b5cf6' },
];

const tauxReussiteData = [
  { filiere: 'Info',  s1: 78, s2: 82 },
  { filiere: 'Admin', s1: 85, s2: 88 },
  { filiere: 'BTP',   s1: 72, s2: 76 },
  { filiere: 'Elec',  s1: 80, s2: 84 },
];

const insertionData = [
  { annee: '2021', taux: 88 },
  { annee: '2022', taux: 91 },
  { annee: '2023', taux: 94 },
  { annee: '2024', taux: 96 },
  { annee: '2025', taux: 97 },
  { annee: '2026', taux: 98 },
];

// ─── Types ────────────────────────────────────────────────
interface NavItem {
  icon: React.ReactNode;
  label: string;
  key: string;
  badge?: number;
  children?: { label: string; key: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard size={18} />, label: 'Tableau de bord', key: 'dashboard' },
  {
    icon: <Users size={18} />, label: 'Étudiants', key: 'etudiants', badge: 12,
    children: [
      { label: 'Liste des étudiants', key: 'etudiants-liste' },
      { label: 'Inscriptions',        key: 'etudiants-inscriptions' },
      { label: 'Résultats',           key: 'etudiants-resultats' },
      { label: 'Emplois du temps',    key: 'emploies_du_temps' },
    ],
  },
  {
    icon: <UserCheck size={18} />, label: 'Enseignants', key: 'enseignants',
    children: [
      { label: 'Liste des enseignants', key: 'enseignants-liste' },
      { label: 'Emplois du temps',      key: 'enseignants-edt' },
    ],
  },
  {
    icon: <BookOpen size={18} />, label: 'Formations', key: 'formations',
    children: [
      { label: 'Filières',    key: 'formations-filieres' },
      { label: 'Programmes',  key: 'formations-programmes' },
      { label: 'Modules',     key: 'formations-modules' },
    ],
  },
  { icon: <Calendar size={18} />,     label: 'Emploi du temps',  key: 'emploi-du-temps' },
  { icon: <ClipboardList size={18} />,label: 'Notes & Résultats', key: 'notes', badge: 3 },
  { icon: <FileText size={18} />,     label: 'Actualités',        key: 'actualites' },
  { icon: <Building2 size={18} />,    label: 'Campus',            key: 'campus' },
  { icon: <TrendingUp size={18} />,   label: 'Statistiques',      key: 'statistiques' },
  { icon: <Bell size={18} />,         label: 'Notifications',     key: 'notifications', badge: 5 },
  { icon: <Settings size={18} />,     label: 'Paramètres',        key: 'parametres' },
];

// ─── Stat Card ────────────────────────────────────────────
function StatCard({ icon, label, value, delta, color }: {
  icon: React.ReactNode; label: string; value: string; delta: string; color: string;
}) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-md"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + '18', color }}>
          {icon}
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: color + '15', color }}>
          {delta}
        </span>
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight">{value}</div>
        <div className="text-xs opacity-55 font-medium mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ─── Chart Card wrapper ───────────────────────────────────
function ChartCard({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-black tracking-tight">{title}</h2>
        {subtitle && <p className="text-[11px] opacity-45 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────
function CustomTooltip({ active, payload, label, darkMode }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border shadow-xl px-3 py-2 text-xs"
      style={{
        backgroundColor: darkMode ? 'rgba(20,20,20,0.97)' : 'rgba(255,255,255,0.97)',
        borderColor: 'var(--border)',
        color: 'var(--text)',
      }}
    >
      <p className="font-bold mb-1 opacity-60">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name} : <strong>{p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
}

// ─── Sidebar Item ─────────────────────────────────────────
function SidebarItem({ item, active, onSelect, darkMode }: {
  item: NavItem; active: string; onSelect: (key: string) => void; darkMode: boolean;
}) {
  const isActive = active === item.key || item.children?.some(c => c.key === active);
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
        }}
        onClick={() => { if (item.children) setOpen(o => !o); else onSelect(item.key); }}
      >
        <span className="shrink-0">{item.icon}</span>
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--primary)' }}>
            {item.badge}
          </span>
        )}
        {item.children && (
          <ChevronDown size={13} className="transition-transform duration-200 shrink-0"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        )}
      </button>
      {item.children && open && (
        <ul className="ml-4 mt-1 space-y-0.5 border-l pl-3" style={{ borderColor: 'var(--border)' }}>
          {item.children.map(child => (
            <li key={child.key}>
              <button
                className={base + ' py-2'}
                style={{
                  color: active === child.key ? 'var(--primary)' : 'var(--text)',
                  backgroundColor: active === child.key ? (darkMode ? 'rgba(0,180,0,0.12)' : 'rgba(0,128,0,0.07)') : 'transparent',
                  opacity: active === child.key ? 1 : 0.65,
                }}
                onClick={() => onSelect(child.key)}
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

// ─── Main ─────────────────────────────────────────────────
export default function DashboardLayout() {
  const { darkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [activeKey, setActiveKey]         = useState('dashboard');
  const [notifOpen, setNotifOpen]         = useState(false);

  const sidebarBg = darkMode ? 'rgba(10,10,10,0.97)'  : 'rgba(255,255,255,0.98)';
  const topbarBg  = darkMode ? 'rgba(10,10,10,0.95)'  : 'rgba(255,255,255,0.95)';
  const contentBg = darkMode ? '#0d0d0d'              : '#f4f6f8';

  const activeLabel =
    NAV_ITEMS.find(i => i.key === activeKey)?.label ??
    NAV_ITEMS.flatMap(i => i.children ?? []).find(c => c.key === activeKey)?.label ??
    'Tableau de bord';

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
          style={{
            backgroundColor: darkMode ? 'rgba(0,180,0,0.15)' : 'rgba(0,128,0,0.10)',
            borderColor: darkMode ? 'rgba(0,180,0,0.3)' : 'rgba(0,128,0,0.25)',
          }}>
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
            <SidebarItem key={item.key} item={item} active={activeKey}
              onSelect={(key) => { setActiveKey(key); setMobileSidebar(false); }}
              darkMode={darkMode} />
          ))}
        </ul>
      </nav>
      {/* Profil */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:opacity-80 transition">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0"
            style={{ backgroundColor: 'var(--primary)' }}>A</div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Administrateur</p>
              <p className="text-[10px] opacity-45 truncate">admin@etec.mg</p>
            </div>
          )}
          {sidebarOpen && (
            <button className="p-1.5 rounded-lg hover:opacity-70 transition cursor-pointer shrink-0"
              style={{ color: 'var(--text)' }} title="Déconnexion">
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
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileSidebar(false)} />
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
              onClick={() => setMobileSidebar(true)}>
              <Menu size={18} />
            </button>
            <button className="hidden md:flex p-2 rounded-xl border cursor-pointer transition hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              onClick={() => setSidebarOpen(o => !o)}>
              <Menu size={16} />
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs opacity-55">
              <span>Administration</span>
              <ChevronRight size={12} />
              <span className="font-bold opacity-100" style={{ color: 'var(--text)' }}>{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
              style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
              <Search size={13} className="opacity-40" />
              <input type="text" placeholder="Rechercher..." className="bg-transparent outline-none w-28 md:w-40 text-xs"
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
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs font-black uppercase tracking-wider">Notifications</span>
                    <button className="text-[10px] opacity-50 hover:opacity-80 cursor-pointer" onClick={() => setNotifOpen(false)}>Tout lire</button>
                  </div>
                  {[
                    { msg: '12 nouvelles inscriptions en attente', time: 'Il y a 5 min',  dot: '#22c55e' },
                    { msg: 'Résultats S1 publiés — Dept. Info',    time: 'Il y a 1h',    dot: '#3b82f6' },
                    { msg: '3 dossiers à valider — BTP',           time: 'Il y a 2h',    dot: '#f59e0b' },
                    { msg: 'Nouveau message de la scolarité',       time: 'Hier',         dot: '#8b5cf6' },
                    { msg: 'Mise à jour du calendrier académique',  time: 'Hier',         dot: '#6b7280' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 border-b cursor-pointer hover:opacity-70 transition"
                      style={{ borderColor: 'var(--border)' }}>
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

            <button onClick={toggleTheme} className="p-2 rounded-xl border cursor-pointer transition hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
            </button>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white cursor-pointer"
              style={{ backgroundColor: 'var(--primary)' }}>A</div>
          </div>
        </header>

        {/* ── CONTENU ──────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {/* En-tête */}
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{activeLabel}</h1>
            <p className="text-xs opacity-45 mt-1">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users size={18} />}         label="Étudiants inscrits"  value="12 048" delta="+8% ce mois"  color="#3b82f6" />
            <StatCard icon={<UserCheck size={18} />}     label="Enseignants actifs"   value="512"    delta="+2 nouveaux"  color="#22c55e" />
            <StatCard icon={<BookOpen size={18} />}      label="Formations actives"   value="24"     delta="4 filières"   color="#f59e0b" />
            <StatCard icon={<ClipboardList size={18} />} label="Dossiers en attente"  value="37"     delta="Urgent"       color="#ef4444" />
          </div>

          {/* ── CHARTS ROW 1 : Area + Pie ─────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Inscriptions mensuelles — Area chart */}
            <ChartCard
              title="Inscriptions mensuelles"
              subtitle="Étudiants et enseignants — 2026"
              children={
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={inscriptionsData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradEtu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                      </linearGradient>
                      <linearGradient id="gradEns" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
                    <XAxis dataKey="mois" tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Area type="monotone" dataKey="etudiants" name="Étudiants" stroke="#3b82f6" fill="url(#gradEtu)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="enseignants" name="Enseignants" stroke="#22c55e" fill="url(#gradEns)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              }
            />

            {/* Répartition filières — Pie chart */}
            <ChartCard
              title="Répartition par filière"
              subtitle="Total étudiants inscrits"
              children={
                <div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={filiereData}
                        cx="50%" cy="50%"
                        innerRadius={50} outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {filiereData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Légende manuelle */}
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    {filiereData.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: f.color }} />
                        <span className="opacity-65 truncate">{f.name}</span>
                        <span className="font-bold ml-auto">{f.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              }
            />

            {/* Taux d'insertion pro — Line chart */}
            <ChartCard
              title="Taux d'insertion professionnelle"
              subtitle="Évolution 2021–2026 (%)"
              children={
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={insertionData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
                    <XAxis dataKey="annee" tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                    <Line
                      type="monotone" dataKey="taux" name="Taux (%)"
                      stroke="var(--primary)" strokeWidth={2.5}
                      dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              }
            />
          </div>

          {/* ── CHARTS ROW 2 : Bar + Table + Activité ──── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Taux de réussite par filière — Bar chart */}
            <ChartCard
              title="Taux de réussite par filière"
              subtitle="Semestre 1 vs Semestre 2 (%)"
              children={
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={tauxReussiteData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
                    <XAxis dataKey="filiere" tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="s1" name="Semestre 1" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="s2" name="Semestre 2" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              }
            />

            {/* Tableau inscriptions récentes */}
            <div
              className="lg:col-span-2 rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="text-sm font-black tracking-tight">Inscriptions récentes</h2>
                <button className="text-[10px] font-bold uppercase tracking-wider hover:opacity-70 cursor-pointer" style={{ color: 'var(--primary)' }}>
                  Voir tout
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      {['Étudiant', 'Filière', 'Date', 'Statut'].map(h => (
                        <th key={h} className="px-5 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { nom: 'RAKOTO Andry',  filiere: 'Génie Logiciel',   date: '28 Juin 2026', statut: 'Validé',     color: '#22c55e' },
                      { nom: 'RAIVO Miora',   filiere: 'Administration',   date: '27 Juin 2026', statut: 'En attente', color: '#f59e0b' },
                      { nom: 'RASOA Haja',    filiere: 'BTP',              date: '27 Juin 2026', statut: 'Validé',     color: '#22c55e' },
                      { nom: 'RABE Feno',     filiere: 'Électromécanique', date: '26 Juin 2026', statut: 'Refusé',     color: '#ef4444' },
                      { nom: 'ANDRIANA Lova', filiere: 'Administration',   date: '25 Juin 2026', statut: 'En attente', color: '#f59e0b' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b transition hover:opacity-75 cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-5 py-3 font-semibold">{row.nom}</td>
                        <td className="px-5 py-3 opacity-65">{row.filiere}</td>
                        <td className="px-5 py-3 opacity-55">{row.date}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-1 rounded-full text-[10px] font-black"
                            style={{ backgroundColor: row.color + '18', color: row.color }}>
                            {row.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}