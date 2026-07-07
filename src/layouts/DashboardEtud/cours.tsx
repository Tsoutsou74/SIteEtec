import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  BookOpen, Search, Download, FileText, 
  Video, Archive, User, Bookmark, ExternalLink, ArrowUpRight,
  ClipboardCheck, HelpCircle, Layers
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface SupportFichier {
  nom: string;
  type: 'pdf' | 'video' | 'zip';
  taille: string;
}

type TypeFormation = 'initiale' | 'continue' | 'enligne';
type TypeActivite = 'devoir' | 'quiz';

interface ActiviteFormation {
  type: TypeActivite;
  titre: string;
  echeance: string;
  statut: 'A faire' | 'En cours' | 'Termine';
}

interface MatiereCours {
  id: string;
  code: string;
  nom: string;
  typeFormation: TypeFormation;
  domaine: string;
  enseignant: string;
  coefficient: number;
  avancement: number; // Pourcentage d'avancement du programme
  lienVirtuel?: string; // Lien vers le cours en ligne / Teams / Moodle
  activites: ActiviteFormation[];
  fichiers: SupportFichier[];
}

const TYPE_FORMATION_LABELS: Record<TypeFormation, string> = {
  initiale: 'Formation initiale',
  continue: 'Formation continue',
  enligne: 'Formation en ligne',
};

const TYPE_FILTERS: Array<{ value: 'tous' | TypeFormation; label: string }> = [
  { value: 'tous', label: 'Toutes' },
  { value: 'initiale', label: 'Initiales' },
  { value: 'continue', label: 'Continues' },
  { value: 'enligne', label: 'En ligne' },
];

const isTypeFormation = (value: string | null): value is TypeFormation =>
  value === 'initiale' || value === 'continue' || value === 'enligne';

const getConnectedFormationType = (): TypeFormation | null => {
  if (typeof window === 'undefined') return null;

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;

    const value = window.localStorage.getItem(key);
    if (isTypeFormation(value)) return value;
  }

  return null;
};

// ─── Données Simulées (L3 Génie Logiciel / L1 Info) ────────
const INITIAL_MATIERES: MatiereCours[] = [
  {
    id: 'm-1',
    code: 'INF301',
    typeFormation: 'initiale',
    domaine: 'Informatique',
    nom: 'Algorithmique Avancée & Complexité',
    enseignant: 'M. ANDRIAMALALA Tahina',
    coefficient: 4,
    avancement: 75,
    lienVirtuel: 'https://moodle.university.edu/course/view.php?id=301',
    activites: [
      { type: 'devoir', titre: 'TD graphes et arbres binaires', echeance: '08 juillet 2026', statut: 'En cours' },
      { type: 'devoir', titre: 'Projet complexite algorithmique', echeance: '15 juillet 2026', statut: 'A faire' },
    ],
    fichiers: [
      { nom: 'Ch01_Introduction_Graphes.pdf', type: 'pdf', taille: '1.8 MB' },
      { nom: 'TD1_Arbres_Binaires_Recherche.pdf', type: 'pdf', taille: '850 KB' },
      { nom: 'TP1_Correction_Java.zip', type: 'zip', taille: '2.4 MB' }
    ]
  },
  {
    id: 'm-2',
    code: 'INF302',
    typeFormation: 'continue',
    domaine: 'Informatique & reseaux',
    nom: 'Architecture des Systèmes & Réseaux',
    enseignant: 'Dr. RAZAFIMAHATRATRA A.',
    coefficient: 3,
    avancement: 60,
    lienVirtuel: 'https://teams.microsoft.com/l/meetup-join/example1',
    activites: [
      { type: 'devoir', titre: 'Configuration sous-reseaux', echeance: '10 juillet 2026', statut: 'A faire' },
    ],
    fichiers: [
      { nom: 'Cours_Model_OSI_Details.pdf', type: 'pdf', taille: '3.1 MB' },
      { nom: 'Enregistrement_Video_SousReseaux.mp4', type: 'video', taille: '45 MB' }
    ]
  },
  {
    id: 'm-3',
    code: 'INF303',
    typeFormation: 'enligne',
    domaine: 'Informatique',
    nom: 'Bases de Données Relationnelles',
    enseignant: 'Mme. RAKOTOMALALA Feno',
    coefficient: 3,
    avancement: 90,
    lienVirtuel: 'https://moodle.university.edu/course/view.php?id=303',
    activites: [
      { type: 'devoir', titre: 'Projet BDD - schema relationnel', echeance: '12 juillet 2026', statut: 'Termine' },
      { type: 'quiz', titre: 'Quiz normalisation 3NF / BCNF', echeance: 'Disponible', statut: 'A faire' },
    ],
    fichiers: [
      { nom: 'Ch02_Normalisation_3NF_BCNF.pdf', type: 'pdf', taille: '1.2 MB' },
      { nom: 'Projet_BDD_Sujet_2026.pdf', type: 'pdf', taille: '620 KB' }
    ]
  },
  {
    id: 'm-4',
    code: 'INF304',
    typeFormation: 'enligne',
    domaine: 'Developpement web',
    nom: 'Développement Web Full-Stack (React / Node)',
    enseignant: 'M. RANDRIANARISOA Mamy',
    coefficient: 5,
    avancement: 45,
    lienVirtuel: 'https://teams.microsoft.com/l/meetup-join/example2',
    activites: [
      { type: 'devoir', titre: 'Mini-projet dashboard React', echeance: '18 juillet 2026', statut: 'En cours' },
      { type: 'quiz', titre: 'Quiz hooks React et API REST', echeance: 'Disponible', statut: 'A faire' },
    ],
    fichiers: [
      { nom: 'Syllabus_Vite_TypeScript.pdf', type: 'pdf', taille: '950 KB' },
      { nom: 'Boilerplate_React_Tailwind.zip', type: 'zip', taille: '1.1 MB' }
    ]
  }
];

