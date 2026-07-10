import React, { useEffect, useState } from 'react';
import { BookOpenCheck, CalendarDays, CheckCircle, GraduationCap, Layers, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ApiService from '../services/ApiService';
import { useT } from '../config/I18nProvider';

interface FormationInitiale {
  id?: string | number;
  code?: string;
  titre?: string;
  title?: string;
  filiere?: string;
  duree?: string;
  duration?: string;
  frais?: string;
  description?: string;
  statut?: string;
  items?: string[];
}

const FALLBACK_PARCOURS: FormationInitiale[] = [
  {
    titre: 'Administration et Gestion',
    duree: 'Licence 3 ans / Master 5 ans',
    items: ['Management', 'Comptabilite et finance', 'Marketing', 'Ressources humaines'],
  },
  {
    titre: 'Genie logiciel et reseaux',
    duree: 'Licence 3 ans / Master 5 ans',
    items: ['Developpement web et mobile', 'Administration systeme', 'Cloud et reseaux', 'Cybersecurite'],
  },
  {
    titre: 'Batiment et Travaux Publics',
    duree: 'Licence professionnelle 3 ans',
    items: ['Dessin BTP', 'Topographie', 'Conduite de chantier', 'Structures et beton arme'],
  },
  {
    titre: 'Electromecanique',
    duree: 'Licence professionnelle 3 ans',
    items: ['Automatisme', 'Maintenance industrielle', 'Electricite', 'Systemes mecaniques'],
  },
];

const steps = ['Depot du dossier', 'Etude du profil', 'Entretien d orientation', 'Inscription definitive'];

export default function FormationInitialePage() {
  const { darkMode } = useTheme();
  const { t } = useT();
  const [parcours, setParcours] = useState<FormationInitiale[]>(FALLBACK_PARCOURS);

  useEffect(() => {
    let isMounted = true;

    const loadFormations = async () => {
      try {
        const response = await ApiService.formationInitiale.getAll();
        const data = response.data;

        if (isMounted && Array.isArray(data) && data.length > 0) {
          setParcours(data);
        }
      } catch {
        if (isMounted) {
          setParcours(FALLBACK_PARCOURS);
        }
      }
    };

    loadFormations();

    return () => {
      isMounted = false;
    };
  }, []);

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.34)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="animate-fade-in w-full px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-12">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
              <GraduationCap size={16} /> {t('formationInitiale', 'sectionLabel')}
            </span>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t('formationInitiale', 'title1')} <span className="text-gradient">{t('formationInitiale', 'title2')}</span>
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed opacity-70 md:text-base">
              {t('formationInitiale', 'desc')}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:col-span-4">
            {[
              [t('formationInitiale', 'stats1'), '4'],
              [t('formationInitiale', 'stats2'), '3-5'],
              [t('formationInitiale', 'stats3'), '100%'],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border p-4 text-center" style={cardStyle}>
                <div className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wide opacity-60">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {parcours.map((item, index) => {
            const title = item.titre || item.title || t('formationInitiale', 'sectionLabel');
            const duration = item.duree || item.duration || item.frais || t('formationInitiale', 'durationFallback');
            const details = item.items || [item.filiere, item.description, item.statut].filter(Boolean);

            return (
              <article key={item.id || `${title}-${index}`} className="rounded-3xl border p-6 shadow-sm" style={cardStyle}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-green-500">
                    <BookOpenCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight">{title}</h2>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide opacity-55">{duration}</p>
                  </div>
                </div>
                <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {details.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-xs opacity-75">
                      <CheckCircle size={14} className="shrink-0 text-green-500" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border p-6 md:p-8" style={cardStyle}>
            <div className="mb-5 flex items-center gap-3">
              <Layers size={20} className="text-green-500" />
              <h2 className="text-xl font-black">{t('formationInitiale', 'studyOrgTitle')}</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed opacity-75">
              <p>{t('formationInitiale', 'studyOrgDesc1')}</p>
              <p>{t('formationInitiale', 'studyOrgDesc2')}</p>
            </div>
          </section>

          <section className="rounded-3xl border p-6 md:p-8" style={cardStyle}>
            <div className="mb-5 flex items-center gap-3">
              <CalendarDays size={20} className="text-green-500" />
              <h2 className="text-xl font-black">{t('formationInitiale', 'admissionTitle')}</h2>
            </div>
            <div className="space-y-3">
              <p className="text-sm opacity-75">{t('formationInitiale', 'admissionDesc')}</p>
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 text-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-600 text-xs font-black text-white">{index + 1}</span>
                  <span className="font-semibold opacity-80">{step}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border p-6 md:flex-row md:items-center md:justify-between md:p-8" style={cardStyle}>
          <div className="flex items-center gap-3">
            <Users size={22} className="text-green-500" />
            <div>
              <h2 className="font-black">{t('formationInitiale', 'readyTitle')}</h2>
              <p className="text-sm opacity-65">{t('formationInitiale', 'readyDesc')}</p>
            </div>
          </div>
          <a href="/admission" className="inline-flex justify-center rounded-xl bg-green-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-green-700">
            {t('formationInitiale', 'cta')}
          </a>
        </div>
      </section>
    </div>
  );
}
