import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Info, Target, Eye, Heart, Award, ShieldCheck } from 'lucide-react';

interface ValeurCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function ValeurCard({ icon, title, desc }: ValeurCardProps) {
  const { darkMode } = useTheme();
  return (
    <div
      className="p-4 md:p-6 rounded-2xl border shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md"
      style={{
        backgroundColor: darkMode ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.45)",
        borderColor: 'var(--border)',
        color: 'var(--text)'
      }}
    >
      <div
        className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-3 md:mb-4"
        style={{ backgroundColor: 'rgba(255,191,0,0.1)', color: 'var(--primary)' }}
      >
        {icon}
      </div>
      <h3 className="text-sm font-bold tracking-tight mb-1.5">{title}</h3>
      <p className="text-xs opacity-70 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function AboutPage() {
  const { darkMode } = useTheme();

  const glassStyle = {
    backgroundColor: darkMode ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)",
    borderColor: 'var(--border)'
  };

  return (
    <div className="w-full px-0 sm:px-4 md:px-8 xl:px-16 py-10 md:py-16 space-y-14 md:space-y-20 animate-fade-in">

      {/* GRILLE PRINCIPALE */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 md:gap-8 items-stretch w-full">

        {/* BLOC GAUCHE */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 md:space-y-8">
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-xl md:text-2xl font-black tracking-tight">A-propos</h3>
            <span
              className="text-xs tracking-widest uppercase flex items-center gap-2"
              style={{ color: 'var(--primary)' }}
            >
              <Info size={12} /> Qui sommes-nous ?
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              L'excellence académique <br className="hidden sm:block" />
              <span className="text-gradient">au cœur de Faravohitra</span>
            </h1>
            <p className="text-sm opacity-75 leading-relaxed pt-1 md:pt-2">
              Fondée avec l'ambition de former l'élite technologique et managériale de Madagascar,
              l'Université E-TEC s'impose comme un pôle d'innovation majeur. Grâce à nos infrastructures
              modernes situées à Faravohitra et nos programmes alignés sur les standards internationaux,
              nous préparons nos étudiants à devenir les acteurs clés du développement économique.
            </p>
          </div>

          {/* Chiffres clés */}
          <div
            className="p-5 md:p-6 rounded-3xl border shadow-xl backdrop-blur-md text-center space-y-4 relative overflow-hidden"
            style={glassStyle}
          >
            <div
              className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: 'var(--primary)' }}
            />
            <span className="text-3xl md:text-4xl font-black" style={{ color: 'var(--primary)' }}>E-TEC</span>
            <span className="text-xs font-black uppercase tracking-widest opacity-80 block -mt-2">Chiffres Clés</span>
            <div
              className="grid grid-cols-2 gap-4 pt-4 border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <div>
                <div className="text-xl md:text-2xl font-black text-amber-500">98%</div>
                <div className="text-[10px] font-bold uppercase opacity-50">Insertion Pro</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-blue-500">10+</div>
                <div className="text-[10px] font-bold uppercase opacity-50">Partenaires</div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOC DROITE — 2 cartes Mission / Vision
            Sur mobile : côte à côte (grid 2 cols), sur lg : colonne (col-span-3) */}
        <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-4">

          {/* Mission */}
          <div
            className="p-4 md:p-6 rounded-3xl border shadow-xl backdrop-blur-md text-center
              flex flex-col justify-center items-center relative overflow-hidden"
            style={glassStyle}
          >
            <div
              className="absolute -top-10 left-4 w-24 h-24 rounded-full blur-3xl opacity-15"
              style={{ backgroundColor: 'var(--primary)' }}
            />
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 mb-2 z-10">
              <Target size={20} />
            </div>
            <h2 className="text-sm md:text-base font-black uppercase tracking-widest text-gradient z-10">
              Notre Mission
            </h2>
            <div className="w-16 md:w-20 my-2 border-t z-10" style={{ borderColor: 'var(--border)' }} />
            <p className="text-xs opacity-70 leading-relaxed w-full z-10">
              Propulser l'employabilité des jeunes malgaches par le biais de formations professionnalisantes,
              alliant rigueur théorique et projets pratiques.
            </p>
          </div>

          {/* Vision */}
          <div
            className="p-4 md:p-6 rounded-3xl border shadow-xl backdrop-blur-md text-center
              flex flex-col justify-center items-center relative overflow-hidden"
            style={glassStyle}
          >
            <div
              className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full blur-3xl opacity-15"
              style={{ backgroundColor: '#3b82f6' }}
            />
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 mb-2 z-10">
              <Eye size={20} />
            </div>
            <h2 className="text-sm md:text-base font-black uppercase tracking-widest text-gradient z-10">
              Notre Vision
            </h2>
            <div className="w-16 md:w-20 my-2 border-t z-10" style={{ borderColor: 'var(--border)' }} />
            <p className="text-xs opacity-70 leading-relaxed w-full z-10">
              Devenir l'établissement de référence à Madagascar pour la formation des cadres et ingénieurs
              de demain, à l'avant-garde des mutations technologiques.
            </p>
          </div>

        </div>
      </div>

      {/* NOS VALEURS */}
      <div className="space-y-6 md:space-y-8 pt-2 md:pt-4">
        <div className="text-center max-w-xl mx-auto space-y-2 px-4">
          <h2 className="text-xl md:text-2xl font-black tracking-tight">Les valeurs qui nous guident</h2>
          <p className="text-xs opacity-60">Chaque jour, notre communauté académique s'appuie sur quatre piliers immuables.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 w-full">
          <ValeurCard
            icon={<Award size={18} />}
            title="Excellence"
            desc="Exiger le meilleur de nous-mêmes pour garantir des diplômes reconnus et hautement valorisés."
          />
          <ValeurCard
            icon={<ShieldCheck size={18} />}
            title="Intégrité"
            desc="Cultiver un environnement éthique, transparent et respectueux des mérites de chacun."
          />
          <ValeurCard
            icon={<Heart size={18} />}
            title="Engagement"
            desc="Accompagner chaque étudiant individuellement vers la réussite de son projet de vie."
          />
          <ValeurCard
            icon={<Target size={18} />}
            title="Innovation"
            desc="Adapter continuellement nos infrastructures et technologies aux exigences de demain."
          />
        </div>
      </div>

    </div>
  );
}