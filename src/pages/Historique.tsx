import React, { useEffect, useState } from 'react';
import { Award, BookOpenCheck, Building2, Calendar, GraduationCap, Rocket, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ApiService from '../services/ApiService';
import { useT } from '../config/I18nProvider';

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
      'Ouverture progressive des parcours en gestion, informatique, reseaux, batiment et filieres techniques pour accompagner les nouveaux metiers.',
  },
  {
    year: '2021',
    title: 'Renforcement academique',
    icon: Award,
    color: 'text-amber-500',
    description:
      'Structuration des programmes, consolidation des equipes pedagogiques et developpement des partenariats professionnels.',
  },
  {
    year: '2024',
    title: 'Modernisation digitale',
    icon: Building2,
    color: 'text-indigo-500',
    description:
      'Digitalisation des services academiques, amelioration du suivi des etudiants et evolution des outils de communication institutionnelle.',
  },
  {
    year: '2026',
    title: "Une universite tournee vers l'avenir",
    icon: GraduationCap,
    color: 'text-emerald-500',
    description:
      'E-TEC poursuit son developpement avec des formations adaptees aux besoins de Madagascar et aux standards professionnels actuels.',
  },
];

const HIGHLIGHTS = [
  { labelKey: 'highlight1' as const, value: '10+' },
  { labelKey: 'highlight2' as const, value: '4' },
  { labelKey: 'highlight3' as const, value: '100%' },
];

interface HistoriqueApi {
  id?: number;
  year?: string;
  title?: string;
  description?: string;
  date?: string;
  action?: string;
  target?: string;
}

function toTimelineEvent(item: HistoriqueApi, index: number) {
  const icons = [Rocket, BookOpenCheck, Award, Building2, GraduationCap];
  const colors = ['text-green-500', 'text-blue-500', 'text-amber-500', 'text-indigo-500', 'text-emerald-500'];

  return {
    year: item.year || item.date || '',
    title: item.title || item.action || item.target || 'Historique E-TEC',
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
    description: item.description || item.target || '',
  };
}

export default function Historique() {
  const { darkMode } = useTheme();
  const { t } = useT();
  const [events, setEvents] = useState(TIMELINE_EVENTS);

  useEffect(() => {
    let isMounted = true;

    const loadHistorique = async () => {
      try {
        const response = await ApiService.historiques.getAll();
        const data = response.data;

        if (isMounted && Array.isArray(data) && data.length > 0) {
          setEvents(data.map(toTimelineEvent));
        }
      } catch {
        if (isMounted) {
          setEvents(TIMELINE_EVENTS);
        }
      }
    };

    loadHistorique();

    return () => {
      isMounted = false;
    };
  }, []);

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="animate-fade-in w-full px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-12">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-500">
              <Calendar size={15} /> {t('historique', 'sectionLabel')}
            </span>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t('historique', 'title1')} <span className="text-gradient">{t('historique', 'title2')}</span>
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed opacity-70 md:text-base">
              {t('historique', 'desc')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:col-span-4">
            {HIGHLIGHTS.map((item) => (
              <div key={item.labelKey} className="rounded-2xl border p-4 text-center" style={cardStyle}>
                <div className="text-xl font-black text-green-500 md:text-2xl">{item.value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wide opacity-60 md:text-[11px]">
                  {t('historique', item.labelKey)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-6 bottom-6 left-[118px] hidden w-px bg-green-500/25 md:block" />
          <div className="space-y-5">
            {events.map((event, index) => {
              const Icon = event.icon;
              return (
                <article key={`${event.year}-${event.title}-${index}`} className="grid grid-cols-1 items-start gap-4 md:grid-cols-[96px_44px_1fr] md:gap-5">
                  <div className="text-2xl font-black tracking-tight text-green-500 md:text-right">{event.year}</div>
                  <div className="z-10 hidden h-11 w-11 items-center justify-center rounded-2xl border md:flex" style={cardStyle}>
                    <Icon size={18} className={event.color} />
                  </div>
                  <div className="rounded-2xl border p-5 shadow-sm md:p-6" style={cardStyle}>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border md:hidden" style={{ borderColor: 'var(--border)' }}>
                      <Icon size={18} className={event.color} />
                    </div>
                    <h2 className="text-base font-black tracking-tight md:text-lg">{event.title}</h2>
                    <p className="mt-2 text-xs leading-relaxed opacity-70 md:text-sm">{event.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-3xl border p-6 md:flex-row md:items-center md:justify-between md:p-8" style={cardStyle}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-black text-green-500">
              <Users size={18} /> {t('historique', 'communityTitle')}
            </div>
            <p className="max-w-2xl text-sm opacity-70">
              {t('historique', 'communityDesc')}
            </p>
          </div>
          <a href="/admission" className="inline-flex justify-center rounded-xl bg-green-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-green-700">
            {t('historique', 'cta')}
          </a>
        </div>
      </section>
    </div>
  );
}
