import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Award, CheckCircle2, XCircle, ShieldCheck, 
  ChevronDown, ChevronUp, FileText, Info, Loader2 
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

interface DeliberationData {
  semestre: string;
  anneeUniversitaire: string;
  moyenneGenerale: number;
  totalCreditsAcquis: number;
  totalCreditsSemestre: number;
  statutFinal: string;
  mention: string;
  decisionJury: string;
  ues: UniteEnseignement[];
}

export default function Resultats() {
  const { darkMode } = useTheme();
  
  // ─── États Dynamiques ───────────────────────────────────
  const [deliberation, setDeliberation] = useState<DeliberationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUE, setExpandedUE] = useState<Record<string, boolean>>({});

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // ─── Récupération des Résultats ────────────────
  useEffect(() => {
    const fetchResultatsData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setDeliberation({
          semestre: 'Semestre 5',
          anneeUniversitaire: '2025-2026',
          moyenneGenerale: 14.5,
          totalCreditsAcquis: 30,
          totalCreditsSemestre: 30,
          statutFinal: 'Admis',
          mention: 'Bien',
          decisionJury: 'Admis(e) à passer au semestre suivant',
          ues: [
            {
              id: 'ue1', codeUE: 'UE51', nomUE: 'Ingénierie Logicielle', creditsUE: 15, moyenneUE: 15.2, valide: true,
              matieres: [
                { code: 'IL501', nom: 'Génie Logiciel Avancé', note: 16, credit: 5, valide: true },
                { code: 'IL502', nom: 'Architecture des Systèmes', note: 14.5, credit: 10, valide: true }
              ]
            },
            {
              id: 'ue2', codeUE: 'UE52', nomUE: 'Développement Web', creditsUE: 15, moyenneUE: 13.8, valide: true,
              matieres: [
                { code: 'DW501', nom: 'Frameworks JavaScript', note: 15, credit: 8, valide: true },
                { code: 'DW502', nom: 'Technologies Backend', note: 12.5, credit: 7, valide: true }
              ]
            }
          ]
        });
        setExpandedUE({ 'ue1': true });
      } catch (err) {
        console.error("Erreur lors de la récupération des notes et délibérations :", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResultatsData();
  }, []);

  // Basculer l'affichage des matières d'une UE
  const toggleUE = (id: string) => {
    setExpandedUE(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Écran de chargement principal
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3 opacity-60 text-xs">
        <Loader2 size={26} className="animate-spin text-[var(--primary)]" />
        <p className="font-bold">Calcul et récupération de votre relevé de notes officiel...</p>
      </div>
    );
  }

  // Cas où aucune délibération n'est encore publiée
  if (!deliberation) {
    return (
      <div className="max-w-4xl rounded-2xl border p-12 text-center opacity-50 text-xs font-medium" style={borderStyle}>
        Aucun résultat officiel n'a été publié par le jury pour le moment.
      </div>
    );
  }

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
              {deliberation.moyenneGenerale.toFixed(2)} <span className="text-xs opacity-40 font-medium">/20</span>
            </h2>
            <p className="text-xs font-bold opacity-75 mt-1">Mention : {deliberation.mention}</p>
          </div>
        </div>

        {/* Crédits ECTS */}
        <div className="p-5 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-45">Crédits Capitalisés</span>
          <div className="mt-4">
            <h2 className="text-3xl font-black tracking-tight">
              {deliberation.totalCreditsAcquis} <span className="text-xs opacity-40 font-medium">/ {deliberation.totalCreditsSemestre} ECTS</span>
            </h2>
            <p className="text-xs font-bold text-emerald-500 mt-1">Progression académique complète</p>
          </div>
        </div>

        {/* Verdict Final Jury */}
        <div className="p-5 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-45">Résultat du Jury</span>
          <div className="mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
              <ShieldCheck size={14} /> {deliberation.statutFinal.includes('Admis') ? 'ADMIS' : 'AJOURNÉ'}
            </div>
            <p className="text-[10px] opacity-50 font-medium mt-2 leading-snug">
              {deliberation.decisionJury}
            </p>
          </div>
        </div>
      </div>

      {/* Info contextuelle du diplôme */}
      <div className="px-4 py-3 rounded-xl border bg-black/[0.01] dark:bg-white/[0.01] flex items-center gap-2.5 text-xs font-medium" style={borderStyle}>
        <Info size={14} className="text-[var(--primary)] shrink-0" />
        <span className="opacity-70">
          Résultats clôturés pour l'année <strong>{deliberation.anneeUniversitaire}</strong> · {deliberation.semestre}
        </span>
      </div>

      {/* ─── Liste Détaillée des UEs ─── */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-black uppercase tracking-wider opacity-60">Détails des Unités d'Enseignement</h3>

        {deliberation.ues.map((ue) => {
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

              {/* Sous-tableau des Matières associées */}
              {isExpanded && (
                <div className="border-t bg-black/[0.01] dark:bg-white/[0.01]" style={borderStyle}>
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b text-[9px] uppercase tracking-wider opacity-45 font-black" style={{ borderColor: 'var(--border)' }}>
                        <th className="p-3 pl-6 w-24">Code</th>
                        <th className="p-3">Matières constitutives</th>
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