import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/ApiService';
import { 
  ClipboardList, Search, Award, CheckCircle2, 
  AlertTriangle, HelpCircle, TrendingUp, Loader2 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface NoteDetail {
  id: string;
  code: string;
  matiere: string;
  noteDevoir: number | null;
  noteExamen: number | null;
  coefficient: number;
  enseignant: string;
}

export default function Notes() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<NoteDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // ─── Récupération des Notes depuis l'API ──────────────────
  useEffect(() => {
    const fetchNotesData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      };

      try {
        if (ApiService.etudiant?.getNotesDetail) {
          const res = await ApiService.etudiant.getNotesDetail(config);
          if (res && res.data) {
            setNotes(res.data);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des notes :", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotesData();
  }, []);

  // ─── Calcul de la moyenne pour une matière ───
  const calculerMoyenneMatiere = (devoir: number | null, examen: number | null) => {
    if (devoir === null && examen === null) return null;
    const d = devoir ?? 0;
    const e = examen ?? 0;
    if (devoir !== null && examen === null) return d;
    if (devoir === null && examen !== null) return e;
    return parseFloat((d * 0.4 + e * 0.6).toFixed(2));
  };

  // ─── Filtrage des notes ───
  const filteredNotes = useMemo(() => {
    return notes.filter(n => 
      n.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, notes]);

  // ─── Calculs globaux dynamiques ───
  const statistiquesSemestre = useMemo(() => {
    let totalPoints = 0;
    let totalCoefficients = 0;
    let modulesValides = 0;

    notes.forEach(n => {
      const moy = calculerMoyenneMatiere(n.noteDevoir, n.noteExamen);
      if (moy !== null) {
        totalPoints += moy * n.coefficient;
        totalCoefficients += n.coefficient;
        if (moy >= 10) modulesValides++;
      }
    });

    const moyenneGenerale = totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(2) : '0.00';
    return { moyenneGenerale, modulesValides, totalModules: notes.length };
  }, [notes]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 opacity-60 text-xs">
        <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
        <p className="font-bold">Chargement de vos notes et résultats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <ClipboardList className="text-[var(--primary)]" size={24} />
            Mon Relevé de Notes Spontané
          </h1>
          <p className="text-xs opacity-45 mt-0.5">
            Suivi en temps réel de vos résultats académiques pour le semestre en cours.
          </p>
        </div>

        {/* Barre de Recherche */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 opacity-40" size={14} />
          <input
            type="text"
            placeholder="Rechercher une note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full font-medium text-xs pl-9 pr-4 py-2 rounded-xl border bg-transparent focus:outline-hidden focus:border-[var(--primary)]"
            style={borderStyle}
          />
        </div>
      </div>

      {/* ─── Vue d'ensemble KPIs ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border flex items-center gap-4" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight">{statistiquesSemestre.moyenneGenerale} / 20</div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-40 mt-0.5">Moyenne Générale Pondérée</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border flex items-center gap-4" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Award size={18} />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight">
              {statistiquesSemestre.modulesValides} / {statistiquesSemestre.totalModules}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-40 mt-0.5">Modules Validés (Moy ≥ 10)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border flex items-center gap-4 bg-black/[0.01] dark:bg-white/[0.01]" style={borderStyle}>
          <div className="w-9 h-9 rounded-xl bg-neutral-500/10 opacity-60 flex items-center justify-center shrink-0">
            <HelpCircle size={18} />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">Pondération en vigueur</div>
            <div className="text-[10px] opacity-50 mt-0.5">Contrôle Continu (40%) · Examen Final (60%)</div>
          </div>
        </div>
      </div>

      {/* ─── Tableau des Notes ─── */}
      <div className="rounded-2xl border overflow-hidden shadow-xs" style={{ backgroundColor: cardBg, ...borderStyle }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-black/[0.01] dark:bg-white/[0.01] uppercase text-[10px] tracking-wider opacity-60 font-black" style={{ borderColor: 'var(--border)' }}>
                <th className="p-4 w-24">Code</th>
                <th className="p-4">Matière / Enseignant</th>
                <th className="p-4 text-center w-24">Note CC (40%)</th>
                <th className="p-4 text-center w-24">Note Exam (60%)</th>
                <th className="p-4 text-center w-16">Coef.</th>
                <th className="p-4 text-center w-28">Moyenne CC+Exam</th>
                <th className="p-4 text-right w-28">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center opacity-50 font-medium">
                    Aucun résultat trouvé pour votre recherche.
                  </td>
                </tr>
              ) : (
                filteredNotes.map((item) => {
                  const moyenne = calculerMoyenneMatiere(item.noteDevoir, item.noteExamen);
                  const estValide = moyenne !== null && moyenne >= 10;

                  return (
                    <tr key={item.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 font-mono font-bold opacity-60">{item.code}</td>
                      <td className="p-4">
                        <div className="font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">{item.matiere}</div>
                        <div className="text-[10px] opacity-40 font-medium mt-0.5">{item.enseignant}</div>
                      </td>
                      <td className="p-4 text-center font-mono font-semibold">
                        {item.noteDevoir !== null ? `${item.noteDevoir}/20` : <span className="opacity-30">—</span>}
                      </td>
                      <td className="p-4 text-center font-mono font-semibold">
                        {item.noteExamen !== null ? `${item.noteExamen}/20` : <span className="opacity-30">—</span>}
                      </td>
                      <td className="p-4 text-center font-mono opacity-70 font-bold">{item.coefficient}</td>
                      <td className="p-4 text-center font-mono font-black text-xs">
                        {moyenne !== null ? (
                          <span className={estValide ? 'text-[var(--primary)]' : 'text-rose-500'}>
                            {moyenne.toFixed(2)}
                          </span>
                        ) : (
                          <span className="opacity-30">N/A</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {moyenne !== null ? (
                          estValide ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
                              <CheckCircle2 size={10} /> Validé
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/10">
                              <AlertTriangle size={10} /> Rattr.
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-neutral-500/10 opacity-40">
                            En cours
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}