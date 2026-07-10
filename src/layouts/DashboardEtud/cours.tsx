import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/ApiService';
import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Layers,
  Loader2,
  Search,
  Video,
} from 'lucide-react';

type TypeFormation = 'initiale' | 'continue' | 'enligne';
type TypeActivite = 'devoir' | 'quiz';

interface SupportFichier {
  nom: string;
  type: 'pdf' | 'video' | 'zip';
  taille: string;
}

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
  avancement: number;
  lienVirtuel?: string;
  activites: ActiviteFormation[];
  fichiers: SupportFichier[];
}

const INITIAL_MATIERES: MatiereCours[] = [
  {
    id: 'm-1',
    code: 'INF301',
    typeFormation: 'initiale',
    domaine: 'Informatique',
    nom: 'Algorithmique Avancee & Complexite',
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
      { nom: 'TP1_Correction_Java.zip', type: 'zip', taille: '2.4 MB' },
    ],
  },
  {
    id: 'm-2',
    code: 'INF302',
    typeFormation: 'continue',
    domaine: 'Informatique & reseaux',
    nom: 'Architecture des Systemes & Reseaux',
    enseignant: 'Dr. RAZAFIMAHATRATRA A.',
    coefficient: 3,
    avancement: 60,
    lienVirtuel: 'https://teams.microsoft.com/l/meetup-join/example1',
    activites: [{ type: 'devoir', titre: 'Configuration sous-reseaux', echeance: '10 juillet 2026', statut: 'A faire' }],
    fichiers: [
      { nom: 'Cours_Model_OSI_Details.pdf', type: 'pdf', taille: '3.1 MB' },
      { nom: 'Enregistrement_Video_SousReseaux.mp4', type: 'video', taille: '45 MB' },
    ],
  },
  {
    id: 'm-3',
    code: 'INF303',
    typeFormation: 'enligne',
    domaine: 'Informatique',
    nom: 'Bases de Donnees Relationnelles',
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
      { nom: 'Projet_BDD_Sujet_2026.pdf', type: 'pdf', taille: '620 KB' },
    ],
  },
  {
    id: 'm-4',
    code: 'INF304',
    typeFormation: 'enligne',
    domaine: 'Developpement web',
    nom: 'Developpement Web Full-Stack (React / Node)',
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
      { nom: 'Boilerplate_React_Tailwind.zip', type: 'zip', taille: '1.1 MB' },
    ],
  },
];

