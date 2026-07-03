import React from 'react';
import { Award, Calendar, ChevronRight, GraduationCap, Quote, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const VALUES = [
  { icon: GraduationCap, label: 'Excellence academique' },
  { icon: Award, label: 'Diplomes reconnus' },
  { icon: Sparkles, label: 'Innovation pedagogique' },
];

export default function MotPresidents() {
  const { darkMode } = useTheme();

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 pt-28 md:pt-32 pb-16 animate-fade-in">
      <section className="max-w-6xl mx-auto space-y-10">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-blue-500">
            <Quote size={15} /> Edito institutionnel
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Le mot du <span className="text-gradient">President</span>
          </h1>
          <p className="text-sm md:text-base opacity-70 leading-relaxed">
            Un message adresse aux etudiants, aux familles et aux partenaires qui construisent avec nous l'avenir de E-TEC University.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-4 rounded-3xl border p-6 md:p-7 text-center shadow-sm" style={cardStyle}>
            <div className="relative mx-auto mb-5 w-40 h-52 rounded-3xl overflow-hidden border shadow-md" style={{ borderColor: 'var(--border)' }}>
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=520"
                alt="President de E-TEC University"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-lg font-black tracking-tight">Pr. Andrianaivoravelona</h2>
            <p className="text-xs font-black uppercase tracking-wider text-blue-500 mt-1">President fondateur</p>
            <p className="text-[11px] opacity-50 mt-1">E-TEC University - Faravohitra</p>

            <div className="mt-6 pt-5 border-t space-y-3 text-left" style={{ borderColor: 'var(--border)' }}>
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.label} className="flex items-center gap-3 text-xs font-semibold opacity-80">
                    <Icon size={16} className="text-blue-500 shrink-0" />
                    <span>{value.label}</span>
                  </div>
                );
              })}
              <div className="flex items-center gap-3 text-xs font-semibold opacity-80">
                <Calendar size={16} className="text-green-500 shrink-0" />
                <span>Annee universitaire 2026 - 2027</span>
              </div>
            </div>
          </aside>

          <article className="lg:col-span-8 rounded-3xl border p-6 md:p-8 shadow-sm relative overflow-hidden" style={cardStyle}>
            <Quote size={90} className="absolute -top-2 right-5 opacity-[0.04]" />
            <div className="space-y-5 relative">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-blue-500">
                Batir ensemble l'avenir technologique et professionnel de Madagascar.
              </h2>

              <div className="space-y-4 text-sm leading-relaxed opacity-80 text-justify">
                <p>Chers etudiants, chers parents, chers partenaires,</p>
                <p>
                  Bienvenue a E-TEC University. Notre ambition est simple : offrir une formation superieure utile, exigeante et directement reliee aux realites du monde professionnel.
                </p>
                <p>
                  Les metiers evoluent rapidement. Le numerique, la gestion, les reseaux, le batiment et les technologies industrielles demandent des profils capables d'apprendre, de pratiquer et de s'adapter. C'est dans cet esprit que nous construisons nos programmes.
                </p>
                <p>
                  A E-TEC, nous croyons a la discipline, au travail concret, a l'accompagnement des etudiants et a la responsabilite. Notre mission est de former des jeunes competents, confiants et prets a contribuer au developpement de Madagascar.
                </p>
                <p>
                  Je vous invite a decouvrir nos formations, notre histoire et notre organisation. Votre parcours commence par une decision, et nous sommes prets a vous accompagner.
                </p>
              </div>

              <div className="pt-5 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs opacity-55">
                  Fait a Antananarivo, Madagascar
                </div>
                <a href="/admission" className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:opacity-90" style={{ backgroundColor: 'var(--primary)' }}>
                  Rejoindre nos cursus
                  <ChevronRight size={15} />
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
