import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, Award, CheckCircle, AlertTriangle, FileText,
  Filter, Download, RefreshCw, ChevronRight, GraduationCap
} from 'lucide-react';

// ── Types pour les notes et résultats ─────────────────────────
interface ModuleResultat {
  id: string;
  code: string;
  nom: string;
  classe: string;
  enseignant: string;
  moyenneClasse: number;
  tauxReussite: number;
  statut: 'En attente' | 'Saisi' | 'Délibéré';
  etudiantsInscrits: number;
}

const INITIAL_MODULES: ModuleResultat[] = [
  {
    id: '1',
    code: 'INF-301',
    nom: 'Architecture des applications Spring Boot',
    classe: 'M1 Génie Logiciel',
    enseignant: 'Dr. Rakoto',
    moyenneClasse: 14.2,
    tauxReussite: 92,
    statut: 'Délibéré',
    etudiantsInscrits: 28
  },
  {
    id: '2',
    code: 'MGT-402',
    nom: 'Gestion financière & Trading Quantitatif',
    classe: 'M2 Management',
    enseignant: 'Mme Razafy',
    moyenneClasse: 11.5,
    tauxReussite: 85,
    statut: 'Saisi',
    etudiantsInscrits: 22
  },
  {
    id: '3',
    code: 'INF-102',
    nom: 'Algorithmique et Structures de Données',
    classe: 'L1 Informatique',
    enseignant: 'M. Randria',
    moyenneClasse: 8.8, // En dessous du seuil de validation (10/20)
    tauxReussite: 48,
    statut: 'Saisi',
    etudiantsInscrits: 45
  },
  {
    id: '4',
    code: 'WEB-201',
    nom: 'Développement Frontend avec React & Vite',
    classe: 'L2 Génie Logiciel',
    enseignant: 'M. Andria',
    moyenneClasse: 0,
    tauxReussite: 0,
    statut: 'En attente',
    etudiantsInscrits: 32
  }
];

export default function NotesResultats() {
  const { darkMode } = useTheme();
  const [modules, setModules] = useState<ModuleResultat[]>(INITIAL_MODULES);
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inputStyle = {
    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  const cardStyle = {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  // ── Filtrage ────────────────────────────────────────────
  const filteredModules = modules.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = m.nom.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.classe.toLowerCase().includes(q);
    const matchStatut = filtreStatut ? m.statut === filtreStatut : true;
    return matchSearch && matchStatut;
  });

  // ── Actions ─────────────────────────────────────────────
  const handleDeliberer = (id: string) => {
    setModules(modules.map(m => {
      if (m.id === id) {
        showToast(`Module ${m.code} officiellement délibéré et verrouillé`);
        return { ...m, statut: 'Délibéré' };
      }
      return m;
    }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const getStatutBadge = (statut: ModuleResultat['statut']) => {
    const styles = {
      'En attente': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      'Saisi': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Délibéré': 'bg-green-500/10 text-green-500 border-green-500/20'
    };
    return <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${styles[statut]}`}>{statut}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-500">
          <CheckCircle size={15} /> {toastMessage}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Notes & Délibérations</h1>
          <p className="text-xs opacity-45 mt-1">Supervisez la rentrée des notes par matière, examinez les moyennes et validez les conseils de classe</p>
        </div>
      </div>

      {/* Barre de Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <Search size={14} className="opacity-40 shrink-0" />
          <input
            type="text" placeholder="Rechercher par module, code ou classe..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
          />
        </div>
        <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none sm:w-48" style={inputStyle}>
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Saisi">Saisi</option>
          <option value="Délibéré">Délibéré</option>
        </select>
      </div>

      {/* Grille / Liste des modules académiques */}
      <div className="grid grid-cols-1 gap-4">
        {filteredModules.length === 0 ? (
          <div className="py-12 text-center opacity-40 text-xs border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
            Aucun module ne correspond aux critères de recherche.
          </div>
        ) : (
          filteredModules.map(m => (
            <div key={m.id} className="p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:bg-black/[0.01] dark:hover:bg-white/[0.01]" style={cardStyle}>
              
              {/* Infos Générales */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-70 font-bold">{m.code}</span>
                  <h3 className="font-black text-sm tracking-tight leading-tight">{m.nom}</h3>
                  {getStatutBadge(m.statut)}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs opacity-60">
                  <span className="flex items-center gap-1 font-bold text-blue-500"><GraduationCap size={13} /> {m.classe}</span>
                  <span>• Enseignant : **{m.enseignant}**</span>
                  <span>• **{m.etudiantsInscrits}** étudiants</span>
                </div>
              </div>

              {/* Indicateurs de performances de la classe */}
              {m.statut !== 'En attente' ? (
                <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0" style={{ borderColor: 'var(--border)' }}>
                  
                  {/* Moyenne */}
                  <div className="text-center min-w-[70px]">
                    <p className="text-[10px] opacity-45 uppercase font-bold tracking-wider">Moyenne</p>
                    <p className={`text-sm font-black mt-0.5 ${m.moyenneClasse < 10 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {m.moyenneClasse.toFixed(1)}/20
                    </p>
                    {m.moyenneClasse < 10 && (
                      <span className="text-[9px] text-red-500 flex items-center gap-0.5 justify-center mt-0.5 font-medium">
                        <AlertTriangle size={9} /> Insuffisant
                      </span>
                    )}
                  </div>

                  {/* Taux Réussite */}
                  <div className="text-center min-w-[75px]">
                    <p className="text-[10px] opacity-45 uppercase font-bold tracking-wider">Réussite</p>
                    <p className="text-sm font-black mt-0.5 font-mono">{m.tauxReussite}%</p>
                    {/* Petite barre de progression sous format pastille */}
                    <div className="w-10 h-1 bg-black/10 dark:bg-white/10 mx-auto mt-1 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${m.tauxReussite}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs opacity-35 italic flex items-center gap-1.5 border-t md:border-t-0 pt-3 md:pt-0" style={{ borderColor: 'var(--border)' }}>
                  En attente du téléversement par l'enseignant
                </div>
              )}

              {/* Actions Administrateur */}
              <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0" style={{ borderColor: 'var(--border)' }}>
                {m.statut === 'Saisi' && (
                  <button onClick={() => handleDeliberer(m.id)} className="px-3 py-2 rounded-xl text-[11px] font-bold text-white transition hover:opacity-90 flex items-center gap-1" style={{ backgroundColor: 'var(--primary)' }}>
                    <Award size={13} /> Délibérer
                  </button>
                )}
                {m.statut === 'Délibéré' && (
                  <button onClick={() => showToast(`Téléchargement du PV de délibération ${m.code}...`)} className="p-2 rounded-xl border opacity-70 hover:opacity-100 transition flex items-center justify-center" style={{ borderColor: 'var(--border)' }} title="Exporter le PV en PDF">
                    <Download size={14} />
                  </button>
                )}
                <button onClick={() => showToast(`Ouverture de la grille de notes détaillée pour ${m.code}`)} className="p-2 rounded-xl border opacity-70 hover:opacity-100 transition flex items-center justify-center" style={{ borderColor: 'var(--border)' }} title="Voir le détail des notes">
                  <FileText size={14} />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}