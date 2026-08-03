import React from 'react';
import { ArrowUpRight, Calendar, MapPin, ShieldCheck, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../config/I18nProvider';

const HISTORIQUE_TEXT = [
  "Historique L’E-TEC est un établissement d’enseignement polytechnique privé, fondé en octobre 2001 par feu Monsieur RANDRIANARIVELO Maminirina Hobivaomalala Daniel.",
  "Créé dans le but de contribuer au développement de l’enseignement supérieur et de la formation professionnelle, l’établissement a initialement été implanté à Andavamamba en 2002, avant de transférer son siège à Faravohitra (Lot A126 bis Faravohitra, Antananarivo Madagascar) le 17 octobre 2005, où il est actuellement établi.",
  "Au fil des années, l’E-TEC a évolué sous différentes directions. Aujourd’hui, l’établissement est dirigé par Monsieur RAVELSON Claude Cesaire, Directeur.",
  "Les formations dispensées par l’E-TEC sont habilitées par le Ministère de l’Enseignement Supérieur et de la Recherche Scientifique (MESuRePS) et bénéficient d’équivalences administratives conformément aux dispositions en vigueur.",
];

const HIGHLIGHTS = [
  { labelKey: 'highlight1' as const, value: '10+' },
  { labelKey: 'highlight2' as const, value: '4' },
  { labelKey: 'highlight3' as const, value: '100%' },
];

export default function Historique() {
  const { darkMode } = useTheme();
  const { t } = useT();

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.78)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="animate-fade-in w-full px-4 pb-12 pt-28 sm:px-6 md:px-8 md:pb-16 md:pt-32 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-8 md:space-y-10">
        <div
          className="relative overflow-hidden rounded-[2rem] border p-6 shadow-sm md:p-10"
          style={{
            backgroundColor: darkMode ? '#0b2118' : '#e9f7ef',
            borderColor: darkMode ? '#17452e' : '#bce6c9',
          }}
        >
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[34px] border-green-500/10" />
          <div className="pointer-events-none absolute -bottom-28 right-24 h-48 w-48 rounded-full bg-green-500/10 blur-3xl" />
          <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_360px]">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-green-500">
                <Calendar size={14} /> {t('historique', 'sectionLabel')}
              </span>
              <h1 className="mt-4 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl md:text-6xl">
                L'histoire de <span className="text-green-500">E-TEC</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 opacity-75 md:text-base">{t('historique', 'desc')}</p>
              <div
                className="mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold"
                style={{ borderColor: darkMode ? '#286a47' : '#a9dbb8' }}
              >
                <MapPin size={14} className="text-green-500" /> Faravohitra · Tana 101
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.labelKey}
                  className="min-w-0 rounded-2xl border p-3 text-center backdrop-blur-sm md:p-4"
                  style={{
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.68)',
                    borderColor: darkMode ? '#286a47' : '#c6e7cf',
                  }}
                >
                  <div className="text-xl font-black text-green-500 md:text-2xl">{item.value}</div>
                  <div className="mt-1 break-words text-[9px] font-bold uppercase leading-3 tracking-wide opacity-65">
                    {t('historique', item.labelKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[220px_1fr] lg:gap-10">
          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-green-500">
              <ShieldCheck size={16} /> Repères officiels
            </div>
            <div className="h-px w-16 bg-green-500" />
            <p className="text-sm leading-6 opacity-60">
              Une histoire bâtie sur la formation professionnelle, la reconnaissance académique et l'ancrage dans la capitale.
            </p>
            <div className="hidden rounded-2xl border p-4 lg:block" style={cardStyle}>
              <div className="text-3xl font-black text-green-500">2001</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-widest opacity-55">Année de création</div>
            </div>
          </aside>

          <article className="relative overflow-hidden rounded-[2rem] border p-6 shadow-sm md:p-10" style={cardStyle}>
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-green-500" />
            <div className="mb-8 flex items-start justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Notre fondation</span>
                <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Une institution reconnue</h2>
              </div>
              <ArrowUpRight className="shrink-0 text-green-500" size={24} />
            </div>
            <div className="max-w-3xl space-y-6 text-sm leading-8 opacity-80 md:text-base">
              {HISTORIQUE_TEXT.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>

        <div
          className="flex flex-col gap-5 rounded-[2rem] border p-6 md:flex-row md:items-center md:justify-between md:p-8"
          style={cardStyle}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-black text-green-500">
              <Users size={18} /> {t('historique', 'communityTitle')}
            </div>
            <p className="max-w-2xl text-sm leading-6 opacity-70">{t('historique', 'communityDesc')}</p>
          </div>
          <a
            href="/admission"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-green-700"
          >
            <span>{t('historique', 'cta')}</span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}
