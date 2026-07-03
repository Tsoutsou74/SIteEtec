import React from 'react';
import { BookOpenCheck, CalendarDays, CheckCircle, GraduationCap, Layers, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const parcours = [
  {
    title: 'Administration et Gestion',
    duration: 'Licence 3 ans / Master 5 ans',
    items: ['Management', 'Comptabilite et finance', 'Marketing', 'Ressources humaines'],
  },
  {
    title: 'Genie logiciel et reseaux',
    duration: 'Licence 3 ans / Master 5 ans',
    items: ['Developpement web et mobile', 'Administration systeme', 'Cloud et reseaux', 'Cybersecurite'],
  },
  {
    title: 'Batiment et Travaux Publics',
    duration: 'Licence professionnelle 3 ans',
    items: ['Dessin BTP', 'Topographie', 'Conduite de chantier', 'Structures et beton arme'],
  },
  {
    title: 'Electromecanique',
    duration: 'Licence professionnelle 3 ans',
    items: ['Automatisme', 'Maintenance industrielle', 'Electricite', 'Systemes mecaniques'],
  },
];

const steps = ['Depot du dossier', 'Etude du profil', 'Entretien d orientation', 'Inscription definitive'];

export default function FormationInitialePage() {
  const { darkMode } = useTheme();
  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.34)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 pt-28 md:pt-32 pb-16 animate-fade-in">
      <section className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase" style={{ color: 'var(--primary)' }}>
              <GraduationCap size={16} /> Formation initiale
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Des cursus complets pour construire votre avenir professionnel
            </h1>
            <p className="text-sm md:text-base opacity-70 leading-relaxed max-w-3xl">
              La formation initiale s adresse aux nouveaux bacheliers et aux etudiants qui souhaitent suivre un parcours academique complet, encadre et progressif.
            </p>
          </div>
          <div className="lg:col-span-4 grid grid-cols-3 gap-3">
            {[
              ['4', 'Filieres'],
              ['3-5', 'Annees'],
              ['100%', 'Presentiel'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border p-4 text-center" style={cardStyle}>
                <div className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{value}</div>
                <div className="text-[10px] font-bold uppercase tracking-wide opacity-60 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {parcours.map((item) => (
            <article key={item.title} className="rounded-3xl border p-6 shadow-sm" style={cardStyle}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-500/10 text-green-500 border border-green-500/20 shrink-0">
                  <BookOpenCheck size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">{item.title}</h2>
                  <p className="text-xs font-bold uppercase tracking-wide opacity-55 mt-1">{item.duration}</p>
                </div>
              </div>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.items.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-xs opacity-75">
                    <CheckCircle size={14} className="text-green-500 shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border p-6 md:p-8" style={cardStyle}>
            <div className="flex items-center gap-3 mb-5">
              <Layers size={20} className="text-green-500" />
              <h2 className="text-xl font-black">Organisation des etudes</h2>
            </div>
            <div className="space-y-4 text-sm opacity-75 leading-relaxed">
              <p>Les cours sont organises en semestres avec des modules theoriques, des travaux pratiques, des projets encadres et des evaluations continues.</p>
              <p>Chaque parcours combine competences techniques, culture professionnelle, communication, methodologie et preparation a l insertion professionnelle.</p>
            </div>
          </section>

          <section className="rounded-3xl border p-6 md:p-8" style={cardStyle}>
            <div className="flex items-center gap-3 mb-5">
              <CalendarDays size={20} className="text-green-500" />
              <h2 className="text-xl font-black">Admission</h2>
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-xl bg-green-600 text-white flex items-center justify-center text-xs font-black">{index + 1}</span>
                  <span className="font-semibold opacity-80">{step}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={cardStyle}>
          <div className="flex items-center gap-3">
            <Users size={22} className="text-green-500" />
            <div>
              <h2 className="font-black">Pret a commencer votre parcours ?</h2>
              <p className="text-sm opacity-65">Deposez votre demande d admission pour la prochaine rentree.</p>
            </div>
          </div>
          <a href="/admission" className="inline-flex justify-center rounded-xl bg-green-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white hover:bg-green-700 transition">
            Demander une admission
          </a>
        </div>
      </section>
    </div>
  );
}
