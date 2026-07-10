import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/ApiService';
import { Users, UserCheck, BookOpen, ClipboardList } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

function CustomTooltip({ active, payload, label, darkMode }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border shadow-xl px-3 py-2 text-xs" style={{ backgroundColor: darkMode ? 'rgba(20,20,20,0.97)' : 'rgba(255,255,255,0.97)', borderColor: 'var(--border)', color: 'var(--text)' }}>
      <p className="font-bold mb-1 opacity-60">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name} : <strong>{p.value.toLocaleString()}</strong></p>
      ))}
    </div>
  );
}

function StatCard({ icon, label, value, delta, color, onClick }: { icon: React.ReactNode; label: string; value: string; delta: string; color: string; onClick?: () => void; }) {
  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-md cursor-pointer" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '18', color }}>{icon}</div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: color + '15', color }}>{delta}</span>
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
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ etudiants: '0', enseignants: '0', formations: '0', dossiers: '0' });
  const [recentsInscriptions, setRecentsInscriptions] = useState<any[]>([]);
  const [inscriptionsData] = useState<any[]>([]);
  const [filiereData] = useState<any[]>([]);
  const [insertionData] = useState<any[]>([]);
  const [tauxReussiteData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resEtudiants, resEnseignants, resFiliers, resDemandes] = await Promise.all([
          ApiService?.etudiant?.getAll().catch(() => ({ data: [] })),
          ApiService?.enseignant?.getAll().catch(() => ({ data: [] })),
          ApiService?.filieres?.getAll().catch(() => ({ data: [] })),
          ApiService?.contacts?.getAll().catch(() => ({ data: [] })),
        ]);

        setStats({
          etudiants: resEtudiants?.data ? resEtudiants.data.length.toLocaleString() : '0',
          enseignants: resEnseignants?.data ? resEnseignants.data.length.toLocaleString() : '0',
          formations: resFiliers?.data ? resFiliers.data.length.toLocaleString() : '0',
          dossiers: resDemandes?.data ? resDemandes.data.length.toLocaleString() : '0',
        });

        if (resEtudiants?.data && resEtudiants.data.length > 0) {
          const transformes = resEtudiants.data.slice(-5).reverse().map((e: any) => ({
            nom: `${e.nom || ''} ${e.prenom || ''}`.trim() || 'Sans nom',
            filiere: e.filiere || 'Génie Logiciel',
            date: e.dateInscription || new Date().toLocaleDateString('fr-FR'),
            statut: e.statut || 'En attente',
            color: e.statut === 'Refusé' ? '#ef4444' : e.statut === 'Validé' ? '#22c55e' : '#f59e0b',
          }));
          setRecentsInscriptions(transformes);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données API', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight">{t('dashboard.admin.home.title')}</h1>
        <p className="text-xs opacity-45 mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={18} />} label={t('dashboard.admin.home.students')} value={stats.etudiants} delta={t('dashboard.admin.home.apiFlux')} color="#3b82f6" onClick={() => navigate('/admin/etudiants')} />
        <StatCard icon={<UserCheck size={18} />} label={t('dashboard.admin.home.teachers')} value={stats.enseignants} delta={t('dashboard.admin.home.apiFlux')} color="#22c55e" onClick={() => navigate('/admin/Enseignant/AdmineEnseignants')} />
        <StatCard icon={<BookOpen size={18} />} label={t('dashboard.admin.home.formations')} value={stats.formations} delta={t('dashboard.admin.home.apiFlux')} color="#f59e0b" onClick={() => navigate('/admin/Formations/Filiers')} />
        <StatCard icon={<ClipboardList size={18} />} label={t('dashboard.admin.home.dossiers')} value={stats.dossiers} delta={t('dashboard.admin.home.apiFlux')} color="#ef4444" onClick={() => navigate('/admin/Notes&Resultats')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title={t('dashboard.admin.home.monthlyTitle')} subtitle={t('dashboard.admin.home.monthlySubtitle')}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={inscriptionsData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs><linearGradient id="gradEtu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
              <XAxis dataKey="mois" tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="etudiants" name={t('dashboard.admin.home.headers.student')} stroke="#3b82f6" fill="url(#gradEtu)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('dashboard.admin.home.byProgramTitle')} subtitle={t('dashboard.admin.home.byProgramSubtitle')}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={filiereData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {filiereData.map((entry, i) => <Cell key={i} fill={entry.color || '#3b82f6'} />)}
              </Pie>
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('dashboard.admin.home.insertionTitle')} subtitle={t('dashboard.admin.home.insertionSubtitle')}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={insertionData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
              <XAxis dataKey="annee" tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Line type="monotone" dataKey="taux" name="Taux (%)" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title={t('dashboard.admin.home.successTitle')} subtitle={t('dashboard.admin.home.successSubtitle')}>
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

        <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-black tracking-tight">{t('dashboard.admin.home.recentTitle')}</h2>
            <button className="text-[10px] font-bold uppercase tracking-wider hover:opacity-70 cursor-pointer" style={{ color: 'var(--primary)' }} onClick={() => navigate('/admin/etudiants/inscriptions')}>
              {t('dashboard.admin.home.viewAll')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {[t('dashboard.admin.home.headers.student'), t('dashboard.admin.home.headers.program'), t('dashboard.admin.home.headers.date'), t('dashboard.admin.home.headers.status')].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentsInscriptions.length > 0 ? (
                  recentsInscriptions.map((row, i) => (
                    <tr key={i} className="border-b transition hover:opacity-75 cursor-pointer" style={{ borderColor: 'var(--border)' }} onClick={() => navigate('/admin/etudiants')}>
                      <td className="px-5 py-3 font-semibold">{row.nom}</td>
                      <td className="px-5 py-3 opacity-65">{row.filiere}</td>
                      <td className="px-5 py-3 opacity-55">{row.date}</td>
                      <td className="px-5 py-3"><span className="px-2 py-1 rounded-full text-[10px] font-black" style={{ backgroundColor: row.color + '18', color: row.color }}>{row.statut}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8 opacity-45">{t('dashboard.admin.home.empty')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
