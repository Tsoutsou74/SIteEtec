import React from 'react';
import { Award, BookOpenCheck, Building2, Calendar, GraduationCap, Rocket, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TIMELINE_EVENTS = [
  {
    year: '2015',
    title: 'Fondation de E-TEC',
    icon: Rocket,
    color: 'text-green-500',
    description:
      "Creation de l'etablissement a Faravohitra avec une vision claire : rapprocher la formation superieure des besoins reels des entreprises.",
  },
  {
    year: '2018',
    title: 'Extension des filieres',
    icon: BookOpenCheck,
    color: 'text-blue-500',
    description:
      "Ouverture progressive des parcours en gestion, informatique, reseaux, batiment et filieres techniques pour accompagner les nouveaux metiers.",
  },
  {
    year: '2021',
    title: 'Renforcement academique',
    icon: Award,
    color: 'text-amber-500',
    description:
      "Structuration des programmes, consolidation des equipes pedagogiques et developpement des partenariats professionnels.",
  },
  {
    year: '2024',
    title: 'Modernisation digitale',
    icon: Building2,
    color: 'text-indigo-500',
    description:
      "Digitalisation des services academiques, amelioration du suivi des etudiants et evolution des outils de communication institutionnelle.",
  },
  {
    year: '2026',
    title: "Une universite tournee vers l'avenir",
    icon: GraduationCap,
    color: 'text-emerald-500',
    description:
      "E-TEC poursuit son developpement avec des formations adaptees aux besoins de Madagascar et aux standards professionnels actuels.",
  },
];

const HIGHLIGHTS = [
  { label: 'Annees d experience', value: '10+' },
  { label: 'Filieres majeures', value: '4' },
  { label: 'Approche professionnalisante', value: '100%' },
];

export default function Historique() {
  const { darkMode } = useTheme();

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 pt-28 md:pt-32 pb-16 animate-fade-in">
      <section className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-green-500">
              <Calendar size={15} /> Notre parcours
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              L'histoire de <span className="text-gradient">E-TEC University</span>
            </h1>
            <p className="text-sm md:text-base opacity-70 leading-relaxed max-w-3xl">
              Depuis sa creation, E-TEC construit une formation superieure pratique, exigeante et connectee aux besoins du marche de l'emploi.
            </p>
          </div>

          <div className="lg:col-span-4 grid grid-cols-3 gap-3">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label} className="rounded-2xl border p-4 text-center" style={cardStyle}>
                <div className="text-xl md:text-2xl font-black text-green-500">{item.value}</div>
                <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-wide opacity-60 mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-[118px] top-6 bottom-6 w-px bg-green-500/25" />
          <div className="space-y-5">
            {TIMELINE_EVENTS.map((event) => {
              const Icon = event.icon;
              return (
                <article key={event.year} className="grid grid-cols-1 md:grid-cols-[96px_44px_1fr] gap-4 md:gap-5 items-start">
                  <div className="text-2xl font-black tracking-tight text-green-500 md:text-right">{event.year}</div>
                  <div className="hidden md:flex w-11 h-11 rounded-2xl border items-center justify-center z-10" style={cardStyle}>
                    <Icon size={18} className={event.color} />
                  </div>
                  <div className="rounded-2xl border p-5 md:p-6 shadow-sm" style={cardStyle}>
                    <div className="flex md:hidden w-10 h-10 rounded-xl border items-center justify-center mb-4" style={{ borderColor: 'var(--border)' }}>
                      <Icon size={18} className={event.color} />
                    </div>
                    <h2 className="text-base md:text-lg font-black tracking-tight">{event.title}</h2>
                    <p className="text-xs md:text-sm opacity-70 leading-relaxed mt-2">{event.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5" style={cardStyle}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-500 font-black text-sm">
              <Users size={18} /> Une communaute en progression
            </div>
            <p className="text-sm opacity-70 max-w-2xl">
              L'histoire de E-TEC continue avec chaque promotion, chaque enseignant et chaque partenaire qui participe a son developpement.
            </p>
          </div>
          <a href="/admission" className="inline-flex justify-center rounded-xl bg-green-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white hover:bg-green-700 transition">
            Rejoindre E-TEC
          </a>
        </div>
      </section>
    </div>
  );
}
