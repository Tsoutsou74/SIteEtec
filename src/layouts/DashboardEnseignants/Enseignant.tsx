import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/ApiService';
import {
  BookOpen, ClipboardList, BarChart3, Clock,
  AlertCircle, FileText, Calendar, Plus, Loader2
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from 'recharts';

// ─── Interfaces des Données API ───────────────────────────────────────
interface RadarData { niveau: string; heures: number; }
interface LineData { sem: string; taux: number; }
interface BarData { mois: string; effectuees: number; quota: number; }
interface CoursSemaine { jour: string; heure: string; classe: string; matiere: string; salle: string; type: string; }
interface Echeance { label: string; date: string; color: string; }
interface NoteRestante { classe: string; statut: string; }

interface DashboardData {
  stats: {
    heuresEffectuees: string;
    heuresQuota: string;
    classesAssignees: string;
    saisieNotesPourcentage: string;
    ressourcesPartagees: string;
  };
  coursParNiveauRadar: RadarData[];
  evolutionReussiteEtudiants: LineData[];
  quotaHeuresBarData: BarData[];
  coursDeLaSemaine: CoursSemaine[];
  notesRestantes: NoteRestante[];
  echeances: Echeance[];
}

// ─── Composants Communs Internes ───────────────────────────────────────
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

// ─── Composant Principal ───────────────────────────────────────────────
export default function DashboardEnseignant() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // ─── États Dynamiques ────────────────────────────────────────────────
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        };

        if (ApiService.enseignant?.getDashboardData) {
          const res = await ApiService.enseignant.getDashboardData(config);
          if (res && res.data) {
            setData(res.data);
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement du tableau de bord enseignant :", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const typeColor = (t: string) =>
    t === 'TP' ? '#3b82f6' : t === 'TD' ? '#f59e0b' : '#22c55e';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-3 opacity-60 text-xs">
        <Loader2 size={28} className="animate-spin text-[var(--primary)]" />
        <p className="font-bold tracking-wide">Initialisation de votre espace enseignant...</p>
      </div>
    );
  }

  return (
    <>
      {/* En-tête */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Espace Enseignant 👋</h1>
          <p className="text-xs opacity-45 mt-1">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}Professeur · Semestre 1
          </p>
        </div>
        <button 
          onClick={() => navigate('/enseignants/Evaluations')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition hover:opacity-80 cursor-pointer"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--primary)', color: '#ffffff' }}
        >
          <Plus size={14} />
          Saisir des Notes
        </button>
      </div>

      {/* Cartes Statistiques (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard 
          icon={<Clock size={18} />} 
          label="Heures Effectuées" 
          value={`${data?.stats.heuresEffectuees || '0h'} / ${data?.stats.heuresQuota || '0h'}`} 
          sub="Quota horaire" 
          color="#22c55e" 
        />
        <StatCard 
          icon={<BookOpen size={18} />} 
          label="Classes Assignées" 
          value={data?.stats.classesAssignees || '0 Groupe'} 
          sub="Attributions" 
          color="#3b82f6" 
        />
        <StatCard 
          icon={<BarChart3 size={18} />} 
          label="Saisie des Notes" 
          value={data?.stats.saisieNotesPourcentage || '0%'} 
          sub="Avancement" 
          color="#f59e0b" 
        />
        <StatCard 
          icon={<FileText size={18} />} 
          label="Ressources Partagées" 
          value={data?.stats.ressourcesPartagees || '0 fichier'} 
          sub="Médiathèque" 
          color="#8b5cf6" 
        />
      </div>

      {/* Section des Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        
        {/* Radar Chart: Volume horaire par niveau */}
        <ChartCard title="Volume par niveau" subtitle="Distribution des heures de cours par classe (S1)">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={data?.coursParNiveauRadar || []}>
              <PolarGrid stroke={darkMode ? '#ffffff15' : '#00000012'} />
              <PolarAngleAxis dataKey="niveau"
                tick={{ fontSize: 10, fill: darkMode ? '#ffffff70' : '#00000070' }} />
              <Radar name="Heures de cours" dataKey="heures" stroke="var(--primary)" fill="var(--primary)"
                fillOpacity={0.25} strokeWidth={2} dot={{ r: 3, fill: 'var(--primary)' }} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart: Suivi mensuel de la charge horaire */}
        <ChartCard title="Heures Mensuelles" subtitle="Heures assurées vs cible mensuelle">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.quotaHeuresBarData || []} margin={{ top: 4, right: 8, left: -24, bottom: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
              <XAxis dataKey="mois" tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 'auto']} tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Bar dataKey="effectuees" name="Heures dispensées" radius={[4, 4, 0, 0]}
                fill="var(--primary)" fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Line Chart: Progression du taux de réussite */}
        <ChartCard title="Performance Globale" subtitle="Évolution du taux de réussite moyen (%)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data?.evolutionReussiteEtudiants || []} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff12' : '#00000010'} />
              <XAxis dataKey="sem" tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 9, fill: darkMode ? '#ffffff55' : '#00000055' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Line type="monotone" dataKey="taux" name="Taux Réussite" stroke="#3b82f6"
                strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Emploi du Temps + Échéances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">

        {/* Emploi du temps hebdomadaire */}
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-sm font-black tracking-tight">Mon Programme de la Semaine</h2>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/10">
              <Calendar size={11} /> Synchronisé
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {['Jour', 'Horaire', 'Niveau / Groupe', 'Matière', 'Salle', 'Type'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.coursDeLaSemaine || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 opacity-40 font-medium">Aucun cours planifié cette semaine.</td>
                  </tr>
                ) : (
                  data?.coursDeLaSemaine.map((row, i) => (
                    <tr key={i} className="border-b transition hover:opacity-75" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-4 py-3 font-bold">{row.jour}</td>
                      <td className="px-4 py-3 opacity-60 whitespace-nowrap">{row.heure}</td>
                      <td className="px-4 py-3 font-bold text-[var(--primary)]">{row.classe}</td>
                      <td className="px-4 py-3 font-semibold">{row.matiere}</td>
                      <td className="px-4 py-3 opacity-55">{row.salle}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-[10px] font-black"
                          style={{ backgroundColor: typeColor(row.type) + '18', color: typeColor(row.type) }}>
                          {row.type}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rappels de tâches prioritaires et échéances */}
        <div className="flex flex-col gap-4">
          
          {/* Saisie manquante (Attente PV) */}
          <div className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black tracking-tight">Saisies de Notes Restantes</h2>
              <p className="text-[11px] opacity-45 mt-0.5">Procès-verbaux d'examens en attente</p>
            </div>
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {(data?.notesRestantes || []).length === 0 ? (
                <li className="px-5 py-4 text-center text-xs opacity-40 font-medium">Tous vos PV de notes sont clos. 🎉</li>
              ) : (
                data?.notesRestantes.map((item, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={13} className="text-amber-500 shrink-0" />
                      <span className="text-xs font-semibold">{item.classe}</span>
                    </div>
                    <span className="text-xs font-black text-amber-500">{item.statut}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Prochaines Échéances Pédagogiques */}
          <div className="rounded-2xl border overflow-hidden flex-1"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black tracking-tight">Échéances & Agenda</h2>
            </div>
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {(data?.echeances || []).length === 0 ? (
                <li className="px-5 py-4 text-center text-xs opacity-40 font-medium">Aucune échéance à venir.</li>
              ) : (
                data?.echeances.map((e, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3 hover:opacity-75 transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.color || 'var(--primary)' }} />
                      <span className="text-xs font-semibold">{e.label}</span>
                    </div>
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