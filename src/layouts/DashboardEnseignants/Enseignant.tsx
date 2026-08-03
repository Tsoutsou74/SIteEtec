import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

import {
  BookOpen, ClipboardList, BarChart3, Clock,
  AlertCircle, FileText, Calendar, Plus, Loader2
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';

interface DashboardData {
  stats: {
    heuresEffectuees: string;
    heuresQuota: string;
    classesAssignees: string;
    saisieNotesPourcentage: string;
    ressourcesPartagees: string;
  };
  coursParNiveauRadar: Array<{ niveau: string; heures: number }>;
  evolutionReussiteEtudiants: Array<{ sem: string; taux: number }>;
  quotaHeuresBarData: Array<{ mois: string; effectuees: number; quota: number }>;
  coursDeLaSemaine: Array<{ jour: string; heure: string; classe: string; matiere: string; salle: string; type: string }>;
  notesRestantes: Array<{ classe: string; statut: string }>;
  echeances: Array<{ label: string; date: string; color: string }>;
}

function CustomTooltip({ active, payload, label, darkMode }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border shadow-xl px-3 py-2 text-xs" style={{ backgroundColor: darkMode ? 'rgba(20,20,20,0.97)' : 'rgba(255,255,255,0.97)', borderColor: 'var(--border)', color: 'var(--text)' }}>
      <p className="font-bold mb-1 opacity-60">{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name} : <strong>{p.value}</strong></p>)}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string; }) {
  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-md" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '18', color }}>{icon}</div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: color + '15', color }}>{sub}</span>
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight">{value}</div>
        <div className="text-xs opacity-55 font-medium mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode; }) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-black tracking-tight">{title}</h2>
        {subtitle && <p className="text-[11px] opacity-45 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function DashboardEnseignant() {
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockData: DashboardData = {
      stats: { heuresEffectuees: '128h', heuresQuota: '192h', classesAssignees: '4 Groupes', saisieNotesPourcentage: '72%', ressourcesPartagees: '12 fichiers' },
      coursParNiveauRadar: [{ niveau: 'L1', heures: 32 }, { niveau: 'L2', heures: 28 }, { niveau: 'L3', heures: 40 }, { niveau: 'M1', heures: 18 }, { niveau: 'M2', heures: 10 }],
      evolutionReussiteEtudiants: [{ sem: 'S1 2024', taux: 72 }, { sem: 'S2 2024', taux: 78 }, { sem: 'S1 2025', taux: 81 }, { sem: 'S2 2025', taux: 85 }],
      quotaHeuresBarData: [{ mois: 'Sep', effectuees: 28, quota: 32 }, { mois: 'Oct', effectuees: 30, quota: 32 }, { mois: 'Nov', effectuees: 26, quota: 32 }, { mois: 'Dec', effectuees: 20, quota: 32 }, { mois: 'Jan', effectuees: 24, quota: 32 }],
      coursDeLaSemaine: [
        { jour: 'Lundi', heure: '08:30 - 10:00', classe: 'L2 Info G1', matiere: 'Algorithmique', salle: 'Amphi A', type: 'CM' },
        { jour: 'Lundi', heure: '10:15 - 11:45', classe: 'L3 Info G2', matiere: 'Base de données', salle: 'Salle TP3', type: 'TP' },
        { jour: 'Mardi', heure: '13:00 - 14:30', classe: 'M1 GL G1', matiere: 'Génie logiciel', salle: 'Salle 204', type: 'TD' },
        { jour: 'Mercredi', heure: '08:30 - 10:00', classe: 'L1 MI G3', matiere: 'Programmation C', salle: 'Salle TP1', type: 'TP' },
        { jour: 'Jeudi', heure: '14:45 - 16:15', classe: 'L2 Info G1', matiere: 'Structures de données', salle: 'Salle 102', type: 'TD' },
      ],
      notesRestantes: [
        { classe: 'L2 Info G1 - Algorithmique', statut: 'Non saisie' },
        { classe: 'L3 Info G2 - Projet BDD', statut: 'En cours' },
        { classe: 'M1 GL G1 - Examen partiel', statut: 'Non saisie' },
      ],
      echeances: [
        { label: 'Saisie notes L2 Algo', date: '15 Août 2026', color: '#ef4444' },
        { label: 'Réunion pédagogique', date: '20 Août 2026', color: '#3b82f6' },
        { label: 'Dépôt supports M1', date: '01 Sep 2026', color: '#8b5cf6' },
      ],
    };
    setData(mockData);
    setIsLoading(false);
  }, []);

  const typeColor = (tpe: string) => (tpe === 'TP' ? '#3b82f6' : tpe === 'TD' ? '#f59e0b' : '#22c55e');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-3 opacity-60 text-xs">
        <Loader2 size={28} className="animate-spin text-[var(--primary)]" />
        <p className="font-bold tracking-wide">{t('dashboard.teacher.home.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">{t('dashboard.teacher.home.title')}</h1>
          <p className="text-xs opacity-45 mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}{' · '}{t('dashboard.teacher.home.subtitle')} · Semestre 1</p>
        </div>
        <button onClick={() => navigate('/enseignants/Evaluations')} className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition hover:opacity-80 cursor-pointer" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--primary)', color: '#ffffff' }}>
          <Plus size={14} />{t('dashboard.teacher.home.action')}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard icon={<Clock size={18} />} label={t('dashboard.teacher.home.stats.hours')} value={`${data?.stats.heuresEffectuees || '0h'} / ${data?.stats.heuresQuota || '0h'}`} sub={t('dashboard.teacher.home.quota')} color="#22c55e" />
        <StatCard icon={<BookOpen size={18} />} label={t('dashboard.teacher.home.stats.classes')} value={data?.stats.classesAssignees || '0 Groupe'} sub={t('dashboard.teacher.home.assignments')} color="#3b82f6" />
        <StatCard icon={<BarChart3 size={18} />} label={t('dashboard.teacher.home.stats.grades')} value={data?.stats.saisieNotesPourcentage || '0%'} sub={t('dashboard.teacher.home.progress')} color="#f59e0b" />
        <StatCard icon={<FileText size={18} />} label={t('dashboard.teacher.home.stats.resources')} value={data?.stats.ressourcesPartagees || '0 fichier'} sub={t('dashboard.teacher.home.library')} color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <ChartCard title={t('dashboard.teacher.home.volumeTitle')} subtitle={t('dashboard.teacher.home.volumeSubtitle')}>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={data?.coursParNiveauRadar || []}>
              <PolarGrid stroke={darkMode ? '#ffffff15' : '#00000012'} />
              <PolarAngleAxis dataKey="niveau" tick={{ fontSize: 10, fill: darkMode ? '#ffffff70' : '#00000070' }} />
              <Radar name="Heures de cours" dataKey="heures" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} strokeWidth={2} dot={{ r: 3, fill: 'var(--primary)' }} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('dashboard.teacher.home.monthlyTitle')} subtitle={t('dashboard.teacher.home.monthlySubtitle')}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.quotaHeuresBarData || []} margin={{ top: 4, right: 8, left: -24, bottom: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
              <XAxis dataKey="mois" tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 'auto']} tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Bar dataKey="effectuees" name="Heures dispensées" radius={[4, 4, 0, 0]} fill="var(--primary)" fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('dashboard.teacher.home.performanceTitle')} subtitle={t('dashboard.teacher.home.performanceSubtitle')}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data?.evolutionReussiteEtudiants || []} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
              <XAxis dataKey="sem" tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Line type="monotone" dataKey="taux" name="Taux Réussite" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-black tracking-tight">{t('dashboard.teacher.home.weekTitle')}</h2>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/10">
              <Calendar size={11} /> {t('dashboard.teacher.home.weekBadge')}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {[t('dashboard.teacher.home.headers.day'), t('dashboard.teacher.home.headers.time'), t('dashboard.teacher.home.headers.level'), t('dashboard.teacher.home.headers.subject'), t('dashboard.teacher.home.headers.room'), t('dashboard.teacher.home.headers.type')].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.coursDeLaSemaine || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 opacity-40 font-medium">{t('dashboard.teacher.home.noWeekCourse')}</td>
                  </tr>
                ) : (
                  data?.coursDeLaSemaine.map((row, i) => (
                    <tr key={i} className="border-b transition hover:opacity-75" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-bold">{row.jour}</td>
                      <td className="px-4 py-3 opacity-60 whitespace-nowrap">{row.heure}</td>
                      <td className="px-4 py-3 font-bold text-[var(--primary)]">{row.classe}</td>
                      <td className="px-4 py-3 font-semibold">{row.matiere}</td>
                      <td className="px-4 py-3 opacity-55">{row.salle}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-[10px] font-black" style={{ backgroundColor: typeColor(row.type) + '18', color: typeColor(row.type) }}>{row.type}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black tracking-tight">{t('dashboard.teacher.home.remainingTitle')}</h2>
              <p className="text-[11px] opacity-45 mt-0.5">{t('dashboard.teacher.home.remainingSubtitle')}</p>
            </div>
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {(data?.notesRestantes || []).length === 0 ? (
                <li className="px-5 py-4 text-center text-xs opacity-40 font-medium">{t('dashboard.teacher.home.allClosed')}</li>
              ) : (
                data?.notesRestantes.map((item, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2"><AlertCircle size={13} className="text-amber-500 shrink-0" /><span className="text-xs font-semibold">{item.classe}</span></div>
                    <span className="text-xs font-black text-amber-500">{item.statut}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-2xl border overflow-hidden flex-1" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black tracking-tight">{t('dashboard.teacher.home.deadlinesTitle')}</h2>
            </div>
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {(data?.echeances || []).length === 0 ? (
                <li className="px-5 py-4 text-center text-xs opacity-40 font-medium">{t('dashboard.teacher.home.noDeadline')}</li>
              ) : (
                data?.echeances.map((e, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3 hover:opacity-75 transition cursor-pointer">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.color || 'var(--primary)' }} /><span className="text-xs font-semibold">{e.label}</span></div>
                    <span className="text-[10px] font-bold opacity-60">{e.date}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
