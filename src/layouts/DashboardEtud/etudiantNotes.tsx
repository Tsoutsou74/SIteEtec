import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  ClipboardList, Search, Award, CheckCircle2, 
  AlertTriangle, HelpCircle, TrendingUp 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface NoteDetail {
  id: string;
  code: string;
  matiere: string;
  noteDevoir: number | null; // null si pas encore de note
  noteExamen: number | null;
  coefficient: number;
  enseignant: string;
}

// ─── Données Simulées (Notes du Semestre) ─────────────────
const INITIAL_NOTES: NoteDetail[] = [
  {
    id: 'n-1',
    code: 'INF301',
    matiere: 'Algorithmique Avancée & Complexité',
    noteDevoir: 15,
    noteExamen: 17,
    coefficient: 4,
    enseignant: 'M. ANDRIAMALALA Tahina'
  },
  {
    id: 'n-2',
    code: 'INF302',
    matiere: 'Architecture des Systèmes & Réseaux',
    noteDevoir: 14,
    noteExamen: 14,
    coefficient: 3,
    enseignant: 'Dr. RAZAFIMAHATRATRA A.'
  },
  {
    id: 'n-3',
    code: 'INF303',
    matiere: 'Bases de Données Relationnelles',
    noteDevoir: 16,
    noteExamen: 18,
    coefficient: 3,
    enseignant: 'Mme. RAKOTOMALALA Feno'
  },
  {
    id: 'n-4',
    code: 'INF304',
    matiere: 'Développement Web Full-Stack',
    noteDevoir: 18,
    noteExamen: 19,
    coefficient: 5,
    enseignant: 'M. RANDRIANARISOA Mamy'
  },
  {
    id: 'n-5',
    code: 'MTH301',
    matiere: 'Mathématiques pour l\'Ingénieur',
    noteDevoir: 12,
    noteExamen: 13,
    coefficient: 2,
    enseignant: 'Mme. RAKOTOMALALA Feno'
  },
  {
    id: 'n-6',
    code: 'ANG301',
    matiere: 'Anglais Technique',
    noteDevoir: 14,
    noteExamen: 16,
    coefficient: 2,
    enseignant: 'Mme. RASOAMALALA Lova'
  }
];

export default function Notes() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // ─── Calcul de la moyenne pour une matière ───
  // Règle classique : 40% Devoir + 60% Examen
  const calculerMoyenneMatiere = (devoir: number | null, examen: number | null) => {
    if (devoir === null && examen === null) return null;
    const d = devoir ?? 0;
    const e = examen ?? 0;
    if (devoir !== null && examen === null) return d; // Note de devoir seule
    if (devoir === null && examen !== null) return e; // Note d'examen seule
    return parseFloat((d * 0.4 + e * 0.6).toFixed(2));
  };

  // ─── Filtrage des notes ───
  const filteredNotes = useMemo(() => {
    return INITIAL_NOTES.filter(n => 
      n.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // ─── Calculs globaux (Moyenne générale du semestre) ───
  const statistiquesSemestre = useMemo(() => {
    let totalPoints = 0;
    let totalCoefficients = 0;
    let modulesValides = 0;

    INITIAL_NOTES.forEach(n => {
      const moy = calculerMoyenneMatiere(n.noteDevoir, n.noteExamen);
      if (moy !== null) {
        totalPoints += moy * n.coefficient;
        totalCoefficients += n.coefficient;
        if (moy >= 10) modulesValides++;
      }
    });

    const moyenneGenerale = totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(2) : '0.00';
    return { moyenneGenerale, modulesValides, totalModules: INITIAL_NOTES.length };
  }, []);

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

        {/* Barre de Recherche Rapide */}
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

      {/* ─── Vue d'ensemble / Mini Cartes KPIs ─── */}
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

      {/* ─── Tableau d'Affichage des Notes ─── */}
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
                      {/* Code Matière */}
                      <td className="p-4 font-mono font-bold opacity-60">{item.code}</td>

                      {/* Libellé Matière & Professeur */}
                      <td className="p-4">
                        <div className="font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">{item.matiere}</div>
                        <div className="text-[10px] opacity-40 font-medium mt-0.5">{item.enseignant}</div>
                      </td>

                      {/* Note de Contrôle Continu (Devoir) */}
                      <td className="p-4 text-center font-mono font-semibold">
                        {item.noteDevoir !== null ? `${item.noteDevoir}/20` : <span className="opacity-30">—</span>}
                      </td>

                      {/* Note d'Examen */}
                      <td className="p-4 text-center font-mono font-semibold">
                        {item.noteExamen !== null ? `${item.noteExamen}/20` : <span className="opacity-30">—</span>}
                      </td>

                      {/* Coefficient */}
                      <td className="p-4 text-center font-mono opacity-70 font-bold">{item.coefficient}</td>

                      {/* Moyenne Pondérée Calculée */}
                      <td className="p-4 text-center font-mono font-black text-xs">
                        {moyenne !== null ? (
                          <span className={estValide ? 'text-[var(--primary)]' : 'text-rose-500'}>
                            {moyenne.toFixed(2)}
                          </span>
                        ) : (
                          <span className="opacity-30">N/A</span>
                        )}
                      </td>

                      {/* Statut (Badge Validé ou Rattr.) */}
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