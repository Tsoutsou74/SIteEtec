import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/ApiService';
import { BookOpen, ClipboardList, TrendingUp, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';

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

export default function EtudiantHome() {
  const { darkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [infosPerso, setInfosPerso] = useState({ nom: '', prenom: '', mention: '', niveau: '', statutInscrit: false });
  const [stats, setStats] = useState({ moyenne: '0.00/20', evolutionMoyenne: '0.0', modulesValides: '0 / 0', semestre: '', heuresCours: '0h', absences: '0' });
  const [notesGraphiques, setNotesGraphiques] = useState<Array<{ matiere: string; note: number; max: number }>>([]);
  const [historiqueSemestres, setHistoriqueSemestres] = useState<Array<{ sem: string; moy: number }>>([]);
  const [edtSemaine, setEdtSemaine] = useState<Array<{ jour: string; heure: string; matiere: string; salle: string; type: 'Cours' | 'TP' | 'TD' }>>([]);
  const [echeances, setEcheances] = useState<Array<{ label: string; date: string; color: string }>>([]);

  const getRequestConfig = () => {
    const token = localStorage.getItem('token');
    return { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } };
  };

  useEffect(() => {
    const fetchHomeDashboardData = async () => {
      setIsLoading(true);
      const config = getRequestConfig();
      try {
        if (ApiService.etudiant?.getHomeDashboard) {
          const res = await ApiService.etudiant.getHomeDashboard(config);
          if (res && res.data) {
            const d = res.data;
            setInfosPerso({
              nom: d.infosPerso?.nom || '',
              prenom: d.infosPerso?.prenom || '',
              mention: d.infosPerso?.mention || 'Génie Logiciel',
              niveau: d.infosPerso?.niveau || 'L3',
              statutInscrit: !!d.infosPerso?.statutInscrit,
            });
            setStats({
              moyenne: d.stats?.moyenne ? `${d.stats.moyenne}/20` : '0.00/20',
              evolutionMoyenne: d.stats?.evolutionMoyenne || '0.0',
              modulesValides: d.stats?.modulesValides || '0 / 0',
              semestre: d.stats?.semestre || 'Semestre 1',
              heuresCours: d.stats?.heuresCours ? `${d.stats.heuresCours}h` : '0h',
              absences: String(d.stats?.absences || 0),
            });
            setNotesGraphiques(d.notes || []);
            setHistoriqueSemestres(d.evolutionMoyennes || []);
            setEdtSemaine(d.emploiDuTemps || []);
            setEcheances(d.echeances || []);
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données de l\'accueil étudiant :', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeDashboardData();
  }, []);

  const typeColor = (tpe: string) => (tpe === 'TP' ? '#3b82f6' : tpe === 'TD' ? '#f59e0b' : '#22c55e');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 opacity-60 text-xs">
        <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
        <p className="font-bold">{t('dashboard.student.home.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">{t('dashboard.student.home.greeting')}, {infosPerso.prenom || infosPerso.nom} 👋</h1>
          <p className="text-xs opacity-45 mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}{' · '}{infosPerso.niveau} {infosPerso.mention} · {stats.semestre}</p>
        </div>
        {infosPerso.statutInscrit && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(34,197,94,0.08)', color: '#22c55e' }}>
            <CheckCircle size={13} />{t('dashboard.student.home.status')} · {t('dashboard.student.home.academicYear')}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard icon={<TrendingUp size={18} />} label={t('dashboard.student.home.stats.average')} value={stats.moyenne} sub={`↑ ${stats.evolutionMoyenne}`} color="#22c55e" />
        <StatCard icon={<BookOpen size={18} />} label={t('dashboard.student.home.stats.validated')} value={stats.modulesValides} sub={stats.semestre} color="#3b82f6" />
        <StatCard icon={<Clock size={18} />} label={t('dashboard.student.home.stats.hours')} value={stats.heuresCours} sub="Ce sem." color="#f59e0b" />
        <StatCard icon={<ClipboardList size={18} />} label={t('dashboard.student.home.stats.absences')} value={stats.absences} sub="Justifiées" color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <ChartCard title={t('dashboard.student.home.profileTitle')} subtitle={t('dashboard.student.home.profileSubtitle')}>
          <ResponsiveContainer width="100%" height={220}>
            {notesGraphiques.length === 0 ? <div className="h-full flex items-center justify-center text-[11px] opacity-40">Aucune donnée disponible</div> : (
              <RadarChart data={notesGraphiques}>
                <PolarGrid stroke={darkMode ? '#ffffff15' : '#00000012'} />
                <PolarAngleAxis dataKey="matiere" tick={{ fontSize: 10, fill: darkMode ? '#ffffff70' : '#00000070' }} />
                <Radar name="Note" dataKey="note" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} strokeWidth={2} dot={{ r: 3, fill: 'var(--primary)' }} />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              </RadarChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('dashboard.student.home.detailsTitle')} subtitle={t('dashboard.student.home.detailsSubtitle')}>
          <ResponsiveContainer width="100%" height={220}>
            {notesGraphiques.length === 0 ? <div className="h-full flex items-center justify-center text-[11px] opacity-40">Aucune donnée disponible</div> : (
              <BarChart data={notesGraphiques} margin={{ top: 4, right: 8, left: -24, bottom: 0 }} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
                <XAxis dataKey="matiere" tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 20]} tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                <Bar dataKey="note" name="Note" radius={[4, 4, 0, 0]} fill="var(--primary)" fillOpacity={0.85} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('dashboard.student.home.trendTitle')} subtitle={t('dashboard.student.home.trendSubtitle')}>
          <ResponsiveContainer width="100%" height={220}>
            {historiqueSemestres.length === 0 ? <div className="h-full flex items-center justify-center text-[11px] opacity-40">Aucun historique disponible</div> : (
              <LineChart data={historiqueSemestres} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
                <XAxis dataKey="sem" tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                <YAxis domain={[10, 20]} tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                <Line type="monotone" dataKey="moy" name="Moyenne" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-black tracking-tight">{t('dashboard.student.home.weekTitle')}</h2>
            <button className="text-[10px] font-bold uppercase tracking-wider hover:opacity-70 cursor-pointer" style={{ color: 'var(--primary)' }} onClick={() => navigate('/etudiants/edt')}>{t('dashboard.student.home.weekButton')}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {[t('dashboard.student.home.headers.day'), t('dashboard.student.home.headers.time'), t('dashboard.student.home.headers.subject'), t('dashboard.student.home.headers.room'), t('dashboard.student.home.headers.type')].map((h) => <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {edtSemaine.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 opacity-45">{t('dashboard.student.home.noWeekCourse')}</td></tr>
                ) : (
                  edtSemaine.map((row, i) => (
                    <tr key={i} className="border-b transition hover:opacity-75" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-bold">{row.jour}</td>
                      <td className="px-4 py-3 opacity-60 whitespace-nowrap">{row.heure}</td>
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
              <h2 className="text-sm font-black tracking-tight">{t('dashboard.student.home.watchTitle')}</h2>
              <p className="text-[11px] opacity-45 mt-0.5">{t('dashboard.student.home.watchSubtitle')}</p>
            </div>
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {notesGraphiques.filter((m) => m.note < 12).length === 0 ? (
                <li className="p-4 text-center opacity-40 text-[11px]">{t('dashboard.student.home.excellent')}</li>
              ) : (
                notesGraphiques.filter((m) => m.note < 12).map((m, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2"><AlertCircle size={13} className="text-red-500 shrink-0" /><span className="text-xs font-semibold">{m.matiere}</span></div>
                    <span className="text-xs font-black text-red-500">{m.note}/20</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-2xl border overflow-hidden flex-1" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black tracking-tight">{t('dashboard.student.home.deadlinesTitle')}</h2>
            </div>
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {echeances.length === 0 ? (
                <li className="p-4 text-center opacity-40 text-[11px]">{t('dashboard.student.home.noDeadline')}</li>
              ) : (
                echeances.map((e, i) => (
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
