import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useT } from '../../config/I18nProvider';

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80',
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex h-[480px] items-center overflow-hidden px-6 sm:h-[540px] sm:px-10 md:h-[580px] md:px-16 lg:h-[620px]">
      <div className="absolute inset-0 z-0">
        {BACKGROUND_IMAGES.map((img, index) => (
          <div
            key={img}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `linear-gradient(rgba(4,4,4,0.15), rgba(4,4,4,0.35)), url('${img}')`,
              opacity: index === currentIndex ? 1 : 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mt-10 w-full max-w-xs space-y-4 animate-fade-up sm:max-w-lg md:mt-14 md:max-w-2xl md:space-y-5 lg:max-w-3xl">
        {inscriptionVisible && (
          <div
            className="inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white animate-pulse-slow"
            style={{ backgroundColor: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.4)' }}
          >
            <Sparkles size={12} />
            {t('hero', 'badge')}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: '#4ade80' }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: '#4ade80' }} />
            </span>
          </div>
        )}

        <h2 className="text-3xl font-black leading-[1.15] tracking-tight sm:text-4xl md:text-5xl">
          {t('hero', 'title1')} <br className="hidden sm:block" />
          <span className="text-gradient">{t('hero', 'title2')}</span>
        </h2>
        <p className="max-w-xs text-xs font-light leading-relaxed text-white/80 sm:max-w-md sm:text-sm lg:max-w-lg">
          {t('hero', 'subtitle')}
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
          {inscriptionVisible && (
            <button
              onClick={() => navigate('/Inscriptions')}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {t('hero', 'ctaAdmission')} <ArrowRight size={14} />
            </button>
          )}

          <button
            onClick={() => navigate('/formations')}
            className="cursor-pointer rounded-xl border border-white/20 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
          >
            {t('hero', 'ctaPrograms')}
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 right-6 z-10 flex gap-2 md:bottom-6 md:right-16">
        {BACKGROUND_IMAGES.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${index === currentIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}
