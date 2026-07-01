import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, BookOpen, Calendar, FileText, Bell,
  Settings, LogOut, Menu, ChevronDown, Sun, Moon,
  Search, ChevronRight, Users, GraduationCap, ClipboardList,
  TrendingUp, Clock, CheckCircle, AlertCircle, FileCheck, Plus
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';

// ─── Data Enseignants ─────────────────────────────────────
const performanceClasses = [
  { matiere: 'Algo (L1)',    moyenne: 13.8 },
  { matiere: 'Réseaux (L2)', moyenne: 12.4 },
  { matiere: 'BDD (L3)',     moyenne: 15.2 },
  { matiere: 'Web (L3)',     moyenne: 16.1 },
  { matiere: 'Design (L1)',  moyenne: 14.5 },
];

const participationData = [  
  { mois: 'Jan', presence: 94 },
  { mois: 'Fév', presence: 92 },
  { mois: 'Mar', presence: 89 },
  { mois: 'Avr', presence: 91 },
  { mois: 'Mai', presence: 95 },
];

const volumeHoraireData = [
  { matiere: 'Algo',    CM: 20, TP: 15 },
  { matiere: 'Réseaux', CM: 10, TP: 20 },
  { matiere: 'BDD',     CM: 15, TP: 15 },
  { matiere: 'Web',     CM: 12, TP: 24 },
];

const emploiDuTempsProf = [
  { jour: 'Lundi',    heure: '08h00 – 10h00', classe: 'L1 Info A', matiere: 'Algorithmique',      salle: 'A101', type: 'Cours' },
  { jour: 'Lundi',    heure: '10h00 – 12h00', classe: 'L3 Info',   matiere: 'Base de Données',   salle: 'Labo1',type: 'TP'    },
  { jour: 'Mardi',    heure: '08h00 – 10h00', classe: 'L2 Info B', matiere: 'Réseaux',            salle: 'B204', type: 'Cours' },
  { jour: 'Mercredi', heure: '14h00 – 16h00', classe: 'L3 Info',   matiere: 'Développement Web', salle: 'Labo2',type: 'TP'    },
  { jour: 'Jeudi',    heure: '08h00 – 10h00', classe: 'L1 Info B', matiere: 'Algorithmique',      salle: 'A203', type: 'Cours' },
];

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: 'Tableau de bord', key: 'dashboard' },
  { icon: <BookOpen size={18} />,        label: 'Mes cours',        key: 'cours'     },
  { icon: <Users size={18} />,           label: 'Mes classes',      key: 'classes'   },
  { icon: <Calendar size={18} />,        label: 'Emploi du temps',  key: 'edt'       },
  { icon: <FileCheck size={18} />,       label: 'Evaluations',      key: 'evals'     },
  { icon: <FileText size={18} />,        label: 'Ressources',       key: 'docs'      },
  { icon: <Bell size={18} />,            label: 'Notifications',    key: 'notifs', badge: 2 },
  { icon: <Settings size={18} />,        label: 'Paramètres',       key: 'settings'  },
];

// ─── Custom Tooltip ───────────────────────────────────────
function CustomTooltip({ active, payload, label, darkMode }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border shadow-xl px-3 py-2 text-xs"
      style={{
        backgroundColor: darkMode ? 'rgba(20,20,20,0.97)' : 'rgba(255,255,255,0.97)',
        borderColor: 'var(--border)', color: 'var(--text)',
      }}>
      <p className="font-bold mb-1 opacity-60">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name} : <strong>{p.value}</strong>{p.name.includes('presence') ? '%' : ''}
        </p>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-md"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + '18', color }}>{icon}</div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: color + '15', color }}>{sub}</span>
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight">{value}</div>
        <div className="text-xs opacity-55 font-medium mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ─── Chart Card ───────────────────────────────────────────
