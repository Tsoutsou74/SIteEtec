import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  BookOpen, ClipboardList, TrendingUp, Clock,
  CheckCircle, AlertCircle,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';

const notesRadar = [
  { matiere: 'Algo',     note: 16 },
  { matiere: 'Réseaux',  note: 14 },
  { matiere: 'BDD',      note: 17 },
  { matiere: 'Maths',    note: 13 },
  { matiere: 'Web',      note: 18 },
  { matiere: 'Anglais',  note: 15 },
];

const evolutionData = [
  { sem: 'S1 2024', moy: 13.2 },
  { sem: 'S2 2024', moy: 14.8 },
  { sem: 'S1 2025', moy: 15.1 },
  { sem: 'S2 2025', moy: 15.9 },
  { sem: 'S1 2026', moy: 16.2 },
];

const notesBarData = [
  { matiere: 'Algo',    note: 16, max: 20 },
  { matiere: 'Réseaux', note: 14, max: 20 },
  { matiere: 'BDD',     note: 17, max: 20 },
  { matiere: 'Maths',   note: 13, max: 20 },
  { matiere: 'Web',     note: 18, max: 20 },
  { matiere: 'Anglais', note: 15, max: 20 },
];

const emploiDuTemps = [
  { jour: 'Lundi',    heure: '08h00 – 10h00', matiere: 'Algorithmique',     salle: 'A101', type: 'Cours'  },
  { jour: 'Lundi',    heure: '10h00 – 12h00', matiere: 'Base de Données',   salle: 'Labo1',type: 'TP'     },
  { jour: 'Mardi',    heure: '08h00 – 10h00', matiere: 'Réseaux',           salle: 'B204', type: 'Cours'  },
  { jour: 'Mercredi', heure: '14h00 – 16h00', matiere: 'Développement Web', salle: 'Labo2',type: 'TP'     },
  { jour: 'Jeudi',    heure: '08h00 – 10h00', matiere: 'Mathématiques',     salle: 'A203', type: 'Cours'  },
  { jour: 'Vendredi', heure: '10h00 – 12h00', matiere: 'Anglais Technique', salle: 'B102', type: 'TD'     },
];

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
          {p.name} : <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

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

export default function EtudiantHome() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const typeColor = (t: string) =>
    t === 'TP' ? '#3b82f6' : t === 'TD' ? '#f59e0b' : '#22c55e';

  return (
    <>
      {/* En-tête */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Bonjour, Andry 👋</h1>
          <p className="text-xs opacity-45 mt-1">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}L3 Génie Logiciel · Semestre 1
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold"
          style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(34,197,94,0.08)', color: '#22c55e' }}>
          <CheckCircle size={13} />
          Inscrit · Année 2026–2027
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard icon={<TrendingUp size={18} />}    label="Moyenne générale"  value="16.2/20"  sub="↑ +0.3"    color="#22c55e" />
        <StatCard icon={<BookOpen size={18} />}      label="Modules validés"   value="5 / 6"    sub="S1 2026"   color="#3b82f6" />
        <StatCard icon={<Clock size={18} />}         label="Heures de cours"   value="240h"     sub="Ce sem."   color="#f59e0b" />
        <StatCard icon={<ClipboardList size={18} />} label="Absences"          value="2"        sub="Justifiées" color="#8b5cf6" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <ChartCard title="Profil académique" subtitle="Notes par matière — S1 2026">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={notesRadar}>
              <PolarGrid stroke={darkMode ? '#ffffff15' : '#00000012'} />
              <PolarAngleAxis dataKey="matiere"
                tick={{ fontSize: 11, fill: darkMode ? '#ffffff70' : '#00000070' }} />
              <Radar name="Note" dataKey="note" stroke="var(--primary)" fill="var(--primary)"
                fillOpacity={0.25} strokeWidth={2} dot={{ r: 3, fill: 'var(--primary)' }} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Notes détaillées" subtitle="Toutes les matières / 20">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={notesBarData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
              <XAxis dataKey="matiere" tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 20]} tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Bar dataKey="note" name="Note" radius={[4, 4, 0, 0]}
                fill="var(--primary)" fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Évolution de la moyenne" subtitle="Par semestre — 2024 à 2026">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={evolutionData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
              <XAxis dataKey="sem" tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <YAxis domain={[10, 20]} tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Line type="monotone" dataKey="moy" name="Moyenne" stroke="#3b82f6"
                strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* EDT + à surveiller + échéances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">

        <div className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-black tracking-tight">Emploi du temps — cette semaine</h2>
            <button
              className="text-[10px] font-bold uppercase tracking-wider hover:opacity-70 cursor-pointer"
              style={{ color: 'var(--primary)' }}
              onClick={() => navigate('/etudiant/edt')}
            >
              Voir tout
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {['Jour', 'Horaire', 'Matière', 'Salle', 'Type'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {emploiDuTemps.map((row, i) => (
                  <tr key={i} className="border-b transition hover:opacity-75"
                    style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3 font-bold">{row.jour}</td>
                    <td className="px-4 py-3 opacity-60 whitespace-nowrap">{row.heure}</td>
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

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black tracking-tight">À surveiller</h2>
              <p className="text-[11px] opacity-45 mt-0.5">Notes inférieures à la moyenne</p>
            </div>
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {notesBarData.filter(m => m.note < 15).map((m, i) => (
                <li key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={13} className="text-amber-500 shrink-0" />
                    <span className="text-xs font-semibold">{m.matiere}</span>
                  </div>
                  <span className="text-xs font-black" style={{ color: m.note < 12 ? '#ef4444' : '#f59e0b' }}>
                    {m.note}/20
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border overflow-hidden flex-1"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black tracking-tight">Prochaines échéances</h2>
            </div>
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {[
                { label: 'Examen BDD',        date: '05 Juil',  color: '#ef4444' },
                { label: 'Rendu TP Réseaux',  date: '08 Juil',  color: '#f59e0b' },
                { label: 'Examen Algo',       date: '10 Juil',  color: '#ef4444' },
                { label: 'Exposé Anglais',    date: '12 Juil',  color: '#3b82f6' },
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
    </>
  );
}