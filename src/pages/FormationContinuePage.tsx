import React, { useEffect, useState } from 'react';
import { Award, BriefcaseBusiness, CheckCircle, Clock, Target, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ApiService from '../services/ApiService';

interface FormationContinue {
  id?: string | number;
  code?: string;
  titre?: string;
  title?: string;
  domaine?: string;
  volumeHoraire?: string;
  duration?: string;
  tarifEntreprise?: string;
  typePublic?: string;
  audience?: string;
  description?: string;
  statut?: string;
  skills?: string[];
}

const FALLBACK_MODULES: FormationContinue[] = [
  {
    titre: 'Management et leadership',
    volumeHoraire: '24 a 40 heures',
    audience: 'Managers, responsables et chefs d equipe',
    skills: ['Pilotage d equipe', 'Gestion de conflit', 'Communication professionnelle'],
  },
  {
    titre: 'Informatique professionnelle',
    volumeHoraire: '30 a 60 heures',
    audience: 'Techniciens, developpeurs et agents administratifs',
    skills: ['Bureautique avancee', 'Developpement web', 'Bases de donnees'],
  },
  {
    titre: 'BTP et outils techniques',
    volumeHoraire: '40 a 80 heures',
    audience: 'Techniciens BTP, conducteurs de travaux',
    skills: ['AutoCAD', 'Lecture de plans', 'Suivi de chantier'],
  },
];

export default function FormationContinuePage() {
  const { darkMode } = useTheme();
  const [modules, setModules] = useState<FormationContinue[]>(FALLBACK_MODULES);

  useEffect(() => {
    let isMounted = true;

    const loadFormations = async () => {
      try {
        const response = await ApiService.formationContinue.getAll();
        const data = response.data;

        if (isMounted && Array.isArray(data) && data.length > 0) {
          setModules(data);
        }
      } catch {
        if (isMounted) {
          setModules(FALLBACK_MODULES);
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
    <div className="w-full px-4 sm:px-6 lg:px-12 pt-28 md:pt-32 pb-16 animate-fade-in">
      <section className="max-w-6xl mx-auto space-y-12">
        <div className="max-w-4xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase" style={{ color: 'var(--primary)' }}>
            <BriefcaseBusiness size={16} /> Formation continue
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Des modules courts pour renforcer les competences professionnelles
          </h1>
          <p className="text-sm md:text-base opacity-70 leading-relaxed">
            La formation continue accompagne les salaries, entrepreneurs, techniciens et demandeurs d emploi qui veulent actualiser leurs competences sans reprendre un cursus long.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Clock, title: 'Horaires flexibles', text: 'Cours du soir, week-end ou sessions intensives selon les besoins.' },
            { icon: Award, title: 'Attestation', text: 'Certification ou attestation de participation a la fin du module.' },
            { icon: Target, title: 'Objectifs pratiques', text: 'Des contenus orientes metier, directement applicables en entreprise.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-3xl border p-6" style={cardStyle}>
                <Icon size={24} className="text-green-500 mb-4" />
                <h2 className="text-lg font-black">{item.title}</h2>
                <p className="text-sm opacity-70 leading-relaxed mt-2">{item.text}</p>
              </article>
            );
          })}
        </div>

        <div className="space-y-5">
          <h2 className="text-2xl font-black tracking-tight">Modules disponibles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {modules.map((module, index) => {
              const title = module.titre || module.title || 'Formation continue';
              const duration = module.volumeHoraire || module.duration || module.tarifEntreprise || 'Duree a preciser';
              const audience = module.typePublic || module.audience || module.domaine || '';
              const skills = module.skills || [module.description, module.statut].filter(Boolean);

              return (
              <article key={module.id || `${title}-${index}`} className="rounded-3xl border p-6 shadow-sm" style={cardStyle}>
                <h3 className="text-lg font-black">{title}</h3>
                <p className="text-xs font-bold uppercase tracking-wide text-green-500 mt-2">{duration}</p>
                <p className="text-sm opacity-65 mt-4">{audience}</p>
                <ul className="mt-5 space-y-2">
                  {skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-xs opacity-75">
                      <CheckCircle size={14} className="text-green-500 shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            );
            })}
          </div>
        </div>

        <div className="rounded-3xl border p-6 md:p-8" style={cardStyle}>
          <div className="flex items-center gap-3 mb-5">
            <Users size={22} className="text-green-500" />
            <h2 className="text-xl font-black">Pour entreprises et particuliers</h2>
          </div>
          <p className="text-sm opacity-75 leading-relaxed max-w-4xl">
            Les modules peuvent etre organises en groupe, en intra-entreprise ou en session ouverte. E-TEC peut adapter le contenu, la duree et les exercices selon le niveau des participants.
          </p>
        </div>
      </section>
    </div>
  );
}
