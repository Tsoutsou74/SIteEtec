import { useTheme } from '../context/ThemeContext';
import { Info, Target, Eye } from 'lucide-react';
import { useT } from '../config/I18nProvider';

interface AboutPageProps {
  compact?: boolean;
}

export default function AboutPage({ compact = false }: AboutPageProps) {
  const { darkMode } = useTheme();
  const { t } = useT();

  const glassStyle = {
    backgroundColor: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.55)',
    borderColor: 'var(--border)',
  };

  return (
    <div
      className={`animate-fade-in w-full px-4 sm:px-6 md:px-8 xl:px-16 ${
        compact ? 'space-y-8 pb-10 pt-10 md:space-y-10 md:pb-12 md:pt-12' : 'space-y-12 pb-12 pt-24 md:space-y-16 md:pb-16 md:pt-28'
      }`}
    >
      <div className="grid w-full grid-cols-1 items-stretch gap-8 lg:grid-cols-10 lg:gap-12">
        <div className={`relative lg:col-span-6 ${compact ? 'space-y-5' : 'space-y-7'}`}>
          <div className="absolute -left-4 top-0 hidden h-24 w-1 rounded-full bg-gradient-to-b from-green-500 to-transparent lg:block" />
          <div className={compact ? 'space-y-2.5 md:space-y-3' : 'space-y-3 md:space-y-4'}>
            <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: 'var(--primary)' }}>
              <Info size={12} /> {t('about', 'whoWeAre')}
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight opacity-70 md:text-2xl">{t('about', 'sectionLabel')}</h3>
            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl md:text-6xl">
              {t('about', 'title1')} <br className="hidden sm:block" />
              <span className="text-gradient">{t('about', 'title2')}</span>
            </h1>
            <p className={`max-w-2xl text-sm leading-8 opacity-75 md:text-base ${compact ? 'pt-0.5' : 'pt-2'}`}>
              {t('about', 'desc')}
            </p>
          </div>

        </div>

        <div className="grid gap-4 lg:col-span-4">
          <div className="relative flex min-h-44 flex-col justify-center overflow-hidden rounded-[2rem] border p-6 shadow-xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 md:p-8" style={glassStyle}>
            <div className="absolute -top-10 left-4 h-24 w-24 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: 'var(--primary)' }} />
            <div className="relative z-10 mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500"><Target size={20} /></div>
            <h2 className="relative z-10 text-base font-black uppercase tracking-[0.16em] text-gradient">{t('about', 'missionTitle')}</h2>
            <p className="relative z-10 mt-3 text-sm leading-6 opacity-70">{t('about', 'missionDesc')}</p>
          </div>
          <div className="relative flex min-h-44 flex-col justify-center overflow-hidden rounded-[2rem] border p-6 shadow-xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 md:p-8" style={glassStyle}>
            <div className="absolute -right-10 -bottom-10 h-24 w-24 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: '#3b82f6' }} />
            <div className="relative z-10 mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500"><Eye size={20} /></div>
            <h2 className="relative z-10 text-base font-black uppercase tracking-[0.16em] text-gradient">{t('about', 'visionTitle')}</h2>
            <p className="relative z-10 mt-3 text-sm leading-6 opacity-70">{t('about', 'visionDesc')}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