const TYPE_LABELS: Record<TypeFormation, string> = {
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

function getFileIcon(type: SupportFichier['type']) {
  if (type === 'video') return <Video size={14} />;
  return <FileText size={14} />;
}

export default function Cours() {
  const { darkMode } = useTheme();
  const [matieres, setMatieres] = useState<MatiereCours[]>(INITIAL_MATIERES);
  const [isLoading, setIsLoading] = useState(true);
  const [connectedFormationType] = useState<TypeFormation | null>(() => getConnectedFormationType());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'tous' | TypeFormation>(connectedFormationType ?? 'tous');
  const [selectedMatiere, setSelectedMatiere] = useState<MatiereCours | null>(
    INITIAL_MATIERES.find((matiere) => !connectedFormationType || matiere.typeFormation === connectedFormationType) ??
      INITIAL_MATIERES[0]
  );

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  useEffect(() => {
    const fetchCoursData = async () => {
      setIsLoading(true);
      try {
        if (ApiService.etudiant?.getCours) {
          const res = await ApiService.etudiant.getCours();
          if (res?.data?.length) {
            setMatieres(res.data);
            const defaultMatiere =
              res.data.find((matiere: MatiereCours) => !connectedFormationType || matiere.typeFormation === connectedFormationType) ??
              res.data[0];
            setSelectedMatiere(defaultMatiere ?? null);
            return;
          }
        }

        setMatieres(INITIAL_MATIERES);
        setSelectedMatiere(
          INITIAL_MATIERES.find((matiere) => !connectedFormationType || matiere.typeFormation === connectedFormationType) ??
            INITIAL_MATIERES[0]
        );
      } catch (error) {
        console.error("Erreur lors du chargement des cours :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoursData();
  }, [connectedFormationType]);

  const visibleTypeFilters = connectedFormationType
    ? TYPE_FILTERS.filter((filter) => filter.value === connectedFormationType)
    : TYPE_FILTERS;

  const filteredMatieres = useMemo(() => {
    return matieres.filter((matiere) => {
      const matchFormation = !connectedFormationType || matiere.typeFormation === connectedFormationType;
      const matchType = selectedType === 'tous' || matiere.typeFormation === selectedType;
      const lowerSearch = searchTerm.toLowerCase();
      const matchSearch =
        matiere.nom.toLowerCase().includes(lowerSearch) ||
        matiere.code.toLowerCase().includes(lowerSearch) ||
        matiere.domaine.toLowerCase().includes(lowerSearch) ||
        matiere.enseignant.toLowerCase().includes(lowerSearch);
      return matchFormation && matchType && matchSearch;
    });
  }, [connectedFormationType, matieres, searchTerm, selectedType]);

  useEffect(() => {
    if (!selectedMatiere && filteredMatieres.length > 0) {
      setSelectedMatiere(filteredMatieres[0]);
    }
  }, [filteredMatieres, selectedMatiere]);

  if (connectedFormationType && connectedFormationType !== 'enligne') {
    return (
      <div className="max-w-3xl space-y-4 pb-12">
        <Link to="/etudiants/cours" className="inline-flex items-center gap-2 text-xs font-black opacity-70 hover:opacity-100">
          <ArrowLeft size={14} /> Retour aux formations
        </Link>
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <BookOpen className="mx-auto text-emerald-600" size={32} />
          <h1 className="mt-4 text-lg font-black">Acces reserve</h1>
          <p className="mt-2 text-xs opacity-55">
            La plateforme de cours detaillee est reservee aux formations en ligne.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3 opacity-60 text-xs">
        <Loader2 size={28} className="animate-spin text-emerald-600" />
        <p className="font-bold">Chargement de vos cours...</p>
      </div>
    );
  }

  const activeMatiere = selectedMatiere ?? filteredMatieres[0] ?? null;

  if (!activeMatiere) {
    return (
      <div className="max-w-3xl rounded-2xl border p-8 text-center opacity-55 text-xs" style={{ borderColor: 'var(--border)' }}>
        Aucun cours disponible.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <Layers className="text-[var(--primary)]" size={24} />
            Plateforme de cours en ligne
          </h1>
          <p className="text-xs opacity-45 mt-0.5">
            {connectedFormationType ? TYPE_LABELS[connectedFormationType] : 'Tous les parcours'} · suivis, ressources et activites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 opacity-40" size={14} />
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full font-medium text-xs pl-9 pr-4 py-2 rounded-xl border bg-transparent focus:outline-none"
              style={borderStyle}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {visibleTypeFilters.map((filter) => {
          const isActive = selectedType === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => setSelectedType(filter.value)}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap"
              style={{
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                color: isActive ? 'white' : 'var(--text)',
                opacity: isActive ? 1 : 0.7,
              }}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="space-y-4">
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <div className="px-5 py-4 border-b flex items-start justify-between gap-4" style={borderStyle}>
              <div>
                <div className="text-[10px] uppercase font-black tracking-wider opacity-45">{activeMatiere.code}</div>
                <h2 className="text-sm font-black tracking-tight mt-1">{activeMatiere.nom}</h2>
                <p className="text-[11px] opacity-55 mt-1">{activeMatiere.enseignant} · {activeMatiere.domaine}</p>
              </div>
              <a
                href={activeMatiere.lienVirtuel}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black border"
                style={borderStyle}
              >
                <ExternalLink size={12} />
                Ouvrir
              </a>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span>Progression</span>
                  <span>{activeMatiere.avancement}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${activeMatiere.avancement}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border p-4" style={borderStyle}>
                  <div className="text-[10px] uppercase opacity-40 font-black tracking-wider">Type</div>
                  <div className="mt-1 text-xs font-bold">{TYPE_LABELS[activeMatiere.typeFormation]}</div>
                </div>
                <div className="rounded-xl border p-4" style={borderStyle}>
                  <div className="text-[10px] uppercase opacity-40 font-black tracking-wider">Coefficient</div>
                  <div className="mt-1 text-xs font-bold">{activeMatiere.coefficient}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-black mb-3">
                  <BookOpen size={14} className="text-[var(--primary)]" />
                  Activites
                </div>
                <div className="space-y-2">
                  {activeMatiere.activites.map((activity, index) => (
                    <div key={index} className="rounded-xl border p-4 flex items-start justify-between gap-4" style={borderStyle}>
                      <div>
                        <div className="text-xs font-bold">{activity.titre}</div>
                        <div className="text-[11px] opacity-55 mt-1">{activity.echeance}</div>
                      </div>
                      <span className="text-[10px] font-black px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                        {activity.statut}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <div className="px-5 py-4 border-b" style={borderStyle}>
              <h3 className="text-sm font-black tracking-tight">Matieres disponibles</h3>
            </div>
            <div className="divide-y" style={borderStyle}>
              {filteredMatieres.map((matiere) => {
                const active = matiere.id === activeMatiere.id;
                return (
                  <button
                    key={matiere.id}
                    onClick={() => setSelectedMatiere(matiere)}
                    className="w-full text-left px-5 py-4 transition hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    style={{
                      backgroundColor: active ? 'rgba(34,197,94,0.06)' : 'transparent',
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase font-black tracking-wider opacity-40">{matiere.code}</div>
                        <div className="text-xs font-bold truncate mt-1">{matiere.nom}</div>
                        <div className="text-[11px] opacity-50 truncate mt-0.5">{matiere.enseignant}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-[var(--primary)]">{matiere.avancement}%</div>
                        <div className="text-[10px] opacity-40 font-bold">{matiere.domaine}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <div className="px-5 py-4 border-b flex items-center gap-2" style={borderStyle}>
              <Filter size={14} className="text-[var(--primary)]" />
              <h3 className="text-sm font-black tracking-tight">Ressources</h3>
            </div>
            <div className="divide-y" style={borderStyle}>
              {activeMatiere.fichiers.map((file, index) => (
                <div key={index} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={borderStyle}>
                      {getFileIcon(file.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{file.nom}</div>
                      <div className="text-[11px] opacity-50 mt-0.5">{file.taille}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Telechargement: ${file.nom}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black border"
                    style={borderStyle}
                  >
                    <Download size={12} />
                    Telecharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
