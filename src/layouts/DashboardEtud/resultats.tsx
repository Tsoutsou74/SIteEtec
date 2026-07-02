import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Award, CheckCircle2, XCircle, ShieldCheck, 
  ChevronDown, ChevronUp, FileText, Info 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface MatiereResultat {
  code: string;
  nom: string;
  note: number;
  credit: number;
  valide: boolean;
}

interface UniteEnseignement {
  id: string;
  codeUE: string;
  nomUE: string;
  creditsUE: number;
  moyenneUE: number;
  valide: boolean;
  matieres: MatiereResultat[];
}

// ─── Données Simulées (Délibérations de Fin de Semestre) ──
const COMPTE_RENDU_RESULTATS = {
  semestre: 'Semestre 1 - L3 Génie Logiciel',
  anneeUniversitaire: '2025 - 2026',
  moyenneGenerale: 15.68,
  totalCreditsAcquis: 30,
  totalCreditsSemestre: 30,
  statutFinal: 'Admis (Semestre Validé)',
  mention: 'Bien',
  decisionJury: 'Session Principale - Décision validée par le président du jury.',
  ues: [
    {
      id: 'ue-1',
      codeUE: 'UE-INF31',
      nomUE: 'Sciences de l\'Ingénieur & Code',
      creditsUE: 12,
      moyenneUE: 16.15,
      valide: true,
      matieres: [
        { code: 'INF301', nom: 'Algorithmique Avancée & Complexité', note: 16.20, credit: 4, valide: true },
        { code: 'INF304', nom: 'Développement Web Full-Stack', note: 18.60, credit: 5, valide: true },
        { code: 'INF302', nom: 'Architecture des Systèmes & Réseaux', note: 14.00, credit: 3, valide: true },
      ]
    },
    {
      id: 'ue-2',
      codeUE: 'UE-INF32',
      nomUE: 'Données & Logique',
      creditsUE: 5,
      moyenneUE: 17.20,
      valide: true,
      matieres: [
        { code: 'INF303', nom: 'Bases de Données Relationnelles', note: 17.20, credit: 5, valide: true },
      ]
    },
    {
      id: 'ue-3',
      codeUE: 'UE-GEN31',
      nomUE: 'Formations Transversales',
      creditsUE: 4,
      moyenneUE: 14.50,
      valide: true,
      matieres: [
        { code: 'ANG301', nom: 'Anglais Technique', note: 15.00, credit: 2, valide: true },
        { code: 'MNG301', nom: 'Gestion d\'Entreprise & Projets', note: 14.00, credit: 2, valide: true },
      ]
    },
    {
      id: 'ue-4',
      codeUE: 'UE-MTH31',
      nomUE: 'Outils Scientifiques',
      creditsUE: 9,
      moyenneUE: 12.60,
      valide: true,
      matieres: [
        { code: 'MTH301', nom: 'Mathématiques pour l\'Ingénieur', note: 12.60, credit: 5, valide: true },
        { code: 'MTH302', nom: 'Probabilités & Statistiques', note: 12.60, credit: 4, valide: true },
      ]
    }
  ] as UniteEnseignement[]
};

