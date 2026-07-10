import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Info, Target, Eye, Heart, Award, ShieldCheck } from 'lucide-react';
import ApiService from '../services/ApiService';
import { useT } from '../config/I18nProvider';

interface ValeurCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function ValeurCard({ icon, title, desc }: ValeurCardProps) {
  const { darkMode } = useTheme();
  return (
    <div
      className="rounded-2xl border p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md md:p-6"
      style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.45)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(255,191,0,0.1)', color: 'var(--primary)' }}>
        {icon}
      </div>
      <h3 className="mb-1.5 text-sm font-bold tracking-tight">{title}</h3>
      <p className="text-xs leading-relaxed opacity-70">{desc}</p>
    </div>
  );
}

interface AboutCounts {
  actualites: number;
  organigramme: number;
  historiques: number;
  mots: number;
}

const FALLBACK_COUNTS: AboutCounts = {
  actualites: 0,
  organigramme: 0,
  historiques: 0,
  mots: 0,
};

export default function AboutPage() {
  const { darkMode } = useTheme();
  const { t } = useT();
  const [counts, setCounts] = useState<AboutCounts>(FALLBACK_COUNTS);

  useEffect(() => {
    let isMounted = true;

    const loadCounts = async () => {
      try {
        const [actualitesRes, organigrammesRes, historiquesRes, motsRes] = await Promise.all([
          ApiService.actualites.getAll(),
          ApiService.organigrammes.getAll(),
          ApiService.historiques.getAll(),
          ApiService.mots.getAll(),
        ]);

        if (!isMounted) return;

        setCounts({
          actualites: Array.isArray(actualitesRes.data) ? actualitesRes.data.length : 0,
          organigramme: Array.isArray(organigrammesRes.data) ? organigrammesRes.data.length : 0,
          historiques: Array.isArray(historiquesRes.data) ? historiquesRes.data.length : 0,
          mots: Array.isArray(motsRes.data) ? motsRes.data.length : 0,
        });
      } catch {
        if (isMounted) {
          setCounts(FALLBACK_COUNTS);
        }
      }
    };

    loadCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const glassStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.55)',
    borderColor: 'var(--border)',
  };

  return (
    <div className="animate-fade-in w-full space-y-14 px-0 py-10 sm:px-4 md:space-y-20 md:px-8 md:py-16 xl:px-16">
      <div className="grid w-full grid-cols-1 items-stretch gap-6 md:gap-8 lg:grid-cols-10">
        <div className="space-y-6 lg:col-span-7 lg:flex lg:flex-col lg:justify-between lg:space-y-8">
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-xl font-black tracking-tight md:text-2xl">{t('about', 'sectionLabel')}</h3>
            <span className="flex items-center gap-2 text-xs uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
              <Info size={12} /> {t('about', 'whoWeAre')}
            </span>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t('about', 'title1')} <br className="hidden sm:block" />
              <span className="text-gradient">{t('about', 'title2')}</span>
            </h1>
            <p className="pt-1 text-sm leading-relaxed opacity-75 md:pt-2">
              {t('about', 'desc')}
            </p>
          </div>

          <div className="relative space-y-4 overflow-hidden rounded-3xl border p-5 text-center shadow-xl backdrop-blur-md md:p-6" style={glassStyle}>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: 'var(--primary)' }} />
            <span className="block text-3xl font-black md:text-4xl" style={{ color: 'var(--primary)' }}>E-TEC</span>
            <span className="-mt-2 block text-xs font-black uppercase tracking-widest opacity-80">{t('about', 'keyFigures')}</span>
            <div className="grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="text-xl font-black text-amber-500 md:text-2xl">{counts.actualites}</div>
                <div className="text-[10px] font-bold uppercase opacity-50">{t('about', 'articles')}</div>
              </div>
              <div>
                <div className="text-xl font-black text-blue-500 md:text-2xl">{counts.organigramme + counts.historiques + counts.mots}</div>
                <div className="text-[10px] font-bold uppercase opacity-50">{t('about', 'structures')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-1">
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border p-4 text-center shadow-xl backdrop-blur-md md:p-6" style={glassStyle}>
            <div className="absolute -top-10 left-4 h-24 w-24 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: 'var(--primary)' }} />
            <div className="z-10 mb-2 rounded-xl bg-amber-500/10 p-2.5 text-amber-500">
              <Target size={20} />
            </div>
            <h2 className="z-10 text-sm font-black uppercase tracking-widest text-gradient md:text-base">{t('about', 'missionTitle')}</h2>
            <div className="z-10 my-2 w-16 border-t md:w-20" style={{ borderColor: 'var(--border)' }} />
            <p className="z-10 text-xs leading-relaxed opacity-70">{t('about', 'missionDesc')}</p>
          </div>

          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border p-4 text-center shadow-xl backdrop-blur-md md:p-6" style={glassStyle}>
            <div className="absolute -right-10 -bottom-10 h-24 w-24 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: '#3b82f6' }} />
            <div className="z-10 mb-2 rounded-xl bg-blue-500/10 p-2.5 text-blue-500">
              <Eye size={20} />
            </div>
            <h2 className="z-10 text-sm font-black uppercase tracking-widest text-gradient md:text-base">{t('about', 'visionTitle')}</h2>
            <div className="z-10 my-2 w-16 border-t md:w-20" style={{ borderColor: 'var(--border)' }} />
            <p className="z-10 text-xs leading-relaxed opacity-70">{t('about', 'visionDesc')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-2 md:space-y-8 md:pt-4">
        <div className="mx-auto max-w-xl space-y-2 px-4 text-center">
          <h2 className="text-xl font-black tracking-tight md:text-2xl">{t('about', 'valuesTitle')}</h2>
          <p className="text-xs opacity-60">{t('about', 'valuesDesc')}</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          <ValeurCard icon={<Award size={18} />} title={t('about', 'excellenceTitle')} desc={t('about', 'excellenceDesc')} />
          <ValeurCard icon={<ShieldCheck size={18} />} title={t('about', 'integrityTitle')} desc={t('about', 'integrityDesc')} />
          <ValeurCard icon={<Heart size={18} />} title={t('about', 'commitmentTitle')} desc={t('about', 'commitmentDesc')} />
          <ValeurCard icon={<Target size={18} />} title={t('about', 'innovationTitle')} desc={t('about', 'innovationDesc')} />
        </div>
      </div>
    </div>
  );
}
