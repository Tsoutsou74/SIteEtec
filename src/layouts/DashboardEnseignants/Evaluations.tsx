import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

import { 
  Award, Save, Percent, Users, TrendingUp, 
  TrendingDown, FileSpreadsheet, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface EtudiantNote {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  note: number | '';
  absent: boolean;
}

interface ConfigurationSaisie {
  classe: string;
  matiere: string;
  evaluation: string;
}

// Les listes de structures fixes
const CLASSES = ['L1 Info A', 'L1 Info B', 'L2 Info B', 'L3 Info', 'M1 GL'];
const EVALUATIONS = ['Devoir 1', 'Devoir 2', 'Examen Terminal', 'Session Pratique (TP)'];

export default function Evaluations() {
  const { darkMode } = useTheme();
  
  // États de configuration du filtrage
  const [config, setConfig] = useState<ConfigurationSaisie>({
    classe: 'L1 Info A',
    matiere: '',
    evaluation: EVALUATIONS[0]
  });

  // États pour les données dynamiques, chargements et erreurs
  const [matieres, setMatieres] = useState<string[]>([]);
  const [etudiants, setEtudiants] = useState<EtudiantNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // 1. Charger les matières et étudiants dès que la classe change
  useEffect(() => {
    const fetchDataPourClasse = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsSaved(false);

        const matieresData = ['Algorithmique', 'Base de données', 'Programmation C'];
        const etudiantsData: EtudiantNote[] = [
          { id: '1', matricule: 'ETU001', nom: 'Dupont', prenom: 'Jean', note: 14, absent: false },
          { id: '2', matricule: 'ETU002', nom: 'Martin', prenom: 'Sophie', note: 18, absent: false },
          { id: '3', matricule: 'ETU003', nom: 'Lefebvre', prenom: 'Luc', note: 9, absent: false },
          { id: '4', matricule: 'ETU004', nom: 'Moreau', prenom: 'Alice', note: '', absent: true },
        ];

        setMatieres(matieresData);
        setEtudiants(etudiantsData);
        
        // Mettre à jour la matière sélectionnée par défaut si nécessaire
        if (matieresData && matieresData.length > 0 && !matieresData.includes(config.matiere)) {
          setConfig(prev => ({ ...prev, matiere: matieresData[0] }));
        }
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataPourClasse();
  }, [config.classe]);

  // 2. Recharger uniquement les étudiants si la matière ou l'évaluation change
  useEffect(() => {
    if (!config.matiere) return;

    const fetchNotesEtudiants = async () => {
      try {
        setError(null);
        setIsSaved(false);
        const etudiantsData: EtudiantNote[] = [
          { id: '1', matricule: 'ETU001', nom: 'Dupont', prenom: 'Jean', note: 14, absent: false },
          { id: '2', matricule: 'ETU002', nom: 'Martin', prenom: 'Sophie', note: 18, absent: false },
          { id: '3', matricule: 'ETU003', nom: 'Lefebvre', prenom: 'Luc', note: 9, absent: false },
          { id: '4', matricule: 'ETU004', nom: 'Moreau', prenom: 'Alice', note: '', absent: true },
        ];
        setEtudiants(etudiantsData);
      } catch (err) {
        console.error("Erreur:", err);
      }
    };

    fetchNotesEtudiants();
  }, [config.matiere, config.evaluation]);

  // Gestion du changement de classe
  const handleClasseChange = (classe: string) => {
    setConfig(prev => ({
      ...prev,
      classe,
      matiere: '' // Réinitialisé temporairement en attendant le hook
    }));
  };

  // Gestion de la modification de note
  const handleNoteChange = (id: string, value: string) => {
    setIsSaved(false);
    setEtudiants(prev => prev.map(e => {
      if (e.id !== id) return e;
      if (value === '') return { ...e, note: '' };
      
      let numNote = parseFloat(value);
      if (numNote < 0) numNote = 0;
      if (numNote > 20) numNote = 20;
      return { ...e, note: numNote, absent: false };
    }));
  };

  // Gestion du toggle Absence
  const handleAbsentToggle = (id: string) => {
    setIsSaved(false);
    setEtudiants(prev => prev.map(e => {
      if (e.id !== id) return e;
      const newAbsent = !e.absent;
      return { ...e, absent: newAbsent, note: newAbsent ? '' : 0 };
    }));
  };

  // Calcul des statistiques en temps réel (useMemo)
  const stats = useMemo(() => {
    const notesValides = etudiants.filter(e => !e.absent && e.note !== '') as { note: number }[];
    if (notesValides.length === 0) return { moyenne: 0, max: 0, min: 0, tauxReussite: 0, effectif: etudiants.length };

    const valeurs = notesValides.map(e => e.note);
    const somme = valeurs.reduce((acc, curr) => acc + curr, 0);
    const moyenne = somme / valeurs.length;
    const max = Math.max(...valeurs);
    const min = Math.min(...valeurs);
    
    const admis = valeurs.filter(n => n >= 10).length;
    const tauxReussite = (admis / valeurs.length) * 100;

    return {
      moyenne: parseFloat(moyenne.toFixed(2)),
      max,
      min,
      tauxReussite: parseFloat(tauxReussite.toFixed(1)),
      effectif: etudiants.length
    };
  }, [etudiants]);

  // Sauvegarde des données
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          <Award className="text-[var(--primary)]" size={22} />
          Saisie des Notes & Évaluations
        </h1>
        <p className="text-xs opacity-50 mt-0.5">Sélectionnez un groupe pour encoder les résultats académiques.</p>
      </div>

      {/* ─── Sélecteurs de Configuration ─── */}
      <div className="p-4 rounded-2xl border grid grid-cols-1 md:grid-cols-3 gap-4 shadow-xs" style={{ backgroundColor: cardBg, ...borderStyle }}>
        <div>
          <label className="block text-[10px] font-black uppercase opacity-50 mb-1.5 tracking-wider">Classe / Promotion</label>
          <select 
            value={config.classe}
            onChange={(e) => handleClasseChange(e.target.value)}
            disabled={submitting}
            className="w-full text-xs p-2.5 rounded-xl border bg-transparent font-medium focus:outline-hidden focus:border-[var(--primary)]"
            style={borderStyle}
          >
            {CLASSES.map(c => <option key={c} value={c} className="dark:bg-[#121212]">{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase opacity-50 mb-1.5 tracking-wider">Matière / ECUE</label>
          <select 
            value={config.matiere}
            onChange={(e) => setConfig({ ...config, matiere: e.target.value })}
            disabled={loading || submitting}
            className="w-full text-xs p-2.5 rounded-xl border bg-transparent font-medium focus:outline-hidden focus:border-[var(--primary)] disabled:opacity-50"
            style={borderStyle}
          >
            {matieres.map(m => (
              <option key={m} value={m} className="dark:bg-[#121212]">{m}</option> 
            ))}
            {matieres.length === 0 && <option value="">Aucune matière disponible</option>}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase opacity-50 mb-1.5 tracking-wider">Type d'Évaluation</label>
          <select 
            value={config.evaluation}
            onChange={(e) => setConfig({ ...config, evaluation: e.target.value })}
            disabled={submitting}
            className="w-full text-xs p-2.5 rounded-xl border bg-transparent font-medium focus:outline-hidden focus:border-[var(--primary)]"
            style={borderStyle}
          >
            {EVALUATIONS.map(ev => <option key={ev} value={ev} className="dark:bg-[#121212]">{ev}</option>)}
          </select>
        </div>
      </div>

      {/* ─── Global Error Feedback ─── */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Statistiques Flash de la Saisie (KPIs) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border flex items-center justify-between" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <div>
            <span className="text-[10px] font-bold opacity-50 block uppercase tracking-wider">Moyenne</span>
            <span className="text-base font-black tracking-tight">{loading ? '...' : stats.moyenne} <span className="text-[10px] font-normal opacity-50">/20</span></span>
          </div>
          <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 opacity-70"><Percent size={14} /></div>
        </div>

        <div className="p-3.5 rounded-xl border flex items-center justify-between" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <div>
            <span className="text-[10px] font-bold opacity-50 block uppercase tracking-wider">Taux de Réussite</span>
            <span className={`text-base font-black tracking-tight ${stats.tauxReussite >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {loading ? '...' : `${stats.tauxReussite}%`}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 opacity-70">
            {stats.tauxReussite >= 50 ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-amber-500" />}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border flex items-center justify-between" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <div>
            <span className="text-[10px] font-bold opacity-50 block uppercase tracking-wider">Note Max / Min</span>
            <span className="text-sm font-black tracking-tight flex gap-2">
              <span className="text-emerald-500">↑{loading ? '..' : stats.max}</span>
              <span className="text-amber-500">↓{loading ? '..' : stats.min}</span>
            </span>
          </div>
          <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 opacity-70"><FileSpreadsheet size={14} /></div>
        </div>

        <div className="p-3.5 rounded-xl border flex items-center justify-between" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <div>
            <span className="text-[10px] font-bold opacity-50 block uppercase tracking-wider">Élèves inscrits</span>
            <span className="text-base font-black tracking-tight">{loading ? '...' : stats.effectif}</span>
          </div>
          <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 opacity-70"><Users size={14} /></div>
        </div>
      </div>

      {/* ─── Formulaire de Saisie Tableau ─── */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="rounded-2xl border overflow-hidden shadow-xs" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-black/[0.01] dark:bg-white/[0.01] uppercase text-[10px] tracking-wider opacity-60 font-black" style={{ borderColor: 'var(--border)' }}>
                  <th className="p-4 w-32">Matricule</th>
                  <th className="p-4">Nom & Prénoms</th>
                  <th className="p-4 text-center w-28">Statut</th>
                  <th className="p-4 text-center w-36">Note (/20)</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center opacity-60 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin text-[var(--primary)]" size={16} />
                        Récupération des dossiers étudiants...
                      </div>
                    </td>
                  </tr>
                ) : etudiants.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center opacity-50 font-medium">Aucun étudiant inscrit dans cette classe.</td>
                  </tr>
                ) : (
                  etudiants.map((etudiant) => (
                    <tr 
                      key={etudiant.id} 
                      className={`transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.01] ${etudiant.absent ? 'opacity-40 bg-black/[0.02] dark:bg-white/[0.02]' : ''}`}
                    >
                      <td className="p-4 font-mono text-[11px] font-bold">{etudiant.matricule}</td>
                      <td className="p-4 font-bold tracking-tight">
                        <span className="uppercase">{etudiant.nom}</span> {etudiant.prenom}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleAbsentToggle(etudiant.id)}
                          disabled={submitting}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wide uppercase border cursor-pointer transition ${
                            etudiant.absent 
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                              : 'bg-emerald-500/5 text-emerald-500/70 border-transparent hover:border-emerald-500/30'
                          }`}
                        >
                          {etudiant.absent ? 'Absent' : 'Présent'}
                        </button>
                      </td>
                      <td className="p-4 text-center flex justify-center">
                        <div className="relative w-24">
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            max="20"
                            placeholder={etudiant.absent ? 'ABS' : '0.00'}
                            disabled={etudiant.absent || submitting}
                            value={etudiant.note}
                            onChange={(e) => handleNoteChange(etudiant.id, e.target.value)}
                            className={`w-full font-mono font-bold text-center p-2 rounded-xl border focus:outline-hidden focus:border-[var(--primary)] ${
                              etudiant.absent ? 'bg-black/5 dark:bg-white/5 border-transparent cursor-not-allowed' : 'bg-transparent'
                            } ${
                              etudiant.note !== '' && !etudiant.absent && etudiant.note < 10 ? 'border-amber-500/40 text-amber-500 focus:border-amber-500' : ''
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── Barre d'actions & Notifications ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            {isSaved && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-fade-in">
                <CheckCircle size={14} /> Notes sauvegardées avec succès pour {config.classe} ({config.evaluation}).
              </div>
            )}
            {!isSaved && !loading && etudiants.some(e => e.note === '' && !e.absent) && (
              <div className="flex items-center gap-1.5 text-xs font-medium opacity-50">
                <AlertCircle size={14} /> Certaines notes ne sont pas encore renseignées.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || submitting || etudiants.length === 0}
            className="w-full sm:w-auto px-5 py-2.5 bg-[var(--primary)] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={15} />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={15} />
                Sauvegarder le Procès-Verbal
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