function ChartCard({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-black tracking-tight">{title}</h2>
        {subtitle && <p className="text-[11px] opacity-45 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Sidebar Item ─────────────────────────────────────────
function SidebarItem({ item, active, onSelect, darkMode, collapsed }: {
  item: typeof NAV_ITEMS[0]; active: string; onSelect: (k: string) => void;
  darkMode: boolean; collapsed: boolean;
}) {
  const isActive = active === item.key;
  const base = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer';
  return (
    <li>
      <button className={base}
        style={{
          backgroundColor: isActive ? (darkMode ? 'rgba(0,180,0,0.18)' : 'rgba(0,128,0,0.10)') : 'transparent',
          color: isActive ? 'var(--primary)' : 'var(--text)',
          opacity: isActive ? 1 : 0.75,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
        onClick={() => onSelect(item.key)}
        title={collapsed ? item.label : undefined}
      >
        <span className="shrink-0">{item.icon}</span>
        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: 'var(--primary)' }}>{item.badge}</span>
        )}
      </button>
    </li>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function DashboardEnseignants() {
  const { darkMode, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [activeKey, setActiveKey]          = useState('dashboard');
  const [notifOpen, setNotifOpen]          = useState(false);

  const sidebarBg = darkMode ? 'rgba(10,10,10,0.97)'  : 'rgba(255,255,255,0.98)';
  const topbarBg  = darkMode ? 'rgba(10,10,10,0.95)'  : 'rgba(255,255,255,0.95)';
  const contentBg = darkMode ? '#0d0d0d'              : '#f4f6f8';

  const activeLabel = NAV_ITEMS.find(i => i.key === activeKey)?.label ?? 'Tableau de bord';

  const typeColor = (t: string) =>
    t === 'TP' ? '#3b82f6' : t === 'TD' ? '#f59e0b' : '#22c55e';

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
          style={{
            backgroundColor: darkMode ? 'rgba(0,180,0,0.15)' : 'rgba(0,128,0,0.10)',
            borderColor: darkMode ? 'rgba(0,180,0,0.3)' : 'rgba(0,128,0,0.25)',
          }}>
          <GraduationCap size={18} style={{ color: 'var(--primary)' }} />
        </div>
        {sidebarOpen && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'var(--primary)' }}>E-TEC</p>
            <p className="text-[9px] opacity-50 uppercase tracking-wider">Espace Enseignant</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(item => (
            <SidebarItem key={item.key} item={item} active={activeKey}
              onSelect={(k) => { setActiveKey(k); setMobileSidebar(false); }}
              darkMode={darkMode} collapsed={!sidebarOpen} />
          ))}
        </ul>
      </nav>

      {/* Profil enseignant */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:opacity-80 transition">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0"
            style={{ backgroundColor: '#22c55e' }}>M</div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Dr. MIARITSOA</p>
              <p className="text-[10px] opacity-45 truncate">Enseignant Chercheur</p>
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
      <aside className="hidden md:flex flex-col border-r transition-all duration-300 shrink-0"
        style={{ width: sidebarOpen ? '240px' : '68px', backgroundColor: sidebarBg, borderColor: 'var(--border)' }}>
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
              onClick={() => setMobileSidebar(true)}><Menu size={18} /></button>
            <button className="hidden md:flex p-2 rounded-xl border cursor-pointer transition hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              onClick={() => setSidebarOpen(o => !o)}><Menu size={16} /></button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs opacity-55">
              <span>E-espace</span>
              <ChevronRight size={12} />
              <span className="font-bold opacity-100" style={{ color: 'var(--text)' }}>{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Recherche */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
              style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
              <Search size={13} className="opacity-40" />
              <input type="text" placeholder="Rechercher étudiant, note..." className="bg-transparent outline-none w-28 md:w-44 text-xs"
                style={{ color: 'var(--text)' }} />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 rounded-xl border cursor-pointer transition hover:opacity-70"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                onClick={() => setNotifOpen(o => !o)}>
                <Bell size={16} />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center"
                  style={{ backgroundColor: '#ef4444' }}>2</span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 rounded-2xl border shadow-2xl overflow-hidden w-72"
                  style={{ zIndex: 200, backgroundColor: sidebarBg, borderColor: 'var(--border)' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs font-black uppercase tracking-wider">Notifications</span>
                    <button className="text-[10px] opacity-50 hover:opacity-80 cursor-pointer" onClick={() => setNotifOpen(false)}>Tout lire</button>
                  </div>
                  {[
                    { msg: 'Rendu de TP : 45 nouvelles copies (Web L3)', time: 'Il y a 30 min', dot: '#3b82f6' },
                    { msg: 'Conseil des professeurs prévu ce vendredi', time: 'Hier',         dot: '#f59e0b' },
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

            {/* Thème */}
            <button onClick={toggleTheme} className="p-2 rounded-xl border cursor-pointer transition hover:opacity-70"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white cursor-pointer"
              style={{ backgroundColor: '#22c55e' }}>M</div>
          </div>
        </header>

        {/* ── CONTENU ──────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {/* En-tête */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">Bonjour, Miaritsoa 👋</h1>
              <p className="text-xs opacity-45 mt-1">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {' · '}Département Informatique
              </p>
            </div>
            {/* Action Rapide */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}>
              <Plus size={14} />
              Nouvelle Évaluation
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users size={18} />}           label="Étudiants suivis"  value="142"       sub="4 Classes" color="#3b82f6" />
            <StatCard icon={<Clock size={18} />}           label="Heures ce mois"    value="48h / 64h" sub="75% Effectué"color="#f59e0b" />
            <StatCard icon={<FileCheck size={18} />}       label="Copies à corriger" value="23"        sub="Urgents"   color="#ef4444" />
            <StatCard icon={<TrendingUp size={18} />}      label="Moyenne globale"   value="14.4/20"   sub="Stable"    color="#22c55e" />
          </div>

          {/* ── CHARTS ROW 1 ─────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Radar Performances par Classe */}
            <ChartCard title="Moyennes des Classes" subtitle="Comparatif par groupe de niveau">
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={performanceClasses}>
                  <PolarGrid stroke={darkMode ? '#ffffff15' : '#00000012'} />
                  <PolarAngleAxis dataKey="matiere"
                    tick={{ fontSize: 10, fill: darkMode ? '#ffffff70' : '#00000070' }} />
                  <Radar name="Moyenne" dataKey="moyenne" stroke="#22c55e" fill="#22c55e"
                    fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} />
                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Bar Repartition Volume Horaire */}
            <ChartCard title="Volume Horaire Distribué" subtitle="Répartition Cours/TP par module">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={volumeHoraireData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }} barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
                  <XAxis dataKey="matiere" tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="CM" name="Cours (h)" stackId="a" fill="#3b82f6" fillOpacity={0.85} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="TP" name="TP/TD (h)" stackId="a" fill="#22c55e" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Évolution Assiduité / Présence */}
            <ChartCard title="Taux d'Assiduité Moyen" subtitle="Évolution mensuelle globale">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={participationData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
                  <XAxis dataKey="mois" tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                  <Line type="monotone" dataKey="presence" name="Présence (%)" stroke="#f59e0b"
                    strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* ── ROW 2 : EDT Prof + Alertes ──── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Emploi du temps enseignant */}
            <div className="lg:col-span-2 rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h2 className="text-sm font-black tracking-tight">Planning des Cours & TPs — cette semaine</h2>
                <button className="text-[10px] font-bold uppercase tracking-wider hover:opacity-70 cursor-pointer"
                  style={{ color: 'var(--primary)' }}>Voir Agenda</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      {['Jour', 'Horaire', 'Classe', 'Matière', 'Salle', 'Type'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {emploiDuTempsProf.map((row, i) => (
                      <tr key={i} className="border-b transition hover:opacity-75"
                        style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 font-bold">{row.jour}</td>
                        <td className="px-4 py-3 opacity-60 whitespace-nowrap">{row.heure}</td>
                        <td className="px-4 py-3 font-bold opacity-80">{row.classe}</td>
                        <td className="px-4 py-3 font-semibold">{row.matiere}</td>
                        <td className="px-4 py-3 opacity-55">{row.salle}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-[10px] font-black"
                            style={{ backgroundColor: typeColor(row.type) + '18', color: typeColor(row.type) }}>
                            {row.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Suivi des Évaluations / Alertes */}
            <div className="flex flex-col gap-4">

              {/* À surveiller (Classes en baisse) */}
              <div className="rounded-2xl border overflow-hidden"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="text-sm font-black tracking-tight">Alertes Modules</h2>
                  <p className="text-[11px] opacity-45 mt-0.5">Classes ou modules nécessitant une attention</p>
                </div>
                <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  <li className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={13} className="text-amber-500 shrink-0" />
                      <span className="text-xs font-semibold">Réseaux (L2)</span>
                    </div>
                    <span className="text-xs font-black text-amber-500">Moy: 12.4/20</span>
                  </li>
                  <li className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={13} className="text-red-500 shrink-0" />
                      <span className="text-xs font-semibold">Absenteïsme L1 A</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">-12% prés.</span>
                  </li>
                </ul>
              </div>

              {/* Tâches de corrections / Rendu à venir */}
              <div className="rounded-2xl border overflow-hidden flex-1"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <h2 className="text-sm font-black tracking-tight">Prochaines Échéances Prof</h2>
                </div>
                <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {[
                    { label: 'Corriger Exam BDD (L3)',  date: '03 Juil', color: '#ef4444' },
                    { label: 'Saisir Notes Algo (L1)',  date: '06 Juil', color: '#f59e0b' },
                    { label: 'Préparer Projet Web',    date: '10 Juil', color: '#3b82f6' },
                    { label: 'Conseil de Classe',       date: '12 Juil', color: '#22c55e' },
                  ].map((e, i) => (
                    <li key={i} className="flex items-center justify-between px-5 py-3 hover:opacity-75 transition cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                        <span className="text-xs font-semibold">{e.label}</span>
                      </div>
                      <span className="text-[10px] font-bold opacity-60">{e.date}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}