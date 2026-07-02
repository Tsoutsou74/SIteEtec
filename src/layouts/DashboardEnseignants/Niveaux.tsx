import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Layers, BookOpen, Clock, FileText, Download, 
  Search, Plus, ShieldAlert, GraduationCap, ChevronRight 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
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
  progress: number; // Progression du programme en %
  ressources: Ressource[];
}

interface NiveauStructure {
  id: string;
  nom: string; // Ex: L1 Info
  description: string;
  responsable: string;
  matieres: Matiere[];
}

// ─── Données Simulées (Mock Data) ─────────────────────────
const NIVEAUX_DATA: NiveauStructure[] = [
  {
    id: 'l1',
    nom: 'Licence 1 (L1)',
    description: 'Tronc commun et fondamentaux de l\'informatique et des mathématiques.',
    responsable: 'Dr. RAKOTO Volana',
    matieres: [
      {
        id: 'l1-algo',
        code: 'INF101',
        titre: 'Algorithmique & Structures de Données',
        enseignant: 'M. ANDRIAMALALA Tahina',
        volumeHoraire: 60,
        progress: 75,
        ressources: [
          { id: 'r1', titre: 'Introduction aux Algorithmes & Pseudo-code', type: 'Cours', taille: '1.4 MB' },
          { id: 'r2', titre: 'Série de TD 1 : Les structures conditionnelles', type: 'TD/TP', taille: '450 KB' },
          { id: 'r3', titre: 'Projet Pratique : Gestion de stock en C', type: 'TD/TP', taille: '820 KB' },
          { id: 'r4', titre: 'Examen Partiel 2025 + Corrigé', type: 'Examen', taille: '2.1 MB' },
        ]
      },
      {
        id: 'l1-arch',
        code: 'INF102',
        titre: 'Architecture des ordinateurs',
        enseignant: 'Dr. RAZAFIMAHATRATRA Andry',
        volumeHoraire: 45,
        progress: 40,
        ressources: [
          { id: 'r5', titre: 'Algèbre de Boole et Circuits Logiques', type: 'Cours', taille: '3.2 MB' },
          { id: 'r6', titre: 'Architecture Von Neumann', type: 'Cours', taille: '1.8 MB' },
        ]
      },
      {
        id: 'l1-math',
        code: 'MAT101',
        titre: 'Mathématiques Discrètes',
        enseignant: 'Mme. RAKOTOMALALA Feno',
        volumeHoraire: 45,
        progress: 90,
        ressources: [
          { id: 'r7', titre: 'Théorie des Ensembles et Logique', type: 'Cours', taille: '2.0 MB' },
          { id: 'r8', titre: 'Théorie des Graphes : Algorithme de Dijkstra', type: 'Cours', taille: '1.5 MB' },
        ]
      }
    ]
  },
  {
    id: 'l2',
    nom: 'Licence 2 (L2)',
    description: 'Approfondissement des concepts de programmation et systèmes.',
    responsable: 'Mme. RASOAMALALA Lova',
    matieres: [
      {
        id: 'l2-poo',
        code: 'INF201',
        titre: 'Programmation Orientée Objet (Java)',
        enseignant: 'Mme. RASOAMALALA Lova',
        volumeHoraire: 60,
        progress: 60,
        ressources: [
          { id: 'r9', titre: 'Concepts POO : Encapsulation, Héritage, Polymorphisme', type: 'Cours', taille: '2.5 MB' },
          { id: 'r10', titre: 'TP Java : Collection et Generics', type: 'TD/TP', taille: '610 KB' },
        ]
      },
      {
        id: 'l2-se',
        code: 'INF202',
        titre: 'Systèmes d\'Exploitation & Scripting Shell',
        enseignant: 'M. RABENANAHARY Sitraka',
        volumeHoraire: 45,
        progress: 50,
        ressources: [
          { id: 'r11', titre: 'Gestion des Processus et Threads', type: 'Cours', taille: '1.9 MB' },
        ]
      }
    ]
  },
  {
    id: 'l3',
    nom: 'Licence 3 (L3)',
    description: 'Spécialisation, génie logiciel et technologies web avancées.',
    responsable: 'M. RANDRIANARISOA Mamy',
    matieres: [
      {
        id: 'l3-web',
        code: 'INF301',
        titre: 'Développement Web (React & Frameworks Node)',
        enseignant: 'M. RANDRIANARISOA Mamy',
        volumeHoraire: 60,
        progress: 80,
        ressources: [
          { id: 'r12', titre: 'Architecture des applications Single Page (SPA)', type: 'Cours', taille: '4.1 MB' },
          { id: 'r13', titre: 'Mini-projet : Dashboard de gestion avec Vite & Tailwind', type: 'TD/TP', taille: '1.2 MB' },
        ]
      }
    ]
  },
  {
    id: 'm1',
    nom: 'Master 1 (M1)',
    description: 'Architecture des systèmes d\'information et technologies Cloud.',
    responsable: 'Dr. ANDRIAMALALA Tahina',
    matieres: [
      {
        id: 'm1-devops',
        code: 'MSR102',
        titre: 'DevOps & Intégration Continue (CI/CD)',
        enseignant: 'M. RAZAFINDRAKOTO Jean',
        volumeHoraire: 50,
        progress: 30,
        ressources: [
          { id: 'r14', titre: 'Conteneurisation avec Docker', type: 'Cours', taille: '5.4 MB' },
          { id: 'r15', titre: 'Pipelines d\'automatisation GitHub Actions', type: 'TD/TP', taille: '980 KB' },
        ]
      }
    ]
  }
];

