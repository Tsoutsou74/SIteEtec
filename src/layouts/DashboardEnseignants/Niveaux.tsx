import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

import { 
  Layers, BookOpen, Clock, FileText, Download, 
  Search, ShieldAlert, GraduationCap, ChevronRight, Loader2 
} from 'lucide-react';

// ─── Types & Interfaces ───────────────────────────────────
interface Ressource {
  id: string;
  titre: string;
  type: 'Cours' | 'TD/TP' | 'Examen';
  taille: string;
}

interface Matiere {
  id: string;
  code: string;
  titre: string;
  enseignant: string;
  volumeHoraire: number;
  progress: number;
  ressources: Ressource[];
}

interface NiveauStructure {
  id: string;
  nom: string;
  description: string;
  responsable: string;
  matieres: Matiere[];
}

export default function Niveaux() {
  const { darkMode } = useTheme();
  
  // ─── États Dynamiques ───────────────────────────────────
  const [niveauxData, setNiveauxData] = useState<NiveauStructure[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeNiveauId, setActiveNiveauId] = useState<string>('');
  const [selectedMatiereId, setSelectedMatiereId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // ─── Chargement des données ───────────────────
  useEffect(() => {
    const fetchNiveaux = async () => {
      setIsLoading(true);
      try {
        const mockNiveaux: NiveauStructure[] = [
          {
            id: 'n1', nom: 'L1 Info', description: 'Première année d\'informatique', responsable: 'M. Dupont',
            matieres: [
              { id: 'm1', code: 'PRG101', titre: 'Programmation C', enseignant: 'M. Dupont', volumeHoraire: 45, progress: 80, ressources: [{ id: 'r1', titre: 'Chapitre 1', type: 'Cours', taille: '2.5 MB' }] }
            ]
          },
          {
            id: 'n2', nom: 'L2 Info', description: 'Deuxième année', responsable: 'Mme Martin',
            matieres: [
              { id: 'm2', code: 'ALG201', titre: 'Algorithmique 2', enseignant: 'Mme Martin', volumeHoraire: 40, progress: 50, ressources: [] }
            ]
          }
        ];
        setTimeout(() => {
          setNiveauxData(mockNiveaux);
          setActiveNiveauId(mockNiveaux[0].id);
          setSelectedMatiereId(mockNiveaux[0].matieres[0].id);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error("Erreur:", err);
        setIsLoading(false);
      }
    };

    fetchNiveaux();
  }, []);

  // Récupérer les données du niveau actuellement sélectionné
  const currentNiveau = useMemo(() => {
    return niveauxData.find(n => n.id === activeNiveauId) || null;
  }, [niveauxData, activeNiveauId]);

  // Filtrer les matières du niveau courant selon la recherche textuelle
  const filteredMatieres = useMemo(() => {
    if (!currentNiveau) return [];
    if (!searchTerm.trim()) return currentNiveau.matieres || [];
    return (currentNiveau.matieres || []).filter(m => 
      m.titre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.enseignant?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentNiveau, searchTerm]);

  // Récupérer les détails de la matière sélectionnée (et ses ressources)
  const currentMatiere = useMemo(() => {
    if (!currentNiveau || !currentNiveau.matieres) return null;
    const mat = currentNiveau.matieres.find(m => m.id === selectedMatiereId);
    if (!mat && currentNiveau.matieres.length > 0) {
      return currentNiveau.matieres[0];
    }
    return mat || null;
  }, [currentNiveau, selectedMatiereId]);

  // Gestion du basculement d'onglet de niveau
  const handleNiveauTabChange = (id: string) => {
    setActiveNiveauId(id);
    const targetNiveau = niveauxData.find(n => n.id === id);
    if (targetNiveau && targetNiveau.matieres && targetNiveau.matieres.length > 0) {
      setSelectedMatiereId(targetNiveau.matieres[0].id);
    } else {
      setSelectedMatiereId(null);
    }
  };

  // Traitement du téléchargement des ressources
  const handleDownload = (resId: string, resTitre: string) => {
    alert(`Téléchargement de la ressource : ${resTitre}`);
    // Implémentation future : window.open(`${BASE_URL}/ressources/download/${resId}`)
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 opacity-60 text-xs font-semibold">
        <Loader2 size={28} className="animate-spin text-[var(--primary)]" />
        <p>Chargement des maquettes pédagogiques et supports...</p>
      </div>
    );
  }

  if (niveauxData.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed rounded-2xl opacity-40 text-xs font-medium" style={borderStyle}>
        Aucun programme d'étude disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Layers className="text-[var(--primary)]" size={22} />
            Programmes & Niveaux d'Études
          </h1>
          <p className="text-xs opacity-50 mt-0.5">Accédez aux maquettes pédagogiques et supports de cours par promotion.</p>
        </div>

        {/* Barre de Recherche Inline */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 opacity-40" size={14} />
          <input
            type="text"
            placeholder="Rechercher une matière..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full font-medium text-xs pl-9 pr-4 py-2.5 rounded-xl border bg-transparent focus:outline-hidden focus:border-[var(--primary)]"
            style={borderStyle}
          />
        </div>
      </div>

      {/* ─── Onglets des Niveaux (Tabs) ─── */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border" style={borderStyle}>
        {niveauxData.map((niv) => {
          const isActive = niv.id === activeNiveauId;
          return (
            <button
              key={niv.id}
              onClick={() => handleNiveauTabChange(niv.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[var(--primary)] text-white shadow-xs' 
                  : 'opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {niv.nom}
            </button>
          );
        })}
      </div>

      {/* Meta Infos du Niveau sélectionné */}
      {currentNiveau && (
        <div className="p-4 rounded-xl border flex flex-col md:flex-row justify-between md:items-center gap-2 bg-black/[0.01] dark:bg-white/[0.01]" style={borderStyle}>
          <div className="space-y-0.5">
            <div className="text-xs font-black flex items-center gap-1.5">
              <GraduationCap size={14} className="text-[var(--primary)]" />
              {currentNiveau.nom}
            </div>
            <p className="text-[11px] opacity-60 max-w-2xl">{currentNiveau.description}</p>
          </div>
          <div className="text-[11px] border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-4 font-medium" style={borderStyle}>
            <span className="opacity-50">Responsable Pédagogique :</span> <span className="font-bold">{currentNiveau.responsable}</span>
          </div>
        </div>
      )}

      {/* ─── Grid Principal: Liste des Matières vs Ressources ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne Gauche: Liste des matières (5/12) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[10px] font-black uppercase opacity-50 tracking-wider px-1">
            Unités d'Enseignement ({filteredMatieres.length})
          </div>

          {filteredMatieres.length === 0 ? (
            <div className="p-8 text-center border rounded-2xl opacity-40 text-xs font-medium" style={borderStyle}>
              Aucun cours ne correspond à la recherche.
            </div>
          ) : (
            filteredMatieres.map((matiere) => {
              const isSelected = currentMatiere?.id === matiere.id;
              return (
                <div
                  key={matiere.id}
                  onClick={() => setSelectedMatiereId(matiere.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected 
                      ? 'border-[var(--primary)] shadow-xs bg-black/[0.01] dark:bg-white/[0.01]' 
                      : 'hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                  style={!isSelected ? { backgroundColor: cardBg, ...borderStyle } : undefined}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/5 opacity-60">
                        {matiere.code}
                      </span>
                      <h3 className="text-xs font-black tracking-tight group-hover:text-[var(--primary)] transition-colors mt-1">
                        {matiere.titre}
                      </h3>
                      <p className="text-[11px] opacity-50">Enseignant: {matiere.enseignant}</p>
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`opacity-30 group-hover:opacity-100 transition-all ${isSelected ? 'translate-x-1 opacity-100 text-[var(--primary)]' : ''}`} 
                    />
                  </div>

                  {/* Volume horaire et Mini Barre de Progression */}
                  <div className="mt-4 pt-3 border-t flex items-center justify-between gap-4" style={borderStyle}>
                    <div className="flex items-center gap-1.5 opacity-50 text-[10px] font-bold">
                      <Clock size={12} />
                      {matiere.volumeHoraire}h de cours
                    </div>
                    <div className="flex items-center gap-2 w-1/2">
                      <div className="h-1 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all" 
                          style={{ width: `${matiere.progress}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono font-bold opacity-60">{matiere.progress}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Colonne Droite: Détails & Documents téléchargeables (7/12) */}
        <div className="lg:col-span-7">
          {currentMatiere ? (
            <div className="p-5 rounded-2xl border space-y-5" style={{ backgroundColor: cardBg, ...borderStyle }}>
              
              {/* Entête du volet détail */}
              <div className="border-b pb-4" style={borderStyle}>
                <div className="flex items-center gap-2 text-xs font-black text-[var(--primary)] mb-1">
                  <BookOpen size={15} />
                  {currentMatiere.code} — {currentMatiere.titre}
                </div>
                <p className="text-[11px] opacity-50">
                  Coffre-fort numérique des ressources pédagogiques déposées par l'enseignant.
                </p>
              </div>

              {/* Liste des documents */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-black uppercase opacity-50 tracking-wider">
                  Documents et Supports Disponibles ({(currentMatiere.ressources || []).length})
                </div>

                {!currentMatiere.ressources || currentMatiere.ressources.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed rounded-xl opacity-40 text-xs font-medium" style={borderStyle}>
                    Aucune ressource disponible pour cette matière pour le moment.
                  </div>
                ) : (
                  currentMatiere.ressources.map((res) => (
                    <div 
                      key={res.id}
                      className="p-3 rounded-xl border flex items-center justify-between gap-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-all"
                      style={borderStyle}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Badge de couleur selon le type de ressource */}
                        <span className={`p-2 rounded-lg shrink-0 ${
                          res.type === 'Cours' ? 'bg-blue-500/10 text-blue-500' :
                          res.type === 'TD/TP' ? 'bg-purple-500/10 text-purple-500' : 
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          <FileText size={14} />
                        </span>
                        
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold tracking-tight truncate">{res.titre}</h4>
                          <div className="flex items-center gap-2 text-[10px] font-medium opacity-50 mt-0.5">
                            <span className="uppercase font-bold">{res.type}</span>
                            <span>•</span>
                            <span>{res.taille}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bouton de Téléchargement */}
                      <button 
                        type="button"
                        title="Télécharger la ressource"
                        className="p-2 rounded-lg border bg-black/[0.02] dark:bg-white/[0.02] hover:bg-[var(--primary)] hover:text-white transition cursor-pointer shrink-0"
                        style={borderStyle}
                        onClick={() => handleDownload(res.id, res.titre)}
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Mentions de droits d'auteur */}
              <div className="p-3 rounded-xl bg-amber-500/5 text-amber-500 text-[10px] font-medium border border-amber-500/10 flex gap-2 items-start">
                <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                <span>
                  Les étudiants inscrits à la plateforme ont accès libre au téléchargement. Toute reproduction en dehors du portail de l'établissement est soumise aux droits d'auteur de l'intervenant.
                </span>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed rounded-2xl opacity-40 text-xs font-medium h-full flex flex-col justify-center items-center" style={borderStyle}>
              <Layers size={24} className="mb-2 opacity-50" />
              Sélectionnez une matière à gauche pour afficher ses chapitres et ressources.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}