export default function Cours() {
  const { darkMode } = useTheme();
  
  // ─── États ──────────────────────────────────────────────
  const [matieres] = useState<MatiereCours[]>(INITIAL_MATIERES);
  const [connectedFormationType] = useState<TypeFormation | null>(() => getConnectedFormationType());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'tous' | TypeFormation>(connectedFormationType ?? 'tous');
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCours | null>(
    INITIAL_MATIERES.find((matiere) => !connectedFormationType || matiere.typeFormation === connectedFormationType) ?? INITIAL_MATIERES[0],
  );

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };
  const visibleTypeFilters = connectedFormationType
    ? TYPE_FILTERS.filter((filter) => filter.value === connectedFormationType)
    : TYPE_FILTERS;

  // ─── Filtrage par recherche ─────────────────────────────
  const filteredMatieres = useMemo(() => {
    return matieres.filter(m => 
      (!connectedFormationType || m.typeFormation === connectedFormationType) &&
      (selectedType === 'tous' || m.typeFormation === selectedType) &&
      (
        m.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.domaine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.enseignant.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [connectedFormationType, matieres, searchTerm, selectedType]);

  const formationStats = useMemo(() => {
    return matieres
      .filter((matiere) => !connectedFormationType || matiere.typeFormation === connectedFormationType)
      .reduce(
      (acc, matiere) => {
        acc[matiere.typeFormation] += 1;
        return acc;
      },
      { initiale: 0, continue: 0, enligne: 0 } as Record<TypeFormation, number>,
    );
  }, [connectedFormationType, matieres]);

  const selectedActivityCounts = useMemo(() => {
    const visibleActivites = selectedMatiere?.typeFormation === 'enligne'
      ? selectedMatiere.activites
      : (selectedMatiere?.activites ?? []).filter((activite) => activite.type !== 'quiz');

    return visibleActivites.reduce(
      (acc, activite) => {
        acc[activite.type] += 1;
        return acc;
      },
      { devoir: 0, quiz: 0 } as Record<TypeActivite, number>,
    );
  }, [selectedMatiere]);

  // Helper pour les icônes de fichiers
  const getFileIcon = (type: 'pdf' | 'video' | 'zip') => {
    switch (type) {
      case 'video': return <Video size={14} className="text-purple-500" />;
      case 'zip': return <Archive size={14} className="text-amber-500" />;
      default: return <FileText size={14} className="text-blue-500" />;
    }
  };

  const getActivityIcon = (type: TypeActivite) => (
    type === 'quiz'
      ? <HelpCircle size={14} className="text-indigo-500" />
      : <ClipboardCheck size={14} className="text-emerald-600" />
  );

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
          <BookOpen className="text-[var(--primary)]" size={24} />
          Mes Cours & Supports Pédagogiques
        </h1>
        <p className="text-xs opacity-45 mt-0.5">
          Consultez le programme de vos matières et téléchargez les ressources mises à disposition par vos enseignants.
        </p>
      </div>

      {/* ─── Layout Bi-Colonne ─── */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl border px-3 py-2" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <p className="font-black">{formationStats.initiale}</p>
          <p className="text-[10px] opacity-50">Initiales</p>
        </div>
        <div className="rounded-xl border px-3 py-2" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <p className="font-black">{formationStats.continue}</p>
          <p className="text-[10px] opacity-50">Continues</p>
        </div>
        <div className="rounded-xl border px-3 py-2" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <p className="font-black">{formationStats.enligne}</p>
          <p className="text-[10px] opacity-50">En ligne</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {visibleTypeFilters.map((filter) => {
          const active = selectedType === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setSelectedType(filter.value)}
              className="px-3 py-2 rounded-xl border text-[10px] font-black transition cursor-pointer"
              style={{
                borderColor: active ? 'var(--primary)' : 'var(--border)',
                backgroundColor: active ? 'rgba(16, 185, 129, 0.10)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text)',
              }}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLONNE GAUCHE : LISTE DES MATIÈRES & RECHERCHE */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 opacity-40" size={14} />
            <input
              type="text"
              placeholder="Rechercher une matière, un code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full font-medium text-xs pl-9 pr-4 py-2 rounded-xl border bg-transparent focus:outline-hidden focus:border-[var(--primary)]"
              style={borderStyle}
            />
          </div>

          <div className="space-y-2.5">
            {filteredMatieres.length === 0 ? (
              <div className="p-6 text-center border border-dashed rounded-2xl opacity-40 text-xs font-medium" style={borderStyle}>
                Aucun cours trouvé.
              </div>
            ) : (
              filteredMatieres.map((matiere) => {
                const isSelected = selectedMatiere?.id === matiere.id;
                const hasVisibleQuiz = matiere.typeFormation === 'enligne'
                  && matiere.activites.some((activite) => activite.type === 'quiz');

                return (
                  <div
                    key={matiere.id}
                    onClick={() => setSelectedMatiere(matiere)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-[var(--primary)] shadow-xs bg-black/[0.02] dark:bg-white/[0.02]' 
                        : 'hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
                    style={{ backgroundColor: cardBg, borderColor: isSelected ? 'var(--primary)' : 'var(--border)' }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold opacity-50 tracking-wider bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
                        {matiere.code}
                      </span>
                      <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-emerald-500/10 text-emerald-600">
                        {TYPE_FORMATION_LABELS[matiere.typeFormation]}
                      </span>
                    </div>

                    <h3 className="text-xs font-black tracking-tight mt-2 line-clamp-1">
                      {matiere.nom}
                    </h3>

                    <div className="flex items-center gap-1 text-[10px] opacity-50 mt-1 font-medium">
                      <Layers size={11} />
                      <span className="truncate">{matiere.domaine}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold" style={borderStyle}>
                        <ClipboardCheck size={11} /> Devoirs
                      </span>
                      {hasVisibleQuiz && (
                        <span className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold" style={borderStyle}>
                          <HelpCircle size={11} /> Quiz
                        </span>
                      )}
                    </div>

                    {/* Petite barre de progression de couverture du cours */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[9px] font-bold opacity-40">
                        <span>Progression cours</span>
                        <span>{matiere.avancement}%</span>
                      </div>
                      <div className="h-1 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${matiere.avancement}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLONNE DROITE : DÉTAILS DE LA MATIÈRE SÉLECTIONNÉE */}
        <div className="lg:col-span-2">
          {selectedMatiere ? (
            <div className="p-6 rounded-2xl border space-y-5" style={{ backgroundColor: cardBg, ...borderStyle }}>
              
              {/* En-tête du détail */}
              <div className="border-b pb-4 space-y-2" style={borderStyle}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[var(--primary)] text-white">
                    {selectedMatiere.code}
                  </span>
                  <span className="text-[10px] font-black rounded-full px-2 py-1 bg-emerald-500/10 text-emerald-600">
                    {TYPE_FORMATION_LABELS[selectedMatiere.typeFormation]}
                  </span>
                  <h2 className="text-base font-black tracking-tight">{selectedMatiere.nom}</h2>
                </div>
                
                <p className="text-xs opacity-60 font-medium flex items-center gap-1.5">
                  <Bookmark size={13} className="text-[var(--primary)]" />
                  Cours dispensé par : <strong>{selectedMatiere.enseignant}</strong> (Coef. {selectedMatiere.coefficient})
                </p>
              </div>

              {/* État d'avancement macro */}
              <div className="p-4 rounded-xl bg-black/[0.01] dark:bg-white/[0.01] border flex items-center justify-between gap-4" style={borderStyle}>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold">Cahier de texte numérique</h4>
                  <p className="text-[10px] opacity-45">Volume horaire total estimé complété par l'enseignant.</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[var(--primary)]">{selectedMatiere.avancement}%</span>
                  <p className="text-[9px] uppercase font-bold opacity-30 mt-0.5">Terminé</p>
                </div>
              </div>

              {/* Bouton Accéder au cours en ligne */}
              <div className={`grid gap-3 ${selectedMatiere.typeFormation === 'enligne' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                <div className="rounded-xl border p-4" style={borderStyle}>
                  <p className="text-[10px] font-black uppercase opacity-40">Domaine</p>
                  <p className="mt-1 text-xs font-black">{selectedMatiere.domaine}</p>
                </div>
                <div className="rounded-xl border p-4" style={borderStyle}>
                  <p className="text-[10px] font-black uppercase opacity-40">Devoirs</p>
                  <p className="mt-1 text-lg font-black">{selectedActivityCounts.devoir}</p>
                </div>
                {selectedMatiere.typeFormation === 'enligne' && (
                  <div className="rounded-xl border p-4" style={borderStyle}>
                    <p className="text-[10px] font-black uppercase opacity-40">Quiz</p>
                    <p className="mt-1 text-lg font-black">{selectedActivityCounts.quiz}</p>
                  </div>
                )}
              </div>

              {selectedMatiere.typeFormation === 'enligne' && (
                <Link
                  to={`/etudiants/cours-en-ligne/${selectedMatiere.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-xs font-black transition duration-200 hover:opacity-90 shadow-2xs"
                  style={{ backgroundColor: 'var(--primary)', color: '#ffffff', borderColor: 'var(--primary)' }}
                >
                  <span>Accéder au cours en ligne</span>
                  <ArrowUpRight size={14} />
                </Link>
              )}

              {/* Liste des Téléchargements / Chapitres */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-black uppercase tracking-wider opacity-60">
                  {selectedMatiere.typeFormation === 'enligne' ? 'Devoirs et quiz' : 'Devoirs'}
                </h3>

                <div className="divide-y border rounded-xl overflow-hidden mb-4" style={borderStyle}>
                  {selectedMatiere.activites
                    .filter((activite) => selectedMatiere.typeFormation === 'enligne' || activite.type !== 'quiz')
                    .map((activite) => (
                    <div key={`${activite.type}-${activite.titre}`} className="flex items-center justify-between p-3.5 gap-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 border shrink-0" style={borderStyle}>
                          {getActivityIcon(activite.type)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate pr-2">{activite.titre}</p>
                          <span className="text-[10px] opacity-45">{activite.echeance}</span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-lg border px-2 py-1 text-[10px] font-black" style={borderStyle}>
                        {activite.type === 'quiz' ? 'Quiz' : 'Devoir'} - {activite.statut}
                      </span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xs font-black uppercase tracking-wider opacity-60">Supports et fichiers disponibles</h3>
                
                <div className="divide-y border rounded-xl overflow-hidden" style={borderStyle}>
                  {selectedMatiere.fichiers.length === 0 ? (
                    <div className="p-4 text-center opacity-40 text-xs">Aucun document n'a encore été déposé pour ce cours.</div>
                  ) : (
                    selectedMatiere.fichiers.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors gap-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 border shrink-0" style={borderStyle}>
                            {getFileIcon(file.type)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate pr-2" title={file.nom}>{file.nom}</p>
                            <span className="text-[10px] font-mono opacity-40">{file.taille}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => alert(`Téléchargement initié pour : ${file.nom}`)}
                          className="flex items-center gap-1 px-2.5 py-1.5 border rounded-lg text-[10px] font-black hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer shrink-0"
                          style={borderStyle}
                        >
                          <Download size={12} />
                          <span>Prendre</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Info bulle de liaison */}
              <div className="text-[10px] opacity-40 font-medium flex items-center gap-1.5 pt-2">
                <ExternalLink size={12} />
                <span>En cas de lien de visioconférence ou de salon Teams, référez-vous aux annonces de l'administration.</span>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center border border-dashed rounded-2xl opacity-40 text-xs font-medium" style={borderStyle}>
              Sélectionnez une matière à gauche pour afficher ses détails et fichiers.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
