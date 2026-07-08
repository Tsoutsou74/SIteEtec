import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Laptop, PlayCircle, ArrowRight } from 'lucide-react';
import ApiService from '../services/ApiService';

interface FormationEnLigne {
  id?: string | number;
  code?: string;
  titre?: string;
  title?: string;
  categorie?: string;
  description?: string;
  nbChapitres?: number;
  nbVideos?: number;
  lienPlateforme?: string;
  enseignant?: string;
  statut?: string;
}

const FALLBACK_FORMATIONS: FormationEnLigne[] = [
  {
    titre: 'Cours interactifs',
    description: 'Accédez aux modules numériques, supports PDF et vidéos de cours.',
  },
  {
    titre: 'Ressources pédagogiques',
    description: 'Retrouvez les documents utiles pour suivre vos apprentissages à distance.',
  },
  {
    titre: 'Suivi en ligne',
    description: 'Suivez l’évolution de vos activités et vos travaux en ligne.',
  },
];

export default function FormationsEnLignePage() {
  const { darkMode } = useTheme();
  const [formations, setFormations] = useState<FormationEnLigne[]>(FALLBACK_FORMATIONS);

  useEffect(() => {
    let isMounted = true;

    const loadFormations = async () => {
      try {
        const response = await ApiService.formationEnLigne.getAll();
        const data = response.data;

        if (isMounted && Array.isArray(data) && data.length > 0) {
          setFormations(data.filter((item: FormationEnLigne) => item.statut !== 'Archivé'));
        }
      } catch {
        if (isMounted) {
          setFormations(FALLBACK_FORMATIONS);
        }
      }
    };

    loadFormations();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full px-0 sm:px-4 md:px-8 lg:px-12 md:py-16 animate-fade-in">
      <div className="max-w-2xl mb-10 md:mb-16 space-y-3 md:space-y-4 px-1  pt-20">
        <span
          className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
          style={{ color: 'var(--primary)' }}
        >
          <Laptop size={14} /> Formations en ligne
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Apprendre <span className="text-gradient">à distance</span>
        </h1>
        <p className="text-sm opacity-70 leading-relaxed">
          Découvrez les formations en ligne et les ressources associées pour continuer à apprendre depuis n’importe où.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
        {formations.map((item, index) => {
          const icons = [Laptop, BookOpen, PlayCircle];
          const Icon = icons[index % icons.length];
          const title = item.titre || item.title || 'Formation en ligne';
          const description =
            item.description ||
            [item.categorie, item.enseignant, item.nbChapitres ? `${item.nbChapitres} chapitres` : '', item.nbVideos ? `${item.nbVideos} videos` : '']
              .filter(Boolean)
              .join(' - ');

          return (
            <div
              key={item.id || `${title}-${index}`}
              className="rounded-2xl border p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: darkMode ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.55)',
                borderColor: 'var(--border)',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--primary)' }}
              >
                <Icon size={20} />
              </div>
              <h2 className="text-lg font-black tracking-tight">{title}</h2>
              <p className="mt-2 text-sm opacity-70 leading-relaxed">{description}</p>
              {item.lienPlateforme && (
                <a
                  href={item.lienPlateforme}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide"
                  style={{ color: 'var(--primary)' }}
                >
                  Ouvrir la plateforme <ArrowRight size={13} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
