import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80",
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 0) % BACKGROUND_IMAGES.length);
    });
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
      <div className="relative z-10 text-white mt-10 md:mt-14 animate-fade-up w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl space-y-4 md:space-y-5">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15]">
          Université d'excellence <br className="hidden sm:block" />
          <span className="text-gradient">et d'innovation</span>
        </h2>

        <p className="text-xs sm:text-sm text-white/80 max-w-xs sm:max-w-md lg:max-w-lg font-light leading-relaxed">
          Découvrez un environnement d'apprentissage moderne conçu pour propulser vos ambitions professionnelles à Madagascar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            className="text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Inscription <ArrowRight size={14} />
          </button>
          <button className="border border-white/20 hover:bg-white/10 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer">
            Formations
          </button>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-4 md:bottom-6 right-6 md:right-16 flex gap-2 z-10">
        {BACKGROUND_IMAGES.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}