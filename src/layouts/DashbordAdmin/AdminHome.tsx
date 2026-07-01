import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Users, UserCheck, BookOpen, ClipboardList } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

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

function CustomTooltip({ active, payload, label, darkMode }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border shadow-xl px-3 py-2 text-xs"
      style={{ backgroundColor: darkMode ? 'rgba(20,20,20,0.97)' : 'rgba(255,255,255,0.97)', borderColor: 'var(--border)', color: 'var(--text)' }}>
      <p className="font-bold mb-1 opacity-60">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name} : <strong>{p.value.toLocaleString()}</strong></p>
      ))}
    </div>
  );
}

function StatCard({ icon, label, value, delta, color, onClick }: {
  icon: React.ReactNode; label: string; value: string; delta: string; color: string; onClick?: () => void;
}) {
  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-md cursor-pointer"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
      onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + '18', color }}>{icon}</div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: color + '15', color }}>{delta}</span>
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight">{value}</div>
        <div className="text-xs opacity-55 font-medium mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
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

export default function AdminHome() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight">Tableau de bord</h1>
        <p className="text-xs opacity-45 mt-1">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats — cliquables pour naviguer */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={18} />}         label="Étudiants inscrits"  value="12 048" delta="+8% ce mois"  color="#3b82f6" onClick={() => navigate('/admin/etudiants')} />
        <StatCard icon={<UserCheck size={18} />}     label="Enseignants actifs"   value="512"    delta="+2 nouveaux"  color="#22c55e" onClick={() => navigate('/admin/Enseignant/AdmineEnseignants')} />
        <StatCard icon={<BookOpen size={18} />}      label="Formations actives"   value="24"     delta="4 filières"   color="#f59e0b" onClick={() => navigate('/admin/Formations/Filiers')} />
        <StatCard icon={<ClipboardList size={18} />} label="Dossiers en attente"  value="37"     delta="Urgent"       color="#ef4444" onClick={() => navigate('/admin/Notes&Resultats')} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title="Inscriptions mensuelles" subtitle="Étudiants et enseignants — 2026">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={inscriptionsData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradEtu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradEns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
        </ChartCard>

        <ChartCard title="Répartition par filière" subtitle="Total étudiants inscrits">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={filiereData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {filiereData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            {filiereData.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: f.color }} />
                <span className="opacity-65 truncate">{f.name}</span>
                <span className="font-bold ml-auto">{f.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Taux d'insertion professionnelle" subtitle="Évolution 2021–2026 (%)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={insertionData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
              <XAxis dataKey="annee" tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Line type="monotone" dataKey="taux" name="Taux (%)" stroke="var(--primary)" strokeWidth={2.5}
                dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title="Taux de réussite par filière" subtitle="S1 vs S2 (%)">
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
        </ChartCard>

        {/* Tableau inscriptions récentes */}
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-black tracking-tight">Inscriptions récentes</h2>
            <button className="text-[10px] font-bold uppercase tracking-wider hover:opacity-70 cursor-pointer"
              style={{ color: 'var(--primary)' }}
              onClick={() => navigate('/admin/etudiants/inscriptions')}>
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
                  <tr key={i} className="border-b transition hover:opacity-75 cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                    onClick={() => navigate('/admin/etudiants')}>
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
    </>
  );
}