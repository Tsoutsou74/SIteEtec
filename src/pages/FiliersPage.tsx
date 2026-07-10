import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Landmark, Code, HardHat, Cpu, ArrowRight, GraduationCap } from 'lucide-react';
import ApiService from '../services/ApiService';
import { useT } from '../config/I18nProvider';

interface FilierCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  options: string[];
  duration: string;
  specializationLabel: string;
  detailsLabel: string;
}

interface FiliereApi {
  id?: number;
  code?: string;
  nom?: string;
  responsable?: string;
  description?: string;
  nombreEtudiants?: number;
}

function FilierCard({ icon, title, description, options, duration, specializationLabel, detailsLabel }: FilierCardProps) {
  const { darkMode } = useTheme();

  return (
    <div
      className="flex flex-col justify-between rounded-3xl border p-5 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8"
      style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      <div>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl md:mb-6 md:h-14 md:w-14" style={{ backgroundColor: 'rgba(255,191,0,0.1)', color: 'var(--primary)' }}>
          {icon}
        </div>

        <h3 className="mb-2 text-base font-black leading-snug tracking-tight md:mb-3 md:text-xl">
          {title}
        </h3>
        <p className="mb-4 text-xs leading-relaxed opacity-70 md:mb-6">
          {description}
        </p>

        <div className="mb-4 space-y-2 md:mb-6">
          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-50">
            {specializationLabel}
          </span>
          <ul className="space-y-1.5 text-xs font-medium">
            {options.map((opt) => (
              <li key={opt} className="flex items-center gap-2 opacity-80">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                {opt}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t pt-3 md:pt-4" style={{ borderColor: 'var(--border)' }}>
        <span className="text-[10px] font-bold uppercase tracking-wide opacity-60 leading-tight">
          {duration}
        </span>
        <button className="flex shrink-0 cursor-pointer items-center gap-1 text-xs font-bold uppercase tracking-wider transition hover:opacity-80" style={{ color: 'var(--primary)' }}>
          {detailsLabel} <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

export default function FiliersPage() {
  const { t } = useT();
  const [filiers, setFiliers] = useState<FiliereApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadFiliers = async () => {
      try {
        const response = await ApiService.filieres.getAll();
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

  const cards = filiers.length > 0
    ? filiers
    : [
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

    const responsibleLabel = filiere.responsable || t('filiers', 'toBeSpecified');
    const studentCount = filiere.nombreEtudiants !== undefined ? `${filiere.nombreEtudiants} ${t('filiers', 'studentCount')}` : t('filiers', 'countToBeSpecified');

    return {
      icon: iconMap[filiere.code || ''] || <GraduationCap size={24} />,
      title: filiere.nom || t('filiers', 'programName'),
      description: filiere.description || '',
      options: [
        `${t('filiers', 'responsible')}: ${responsibleLabel}`,
        studentCount,
      ],
      duration: filiere.code || t('filiers', 'details'),
      id: filiere.id || filiere.code || filiere.nom || Math.random().toString(),
    };
  });

  return (
    <div className="animate-fade-in w-full px-0 py-10 sm:px-4 md:px-8 md:py-16 lg:px-12">
      <div className="mb-10 max-w-2xl space-y-3 px-1 md:mb-16 md:space-y-4">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
          <GraduationCap size={20} /> {t('filiers', 'sectionLabel')}
        </span>
        <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {t('filiers', 'title1')} <span className="text-gradient">{t('filiers', 'title2')}</span>
        </h2>
        <p className="text-sm leading-relaxed opacity-70">{t('filiers', 'desc')}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
        {!loading && groupedCards.map((item) => (
          <FilierCard
            key={String(item.id)}
            icon={item.icon}
            title={item.title}
            description={item.description}
            options={item.options}
            duration={item.duration}
            specializationLabel={t('filiers', 'specializations')}
            detailsLabel={t('filiers', 'details')}
          />
        ))}
      </div>
    </div>
  );
}
