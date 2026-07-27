import React from 'react';
import { Award, BriefcaseBusiness, CheckCircle, Clock, Target, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../config/I18nProvider';

const STATIC_MODULES = [
  {
    id: 'mgmt',
    titre: 'Management et leadership',
    volumeHoraire: '24 à 40 heures',
    audience: 'Managers, responsables et chefs d\'équipe',
    skills: ['Pilotage d\'équipe', 'Gestion de conflit', 'Communication professionnelle'],
  },
  {
    id: 'info',
    titre: 'Informatique professionnelle',
    volumeHoraire: '30 à 60 heures',
    audience: 'Techniciens, développeurs et agents administratifs',
    skills: ['Bureautique avancée', 'Développement web', 'Bases de données'],
  },
  {
    id: 'btp',
    titre: 'BTP et outils techniques',
    volumeHoraire: '40 à 80 heures',
    audience: 'Techniciens BTP, conducteurs de travaux',
    skills: ['AutoCAD', 'Lecture de plans', 'Suivi de chantier'],
  },
];

export default function FormationContinuePage() {
  const { darkMode } = useTheme();
  const { t } = useT();

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.34)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  const featureCards = [
    { icon: Clock, title: t('formationContinue', 'feature1Title'), text: t('formationContinue', 'feature1Desc') },
    { icon: Award, title: t('formationContinue', 'feature2Title'), text: t('formationContinue', 'feature2Desc') },
    { icon: Target, title: t('formationContinue', 'feature3Title'), text: t('formationContinue', 'feature3Desc') },
  ];

  return (
    <div className="animate-fade-in w-full px-4 pb-12 pt-24 sm:px-6 md:pb-16 md:pt-28 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-12">
        <div className="max-w-4xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
            <BriefcaseBusiness size={16} /> {t('formationContinue', 'sectionLabel')}
          </span>
          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {t('formationContinue', 'title1')} <span className="text-gradient">{t('formationContinue', 'title2')}</span>
          </h1>
          <p className="text-sm leading-relaxed opacity-70 md:text-base">
            {t('formationContinue', 'desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featureCards.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-3xl border p-6" style={cardStyle}>
                <Icon size={24} className="mb-4 text-green-500" />
                <h2 className="text-lg font-black">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed opacity-70">{item.text}</p>
              </article>
            );
          })}
        </div>

        <div className="space-y-5">
          <h2 className="text-2xl font-black tracking-tight">{t('formationContinue', 'modulesTitle')}</h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {STATIC_MODULES.map((module) => (
              <article key={module.id} className="rounded-3xl border p-6 shadow-sm" style={cardStyle}>
                <h3 className="text-lg font-black">{module.titre}</h3>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-green-500">{module.volumeHoraire}</p>
                <p className="mt-4 text-sm opacity-65">{module.audience}</p>
                <ul className="mt-5 space-y-2">
                  {module.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-xs opacity-75">
                      <CheckCircle size={14} className="shrink-0 text-green-500" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border p-6 md:p-8" style={cardStyle}>
          <div className="mb-5 flex items-center gap-3">
            <Users size={22} className="text-green-500" />
            <h2 className="text-xl font-black">{t('formationContinue', 'businessTitle')}</h2>
          </div>
          <p className="max-w-4xl text-sm leading-relaxed opacity-75">
            {t('formationContinue', 'businessDesc')}
          </p>
        </div>
      </section>
    </div>
  );
}