export default function Niveaux() {
  const { darkMode } = useTheme();
  
  // États de navigation
  const [activeNiveauId, setActiveNiveauId] = useState<string>('l1');
  const [selectedMatiereId, setSelectedMatiereId] = useState<string | null>('l1-algo');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // Récupérer les données du niveau sélectionné
  const currentNiveau = useMemo(() => {
    return NIVEAUX_DATA.find(n => n.id === activeNiveauId)!;
  }, [activeNiveauId]);

  // Filtrer les matières selon la recherche textuelle
  const filteredMatieres = useMemo(() => {
    if (!searchTerm.trim()) return currentNiveau.matieres;
    return currentNiveau.matieres.filter(m => 
      m.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.enseignant.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentNiveau, searchTerm]);

  // Récupérer la matière sélectionnée pour afficher ses ressources detail-view
  const currentMatiere = useMemo(() => {
    const mat = currentNiveau.matieres.find(m => m.id === selectedMatiereId);
    // Si la matière n'existe pas dans ce niveau (changement d'onglet), on prend la première disponible
    if (!mat && currentNiveau.matieres.length > 0) {
      return currentNiveau.matieres[0];
    }
    return mat;
  }, [currentNiveau, selectedMatiereId]);

  // Forcer la sélection automatique lors du changement de niveau
  const handleNiveauTabChange = (id: string) => {
    setActiveNiveauId(id);
    const targetNiveau = NIVEAUX_DATA.find(n => n.id === id);
    if (targetNiveau && targetNiveau.matieres.length > 0) {
      setSelectedMatiereId(targetNiveau.matieres[0].id);
    } else {
      setSelectedMatiereId(null);
    }
  };

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
        {NIVEAUX_DATA.map((niv) => {
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

      {/* ─── Grid Principal: Liste des Matières vs Ressources de la matière sélectionnée ─── */}
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

                  {/* Volume horaire et Mini Barre de Progression de l'avancement */}
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
                  Documents et Supports Disponibles ({currentMatiere.ressources.length})
                </div>

                {currentMatiere.ressources.length === 0 ? (
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
                        onClick={() => alert(`Téléchargement de : ${res.titre}`)}
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Notification bas de page de conformité de syllabus */}
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