export default function Resultats() {
  const { darkMode } = useTheme();
  const [expandedUE, setExpandedUE] = useState<Record<string, boolean>>({ 'ue-1': true });

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // Basculer l'affichage des matières d'une UE
  const toggleUE = (id: string) => {
    setExpandedUE(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <Award className="text-[var(--primary)]" size={24} />
            Résultats & Délibérations
          </h1>
          <p className="text-xs opacity-45 mt-0.5">
            Publication officielle des notes de jury, crédits ECTS et statuts de validation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Impression du relevé provisoire...")}
          className="flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer self-start sm:self-center"
          style={borderStyle}
        >
          <FileText size={14} />
          <span>Exporter en PDF</span>
        </button>
      </div>

      {/* ─── Récapitulatif Macro (Bento Grid Global) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Moyenne & Mention */}
        <div className="p-5 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-45">Moyenne du Semestre</span>
          <div className="mt-4">
            <h2 className="text-3xl font-black tracking-tight text-[var(--primary)]">
              {COMPTE_RENDU_RESULTATS.moyenneGenerale.toFixed(2)} <span className="text-xs opacity-40 font-medium">/20</span>
            </h2>
            <p className="text-xs font-bold opacity-75 mt-1">Mention : {COMPTE_RENDU_RESULTATS.mention}</p>
          </div>
        </div>

        {/* Crédits ECTS */}
        <div className="p-5 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-45">Crédits Capitalisés</span>
          <div className="mt-4">
            <h2 className="text-3xl font-black tracking-tight">
              {COMPTE_RENDU_RESULTATS.totalCreditsAcquis} <span className="text-xs opacity-40 font-medium">/ {COMPTE_RENDU_RESULTATS.totalCreditsSemestre} ECTS</span>
            </h2>
            <p className="text-xs font-bold text-emerald-500 mt-1">Progression académique complète</p>
          </div>
        </div>

        {/* Verdict Final Jury */}
        <div className="p-5 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-45">Résultat du Jury</span>
          <div className="mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
              <ShieldCheck size={14} /> ADMIS
            </div>
            <p className="text-[10px] opacity-50 font-medium mt-2 leading-snug">
              {COMPTE_RENDU_RESULTATS.decisionJury}
            </p>
          </div>
        </div>
      </div>

      {/* Info contextuelle du diplôme */}
      <div className="px-4 py-3 rounded-xl border bg-black/[0.01] dark:bg-white/[0.01] flex items-center gap-2.5 text-xs font-medium" style={borderStyle}>
        <Info size={14} className="text-[var(--primary)] shrink-0" />
        <span className="opacity-70">
          Résultats clôturés pour l'année <strong>{COMPTE_RENDU_RESULTATS.anneeUniversitaire}</strong> · {COMPTE_RENDU_RESULTATS.semestre}
        </span>
      </div>

      {/* ─── Liste Détaillée des UEs ─── */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-black uppercase tracking-wider opacity-60">Détails des Unités d'Enseignement</h3>

        {COMPTE_RENDU_RESULTATS.ues.map((ue) => {
          const isExpanded = !!expandedUE[ue.id];
          return (
            <div 
              key={ue.id} 
              className="rounded-2xl border overflow-hidden transition-all"
              style={{ backgroundColor: cardBg, ...borderStyle }}
            >
              {/* Ligne d'entête de l'UE */}
              <div 
                onClick={() => toggleUE(ue.id)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-black/[0.01] dark:hover:bg-white/[0.01]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-[10px] font-bold opacity-50 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded shrink-0">
                    {ue.codeUE}
                  </span>
                  <h4 className="text-xs font-black tracking-tight truncate">{ue.nomUE}</h4>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right text-xs">
                    <div className="font-black text-[var(--primary)]">{ue.moyenneUE.toFixed(2)}</div>
                    <div className="text-[9px] opacity-40 font-bold">{ue.creditsUE} ECTS</div>
                  </div>

                  {ue.valide ? (
                    <span className="text-emerald-500" title="UE Validée"><CheckCircle2 size={16} /></span>
                  ) : (
                    <span className="text-rose-500" title="UE non validée"><XCircle size={16} /></span>
                  )}

                  <span className="opacity-40">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>
              </div>

              {/* Sous-tableau des Matières associées (ECU) */}
              {isExpanded && (
                <div className="border-t bg-black/[0.01] dark:bg-white/[0.01]" style={borderStyle}>
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b text-[9px] uppercase tracking-wider opacity-45 font-black" style={{ borderColor: 'var(--border)' }}>
                        <th className="p-3 pl-6 w-24">Code</th>
                        <th className="p-3">Matières constitutifs</th>
                        <th className="p-3 text-center w-20">Crédits</th>
                        <th className="p-3 text-center w-24">Note Jury</th>
                        <th className="p-3 text-right pr-6 w-24">Résultat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {ue.matieres.map((mat, idx) => (
                        <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 pl-6 font-mono font-bold opacity-50">{mat.code}</td>
                          <td className="p-3 font-semibold text-neutral-800 dark:text-neutral-200">{mat.nom}</td>
                          <td className="p-3 text-center font-mono opacity-60">{mat.credit}</td>
                          <td className="p-3 text-center font-mono font-bold text-xs">{mat.note.toFixed(2)}</td>
                          <td className="p-3 text-right pr-6">
                            <span className={`font-bold ${mat.valide ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {mat.valide ? 'Acquis' : 'Ajourné'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}