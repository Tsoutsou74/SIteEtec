import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Landmark, Code, HardHat, Cpu, ArrowRight, GraduationCap } from 'lucide-react';

interface FilierCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  options: string[];
  duration: string;
}

function FilierCard({ icon, title, description, options, duration }: FilierCardProps) {
  const { darkMode } = useTheme();

  return (
    <div
      className="p-5 md:p-8 rounded-3xl border shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
      style={{
        backgroundColor: darkMode ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.45)",
        borderColor: 'var(--border)',
        color: 'var(--text)'
      }}
    >
      <div>
        {/* Icône */}
        <div
          className="w-11 h-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6"
          style={{ backgroundColor: 'rgba(255,191,0,0.1)', color: 'var(--primary)' }}
        >
          {icon}
        </div>

        <h3 className="text-base md:text-xl font-black mb-2 md:mb-3 tracking-tight leading-snug">
          {title}
        </h3>
        <p className="text-xs opacity-70 leading-relaxed mb-4 md:mb-6">
          {description}
        </p>

        {/* Spécialisations */}
        <div className="space-y-2 mb-4 md:mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block">
            Spécialisations :
          </span>
          <ul className="space-y-1.5 text-xs font-medium">
            {options.map((opt, idx) => (
              <li key={idx} className="flex items-center gap-2 opacity-80">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: 'var(--primary)' }}
                />
                {opt}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer de la carte */}
      <div
        className="pt-3 md:pt-4 border-t flex justify-between items-center gap-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wide opacity-60 leading-tight">
          {duration}
        </span>
        <button
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition hover:opacity-80 cursor-pointer shrink-0"
          style={{ color: 'var(--primary)' }}
        >
          Détails <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

export default function FiliersPage() {
  return (
    <div className="w-full px-0 sm:px-4 md:px-8 lg:px-12 py-10 md:py-16 animate-fade-in">

      {/* En-tête */}
      <div className="max-w-2xl mb-10 md:mb-16 space-y-3 md:space-y-4 px-1">
        <span
          className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
          style={{ color: 'var(--primary)' }}
        >
          <GraduationCap size={20} /> Nos Formations d'Avenir
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Découvrez nos <span className="text-gradient">Filières Majeures</span>
        </h2>
        <p className="text-sm opacity-70 leading-relaxed">
          E-TEC propose des cursus d'excellence conçus pour répondre précisément aux besoins
          d'innovation et d'encadrement des entreprises à Madagascar et à l'international.
        </p>
      </div>

      {/* Grille des filières
          - mobile : 1 colonne (cartes empilées, descriptions lisibles)
          - md+    : 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">

        <FilierCard
          icon={<Landmark size={24} />}
          title="Administration et Gestion"
          description="Formez-vous aux outils modernes de pilotage d'entreprise, de management d'équipe et d'analyse financière pour devenir les leaders économiques de demain."
          options={["Gestion des Entreprises", "Ressources Humaines", "Marketing & Commerce", "Comptabilité et Finance"]}
          duration="Licence (3 ans) / Master (5 ans)"
        />

        <FilierCard
          icon={<Code size={24} />}
          title="Génie Logiciel et Administration Réseaux"
          description="Devenez un expert des technologies numériques : de l'architecture de systèmes informatiques complexes au développement d'applications cloud et mobiles sécurisées."
          options={["Développement Full-Stack", "Architecture Réseaux & Cloud", "Cybersécurité", "Administration Systèmes"]}
          duration="Licence (3 ans) / Master (5 ans)"
        />

        <FilierCard
          icon={<HardHat size={24} />}
          title="Bâtiment et Travaux Publics"
          description="Maîtrisez l'ensemble du cycle de vie des infrastructures : conception, étude des structures, planification éco-responsable et conduite de chantiers d'envergure."
          options={["Génie Civil & Structures", "Conduite de Travaux", "Topographie & Dessin BTP", "Infrastructures Durables"]}
          duration="Licence Pro (3 ans)"
        />

        <FilierCard
          icon={<Cpu size={24} />}
          title="Électromécanique et Industriels"
          description="Associez les compétences électriques, mécaniques et informatiques pour concevoir, automatiser, optimiser et maintenir les systèmes de production industriels modernes."
          options={["Automatismes Industriels", "Maintenance Électromécanique", "Robotique & Systèmes Intégrés", "Génie Énergétique"]}
          duration="Licence Pro (3 ans)"
        />

      </div>
    </div>
  );
}