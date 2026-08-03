import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Activity, ArrowDownRight, ArrowUpRight, BookOpen, GraduationCap, Users } from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

const inscriptions = [
  { mois: 'Jan', total: 42 }, { mois: 'Fév', total: 58 }, { mois: 'Mar', total: 64 },
  { mois: 'Avr', total: 78 }, { mois: 'Mai', total: 91 }, { mois: 'Juin', total: 108 },
  { mois: 'Juil', total: 126 },
];

const mentions = [
  { nom: 'Informatique', total: 186, color: '#16a34a' },
  { nom: 'Administration', total: 124, color: '#3b82f6' },
  { nom: 'BTP', total: 86, color: '#f59e0b' },
  { nom: 'Électromécanique', total: 54, color: '#8b5cf6' },
];

const activites = [
  ['Nouvelle inscription validée', 'Aina Rakoto · il y a 12 min', 'bg-emerald-500'],
  ['Résultats du semestre publiés', 'Licence 3 Informatique · il y a 1 h', 'bg-blue-500'],
  ['Cours ajouté au catalogue', 'Architecture logicielle · il y a 3 h', 'bg-amber-500'],
];

export default function AdminStatistiques() {
  const { darkMode } = useTheme();
  const axisColor = darkMode ? '#9ca3af' : '#6b7280';
  const tooltipStyle = { backgroundColor: darkMode ? '#171717' : '#ffffff', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)' };

  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">Pilotage académique</p><h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">Statistiques</h1><p className="mt-1 text-xs opacity-55">Suivez l’activité et la croissance de votre établissement.</p></div>
        <span className="rounded-full border px-3 py-2 text-[11px] font-bold opacity-70" style={{ borderColor: 'var(--border)' }}>Année 2026–2027</span>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Users size={18} />} label="Étudiants inscrits" value="450" change="+12,8 %" positive color="text-emerald-500" />
        <StatCard icon={<GraduationCap size={18} />} label="Diplômés cette année" value="128" change="+8,4 %" positive color="text-blue-500" />
        <StatCard icon={<BookOpen size={18} />} label="Cours actifs" value="86" change="+5,2 %" positive color="text-amber-500" />
        <StatCard icon={<Activity size={18} />} label="Taux de réussite" value="87,6 %" change="-2,1 %" color="text-violet-500" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
        <section className="rounded-3xl border p-5 shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-black">Évolution des inscriptions</h2><p className="mt-1 text-xs opacity-50">Progression mensuelle des nouveaux étudiants</p></div><span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500">+ 126 ce mois</span></div>
          <div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={inscriptions} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}><defs><linearGradient id="inscriptionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16a34a" stopOpacity={0.28} /><stop offset="100%" stopColor="#16a34a" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" /><XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="total" name="Étudiants" stroke="#16a34a" strokeWidth={3} fill="url(#inscriptionFill)" /></AreaChart></ResponsiveContainer></div>
        </section>

        <section className="rounded-3xl border p-5 shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="mb-2"><h2 className="text-sm font-black">Répartition par mention</h2><p className="mt-1 text-xs opacity-50">Effectif actuel par parcours</p></div>
          <div className="h-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={mentions} dataKey="total" nameKey="nom" cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3}>{mentions.map((entry) => <Cell key={entry.nom} fill={entry.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer></div>
          <div className="space-y-2">{mentions.map((mention) => <div key={mention.nom} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: mention.color }} />{mention.nom}</span><strong>{mention.total}</strong></div>)}</div>
        </section>
      </div>

      <section className="rounded-3xl border p-5 shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-black">Activité récente</h2><p className="mt-1 text-xs opacity-50">Dernières actions enregistrées dans le système</p></div><button type="button" className="text-xs font-bold text-[var(--primary)] hover:underline">Voir tout</button></div>
        <div className="grid gap-2 md:grid-cols-3">{activites.map(([title, detail, color]) => <div key={title} className="flex items-start gap-3 rounded-2xl border p-3" style={{ borderColor: 'var(--border)' }}><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${color}`} /><div><p className="text-xs font-bold">{title}</p><p className="mt-1 text-[11px] opacity-50">{detail}</p></div></div>)}</div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, change, positive, color }: { icon: ReactNode; label: string; value: string; change: string; positive?: boolean; color: string }) {
  return <div className="rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}><div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 ${color} dark:bg-white/5`}>{icon}</div><p className="text-[11px] font-bold opacity-55">{label}</p><div className="mt-1 flex items-end justify-between gap-2"><strong className="text-2xl font-black">{value}</strong><span className={`flex items-center text-[10px] font-bold ${positive ? 'text-emerald-500' : 'text-red-500'}`}>{positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{change}</span></div></div>;
}
