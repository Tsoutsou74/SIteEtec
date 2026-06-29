import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-4 animate-fade-in">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gradient">Présentation</span>
      <h3 className="text-3xl font-black tracking-tight">Une institution au service de la nation</h3>
      <p className="text-xs leading-relaxed opacity-70">
        L'établissement s'engage à former les futurs cadres et leaders d'élite de demain à Madagascar, en alliant innovation, rigueur et compétences technologiques adaptées.
      </p>
      <button className="text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer hover:opacity-90" style={{ backgroundColor: 'var(--primary)' }}>
        En savoir plus <ChevronRight size={14} />
      </button>
    </div>
  );
}