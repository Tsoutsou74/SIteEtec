import React from 'react';
import { CheckCircle, FileText, Laptop, MonitorPlay, Video, Wifi } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const courses = [
  {
    title: 'Developpement web',
    content: 'HTML, CSS, JavaScript, React, API et bonnes pratiques de projet.',
    stats: ['12 chapitres', '45 videos', 'Projets pratiques'],
  },
  {
    title: 'Gestion et finance',
    content: 'Bases de comptabilite, analyse financiere, budget et outils de suivi.',
    stats: ['8 chapitres', '28 videos', 'Cas pratiques'],
  },
  {
    title: 'BTP et dessin technique',
    content: 'Lecture de plans, AutoCAD, metrees et suivi numerique de chantier.',
    stats: ['10 chapitres', '30 videos', 'Supports PDF'],
  },
];

export default function FormationsEnLignePage() {
  const { darkMode } = useTheme();
  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.34)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 pt-28 md:pt-32 pb-16 animate-fade-in">
      <section className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase" style={{ color: 'var(--primary)' }}>
              <Laptop size={16} /> Formations en ligne
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Apprendre a distance avec une plateforme claire et encadree
            </h1>
            <p className="text-sm md:text-base opacity-70 leading-relaxed">
              Les formations en ligne permettent aux etudiants et professionnels de suivre des cours, videos, supports PDF et exercices depuis n importe ou.
            </p>
          </div>
          <div className="lg:col-span-5 rounded-3xl border p-6 shadow-sm" style={cardStyle}>
            <div className="aspect-video rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <MonitorPlay size={58} className="text-green-500" />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              {[
                [Video, 'Videos'],
                [FileText, 'Supports'],
                [Wifi, 'Acces 24/7'],
              ].map(([Icon, label]) => {
                const DisplayIcon = Icon as React.ElementType;
                return (
                  <div key={label as string} className="rounded-2xl border p-3" style={{ borderColor: 'var(--border)' }}>
                    <DisplayIcon size={18} className="mx-auto text-green-500" />
                    <div className="text-[10px] font-bold uppercase tracking-wide opacity-60 mt-2">{label as string}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {courses.map((course) => (
            <article key={course.title} className="rounded-3xl border p-6" style={cardStyle}>
              <h2 className="text-lg font-black">{course.title}</h2>
              <p className="text-sm opacity-70 leading-relaxed mt-3">{course.content}</p>
              <ul className="mt-5 space-y-2">
                {course.stats.map((stat) => (
                  <li key={stat} className="flex items-center gap-2 text-xs opacity-75">
                    <CheckCircle size={14} className="text-green-500 shrink-0" />
                    {stat}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="rounded-3xl border p-6 md:p-8" style={cardStyle}>
          <h2 className="text-xl font-black mb-3">Fonctionnement</h2>
          <p className="text-sm opacity-75 leading-relaxed max-w-4xl">
            Chaque apprenant dispose d un acces a la plateforme, suit les cours selon son rythme, remet ses travaux en ligne et peut echanger avec les enseignants selon les modalites du module.
          </p>
        </div>
      </section>
    </div>
  );
}
