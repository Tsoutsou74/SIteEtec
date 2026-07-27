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
      <div className={`grid w-full grid-cols-1 items-stretch gap-6 md:gap-8 ${compact ? 'lg:grid-cols-10' : 'lg:grid-cols-10'}`}>
        <div className={`lg:col-span-7 lg:flex lg:flex-col lg:justify-between ${compact ? 'space-y-5 lg:space-y-6' : 'space-y-6 lg:space-y-8'}`}>
          <div className={compact ? 'space-y-2.5 md:space-y-3' : 'space-y-3 md:space-y-4'}>
            <h3 className="text-xl font-black tracking-tight md:text-2xl">{t('about', 'sectionLabel')}</h3>
            <span className="flex items-center gap-2 text-xs uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
              <Info size={12} /> {t('about', 'whoWeAre')}
            </span>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {t('about', 'title1')} <br className="hidden sm:block" />
              <span className="text-gradient">{t('about', 'title2')}</span>
            </h1>
            <p className={`text-sm leading-relaxed opacity-75 ${compact ? 'pt-0.5 md:pt-1' : 'pt-1 md:pt-2'}`}>
              {t('about', 'desc')}
            </p>
          </div>

        </div>

        <div className={`grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-1 ${compact ? 'md:gap-5' : ''}`}>
          <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border text-center shadow-xl backdrop-blur-md ${compact ? 'p-4 md:p-5' : 'p-4 md:p-6'}`} style={glassStyle}>
            <div className="absolute -top-10 left-4 h-24 w-24 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: 'var(--primary)' }} />
            <div className="z-10 mb-2 rounded-xl bg-amber-500/10 p-2.5 text-amber-500">
              <Target size={20} />
            </div>
            <h2 className="z-10 text-sm font-black uppercase tracking-widest text-gradient md:text-base">{t('about', 'missionTitle')}</h2>
            <div className="z-10 my-2 w-16 border-t md:w-20" style={{ borderColor: 'var(--border)' }} />
            <p className="z-10 text-xs leading-relaxed opacity-70">{t('about', 'missionDesc')}</p>
          </div>

          <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border text-center shadow-xl backdrop-blur-md ${compact ? 'p-4 md:p-5' : 'p-4 md:p-6'}`} style={glassStyle}>
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

    </div>
  );
}
