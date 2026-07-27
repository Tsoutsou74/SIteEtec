import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useT } from '../../config/I18nProvider';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
    label: 'Campus E-TEC',
  },
  {
    image: 'https://images.unsplash.com/photo-1532649538693-f3a2ec1bf8bd?auto=format&fit=crop&w=1600&q=80',
    label: 'Remise des diplômes',
  },
  {
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80',
    label: 'Vie étudiante',
  },
  {
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
    label: 'Salles de cours',
  },
  {
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80',
    label: 'Bibliothèque & Ressources',
  },
  {
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80',
    label: 'Travaux pratiques',
  },
  {
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1600&q=80',
    label: 'Formations techniques',
  },
  {
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
    label: 'Recherche & Innovation',
  },
  {
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
    label: 'Conférences & Séminaires',
  },
  {
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=1600&q=80',
    label: 'Projets collaboratifs',
  },
];

const ANNEE_SCOLAIRE = {
  debut: { mois: 5, jour: 1 },
  fin: { mois: 9, jour: 15 },
};

function isPeriodeScolaireActive(): boolean {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const { debut, fin } = ANNEE_SCOLAIRE;

  if (debut.mois > fin.mois) {
    const apresDebut = month > debut.mois || (month === debut.mois && day >= debut.jour);
    const avantFin = month < fin.mois || (month === fin.mois && day <= fin.jour);
    return apresDebut || avantFin;
  }

  const apresDebut = month > debut.mois || (month === debut.mois && day >= debut.jour);
  const avantFin = month < fin.mois || (month === fin.mois && day <= fin.jour);
  return apresDebut && avantFin;
}

export default function HeroBanner() {
  const { t } = useT();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [inscriptionVisible] = useState(isPeriodeScolaireActive());
  const [paused, setPaused] = useState(false);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, paused]);

  return (
    <section
      className="relative flex h-[380px] items-center overflow-hidden px-6 sm:h-[440px] sm:px-10 md:h-[480px] md:px-16 lg:h-[520px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides background */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.image}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `linear-gradient(rgba(4,4,4,0.15), rgba(4,4,4,0.45)), url('${slide.image}')`,
              opacity: index === currentIndex ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Arrow Left */}
      <button
        onClick={goPrev}
        className="absolute left-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 md:left-4 md:h-10 md:w-10"
        aria-label="Slide précédent"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Arrow Right */}
      <button
        onClick={goNext}
        className="absolute right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 md:right-4 md:h-10 md:w-10"
        aria-label="Slide suivant"
      >
        <ChevronRight size={18} />
      </button>

      {/* Content */}
      <div className="relative z-10 mt-6 w-full max-w-xs space-y-3 animate-fade-up sm:max-w-lg md:mt-8 md:max-w-2xl md:space-y-4 lg:max-w-3xl">
        {inscriptionVisible && (
          <div
            className="inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white animate-pulse-slow"
            style={{ backgroundColor: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.4)' }}
          >
            <Sparkles size={11} />
            {t('hero', 'badge')}
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: '#4ade80' }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#4ade80' }} />
            </span>
          </div>
        )}

        <h2 className="text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl">
          {t('hero', 'title1')} <br className="hidden sm:block" />
          <span className="text-gradient">{t('hero', 'title2')}</span>
        </h2>
        <p className="max-w-xs text-xs font-light leading-relaxed text-white/80 sm:max-w-md sm:text-sm lg:max-w-lg">
          {t('hero', 'subtitle')}
        </p>
        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:gap-3">
          {inscriptionVisible && (
            <button
              onClick={() => navigate('/Admission')}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90 sm:px-5 sm:py-3"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {t('hero', 'ctaAdmission')} <ArrowRight size={14} />
            </button>
          )}

          <button
            onClick={() => navigate('/formations')}
            className="cursor-pointer rounded-xl border border-white/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10 sm:px-5 sm:py-3"
          >
            {t('hero', 'ctaPrograms')}
          </button>
        </div>
      </div>

     

      {/* Dots navigation */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Aller au slide ${index + 1}`}
            className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-7 bg-amber-400'
                : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      

      <style>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
