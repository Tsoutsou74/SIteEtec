import React, { useEffect, useState } from 'react';
import { BookOpen, Laptop, PlayCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ApiService from '../services/ApiService';
import { useT } from '../config/I18nProvider';

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
  { titre: 'Cours interactifs', description: 'Accedez aux modules numeriques, supports PDF et videos de cours.' },
  { titre: 'Ressources pedagogiques', description: 'Retrouvez les documents utiles pour suivre vos apprentissages a distance.' },
  { titre: 'Suivi en ligne', description: 'Suivez l evolution de vos activites et vos travaux en ligne.' },
];

export default function FormationsEnLignePage() {
  const { darkMode } = useTheme();
  const { t } = useT();
  const [formations, setFormations] = useState<FormationEnLigne[]>(FALLBACK_FORMATIONS);

  useEffect(() => {
    let isMounted = true;

    const loadFormations = async () => {
      try {
        const response = await ApiService.formationEnLigne.getAll();
        const data = response.data;

        if (isMounted && Array.isArray(data) && data.length > 0) {
          setFormations(data.filter((item: FormationEnLigne) => item.statut !== t('formationsEnLigne', 'archived')));
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
  }, [t]);

  return (
    <div className="animate-fade-in w-full px-0 sm:px-4 md:px-8 lg:px-12 md:py-16">
      <div className="mb-10 max-w-2xl space-y-3 px-1 pt-20 md:mb-16 md:space-y-4">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
          <Laptop size={14} /> {t('formationsEnLigne', 'sectionLabel')}
        </span>
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {t('formationsEnLigne', 'title1')} <span className="text-gradient">{t('formationsEnLigne', 'title2')}</span>
        </h1>
        <p className="text-sm leading-relaxed opacity-70">
          {t('formationsEnLigne', 'desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
        {formations.map((item, index) => {
          const icons = [Laptop, BookOpen, PlayCircle];
          const Icon = icons[index % icons.length];
          const title = item.titre || item.title || t('formationsEnLigne', 'titleFallback');
          const description =
            item.description ||
            [item.categorie, item.enseignant, item.nbChapitres ? `${item.nbChapitres} chapitres` : '', item.nbVideos ? `${item.nbVideos} videos` : '']
              .filter(Boolean)
              .join(' - ');

          return (
            <div
              key={item.id || `${title}-${index}`}
              className="rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 md:p-6"
              style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.55)', borderColor: 'var(--border)' }}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--primary)' }}>
                <Icon size={20} />
              </div>
              <h2 className="text-lg font-black tracking-tight">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{description}</p>
              {item.lienPlateforme && (
                <a
                  href={item.lienPlateforme}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide"
                  style={{ color: 'var(--primary)' }}
                >
                  {t('formationsEnLigne', 'openPlatform')} <ArrowRight size={13} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
