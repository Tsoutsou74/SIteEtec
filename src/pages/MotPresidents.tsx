import React from 'react';
import { Award, Calendar, ChevronRight, GraduationCap, Quote, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../config/I18nProvider';

const VALUES = [
  { icon: GraduationCap, labelKey: 'values1' as const },
  { icon: Award, labelKey: 'values2' as const },
  { icon: Sparkles, labelKey: 'values3' as const },
];

const STATIC_MESSAGE = {
  authorName: 'Pr. Andrianaivoravelona',
  authorTitle: 'Président fondateur',
  quote: "Bâtir ensemble l'avenir technologique et professionnel de Madagascar.",
  content:
    "Chers étudiants, chers parents, chers partenaires,\n\nBienvenue à E-TEC University. Notre ambition est simple : offrir une formation supérieure utile, exigeante et directement reliée aux réalités du monde professionnel.\n\nLes métiers évoluent rapidement. Le numérique, la gestion, les réseaux, le bâtiment et les technologies industrielles demandent des profils capables d'apprendre, de pratiquer et de s'adapter. C'est dans cet esprit que nous construisons nos programmes.\n\nÀ E-TEC, nous croyons à la discipline, au travail concret, à l'accompagnement des étudiants et à la responsabilité. Notre mission est de former des jeunes compétents, confiants et prêts à contribuer au développement de Madagascar.\n\nJe vous invite à découvrir nos formations, notre histoire et notre organisation. Votre parcours commence par une décision, et nous sommes prêts à vous accompagner.",
  imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=520',
};

export default function MotPresidents() {
  const { darkMode } = useTheme();
  const { t } = useT();

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.72)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="animate-fade-in w-full px-4 pb-12 pt-24 sm:px-6 md:pb-16 md:pt-28 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-10">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-500">
            <Quote size={15} /> {t('president', 'sectionLabel')}
          </span>
          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {t('president', 'title1')} <span className="text-gradient">{t('president', 'title2')}</span>
          </h1>
          <p className="text-sm leading-relaxed opacity-70 md:text-base">
            {t('president', 'desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <aside className="rounded-3xl border p-6 text-center shadow-sm lg:col-span-4 md:p-7" style={cardStyle}>
            <div className="relative mx-auto mb-5 h-52 w-40 overflow-hidden rounded-3xl border shadow-md" style={{ borderColor: 'var(--border)' }}>
              <img src={STATIC_MESSAGE.imageUrl} alt={STATIC_MESSAGE.authorName} className="h-full w-full object-cover" />
            </div>

            <h2 className="text-lg font-black tracking-tight">{STATIC_MESSAGE.authorName}</h2>
            <p className="mt-1 text-xs font-black uppercase tracking-wider text-blue-500">{STATIC_MESSAGE.authorTitle}</p>
            <p className="mt-1 text-[11px] opacity-50">E-TEC University - Faravohitra</p>

            <div className="mt-6 space-y-3 border-t pt-5 text-left" style={{ borderColor: 'var(--border)' }}>
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.labelKey} className="flex items-center gap-3 text-xs font-semibold opacity-80">
                    <Icon size={16} className="shrink-0 text-blue-500" />
                    <span>{t('president', value.labelKey)}</span>
                  </div>
                );
              })}
              <div className="flex items-center gap-3 text-xs font-semibold opacity-80">
                <Calendar size={16} className="shrink-0 text-green-500" />
                <span>{t('president', 'date')}</span>
              </div>
            </div>
          </aside>

          <article className="relative overflow-hidden rounded-3xl border p-6 shadow-sm lg:col-span-8 md:p-8" style={cardStyle}>
            <Quote size={90} className="absolute -top-2 right-5 opacity-[0.04]" />
            <div className="relative space-y-5">
              <h2 className="text-xl font-black tracking-tight text-blue-500 md:text-2xl">
                {STATIC_MESSAGE.quote}
              </h2>

              <div className="space-y-4 text-justify text-sm leading-relaxed opacity-80">
                {STATIC_MESSAGE.content.split('\n').filter(Boolean).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs opacity-55">{t('president', 'place')}</div>
                <a href="/admission" className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:opacity-90" style={{ backgroundColor: 'var(--primary)' }}>
                  {t('president', 'cta')}
                  <ChevronRight size={15} />
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
