import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Landmark, Code, HardHat, Cpu, ArrowRight, GraduationCap } from 'lucide-react';
import ApiService from '../services/ApiService';

interface FilierCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  options: string[];
  duration: string;
}

interface FiliereApi {
  id?: number;
  code?: string;
  nom?: string;
  responsable?: string;
  description?: string;
  nombreEtudiants?: number;
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
  const [filiers, setFiliers] = useState<FiliereApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadFiliers = async () => {
      try {
        const response = await ApiService.filiers.getAll();
        const data = response.data;

        if (isMounted && Array.isArray(data)) {
          setFiliers(data);
        }
      } catch {
        if (isMounted) {
          setFiliers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFiliers();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = filiers.length > 0 ? filiers : [
    { code: 'GL', nom: 'Génie Logiciel', responsable: 'Chef de mention', description: 'Développement d’applications web, mobiles et architectures cloud.' },
    { code: 'ADM', nom: 'Administration et Gestion', responsable: 'Chef de mention', description: 'Gestion des entreprises, comptabilité et management stratégique.' },
    { code: 'BTP', nom: 'Bâtiment et Travaux Publics', responsable: 'Chef de mention', description: 'Infrastructures, génie civil et résistance des matériaux.' },
    { code: 'EM', nom: 'Électromécanique', responsable: 'Chef de mention', description: 'Systèmes automatisés, maintenance industrielle et électricité.' },
  ];

  const groupedCards = cards.map((filiere) => {
    const iconMap: Record<string, React.ReactNode> = {
      GL: <Code size={24} />,
      ADM: <Landmark size={24} />,
      BTP: <HardHat size={24} />,
      EM: <Cpu size={24} />,
    };

    return {
      icon: iconMap[filiere.code || ''] || <GraduationCap size={24} />,
      title: filiere.nom || 'Filière',
      description: filiere.description || '',
      options: [
        filiere.responsable ? `Responsable: ${filiere.responsable}` : 'Responsable à préciser',
        filiere.nombreEtudiants !== undefined ? `${filiere.nombreEtudiants} inscrits` : 'Effectif à préciser',
      ],
      duration: filiere.code || 'Détails',
      id: filiere.id || filiere.code || filiere.nom || Math.random().toString(),
    };
  });

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
        {!loading && groupedCards.map((item) => (
          <FilierCard
            key={String(item.id)}
            icon={item.icon}
            title={item.title}
            description={item.description}
            options={item.options}
            duration={item.duration}
          />
        ))}

      </div>
    </div>
  );
}
