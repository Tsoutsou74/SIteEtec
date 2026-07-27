import React from 'react';
import { BookOpen, Laptop, PlayCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../config/I18nProvider';

const STATIC_FORMATIONS = [
  {
    id: 'interactive',
    titre: 'Cours interactifs',
    description: 'Accédez aux modules numériques, supports PDF et vidéos de cours.',
    lienPlateforme: '',
  },
  {
    id: 'ressources',
    titre: 'Ressources pédagogiques',
    description: 'Retrouvez les documents utiles pour suivre vos apprentissages à distance.',
    lienPlateforme: '',
  },
  {
    id: 'suivi',
    titre: 'Suivi en ligne',
    description: 'Suivez l\'évolution de vos activités et vos travaux en ligne.',
    lienPlateforme: '',
  },
];

export default function FormationsEnLignePage() {
  const { darkMode } = useTheme();
  const { t } = useT();

  return (
    <div className="animate-fade-in w-full px-4 pb-12 pt-24 sm:px-6 md:px-8 md:pb-16 md:pt-28 lg:px-12">
      <div className="mb-10 max-w-2xl space-y-3 py-4 md:mb-16 md:space-y-4">
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
        {STATIC_FORMATIONS.map((item, index) => {
          const icons = [Laptop, BookOpen, PlayCircle];
          const Icon = icons[index % icons.length];

          return (
            <div
              key={item.id}
              className="rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 md:p-6"
              style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.55)', borderColor: 'var(--border)' }}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--primary)' }}>
                <Icon size={20} />
              </div>
              <h2 className="text-lg font-black tracking-tight">{item.titre}</h2>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{item.description}</p>
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
