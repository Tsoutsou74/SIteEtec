import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80",
];

// ── Période d'inscription ──────────────────────────────
const ANNEE_SCOLAIRE = {
  debut: { mois: 5,  jour: 1 },   // 1er Janvier
  fin:   { mois: 9,  jour: 15 },  // 15 Mars
};

function isPeriodeScolaireActive(): boolean {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const { debut, fin } = ANNEE_SCOLAIRE;

  if (debut.mois > fin.mois) {
    const apresDebut = month > debut.mois || (month === debut.mois && day >= debut.jour);
    const avantFin   = month < fin.mois   || (month === fin.mois   && day <= fin.jour);
    return apresDebut || avantFin;
  }
  const apresDebut = month > debut.mois || (month === debut.mois && day >= debut.jour);
  const avantFin   = month < fin.mois   || (month === fin.mois   && day <= fin.jour);
  return apresDebut && avantFin;
}

export default function HeroBanner() {
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
    <section className="relative h-[480px] sm:h-[540px] md:h-[580px] lg:h-[620px] flex items-center px-6 sm:px-10 md:px-16 overflow-hidden">

      {/* Fond avec slideshow */}
      <div className="absolute inset-0 z-0">
        {BACKGROUND_IMAGES.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `linear-gradient(rgba(4,4,4,0.15), rgba(4,4,4,0.35)), url('${img}')`,
              opacity: index === currentIndex ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Contenu */}
      <div className="relative z-10 mt-10 md:mt-14 animate-fade-up w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl space-y-4 md:space-y-5">

        {/* ── Badge "Inscriptions ouvertes" — visible seulement pendant la période ── */}
        {inscriptionVisible && (
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-white rounded-full text-[11px] font-bold uppercase tracking-wider border animate-pulse-slow w-fit"
            style={{
              backgroundColor: 'rgba(34,197,94,0.15)',
              borderColor: 'rgba(34,197,94,0.4)',
            }}
          >
            <Sparkles size={12} />
            Inscriptions ouvertes
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#4ade80' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#4ade80' }} />
            </span>
          </div>
        )}

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15]">
          Université d'excellence <br className="hidden sm:block" />
          <span className="text-gradient">et d'innovation</span>
        </h2>
        <p className="text-xs sm:text-sm text-white/80 max-w-xs sm:max-w-md lg:max-w-lg font-light leading-relaxed">
          Découvrez un environnement d'apprentissage moderne conçu pour propulser vos ambitions professionnelles à Madagascar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">

          {/* Bouton Inscription — masqué hors période scolaire */}
          {inscriptionVisible && (
            <button
              onClick={() => navigate('/Inscriptions')}
              className="text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Inscription <ArrowRight size={14} />
            </button>
          )}

          <button
            onClick={() => navigate('/formations')}
            className="border border-white/20 hover:bg-white/10 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Formations
          </button>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-4 md:bottom-6 right-6 md:right-16 flex gap-2 z-10">
        {BACKGROUND_IMAGES.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}