import React from 'react';
import { ClipboardCheck, User, FileText, MapPin } from 'lucide-react';
import { useT } from '../config/I18nProvider';

export default function AdmissionPage() {
  const { t } = useT();

  const ETAPES = [
    { num: '01', title: t('admission', 'step1Title'), desc: t('admission', 'step1Desc') },
    { num: '02', title: t('admission', 'step2Title'), desc: t('admission', 'step2Desc') },
    { num: '03', title: t('admission', 'step3Title'), desc: t('admission', 'step3Desc') },
    { num: '04', title: t('admission', 'step4Title'), desc: t('admission', 'step4Desc') },
  ];

  const PIECES = [
    { icon: FileText, title: t('admission', 'document1Title'), desc: t('admission', 'document1Desc') },
    { icon: MapPin, title: t('admission', 'document2Title'), desc: t('admission', 'document2Desc') },
    { icon: User, title: t('admission', 'document3Title'), desc: t('admission', 'document3Desc') },
    { icon: ClipboardCheck, title: t('admission', 'document4Title'), desc: t('admission', 'document4Desc') },
  ];

  return (
    <div className="animate-fade-in w-full px-4 pb-12 pt-28 sm:px-6 md:px-8 md:pb-16 md:pt-32 lg:px-12">
      <div className="relative mb-10 max-w-3xl space-y-4 md:mb-14">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
          <ClipboardCheck size={14} /> {t('admission', 'sectionLabel')}
        </span>
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {t('admission', 'title1')} <span className="text-gradient">{t('admission', 'title2')}</span>
        </h1>
        <p className="max-w-2xl text-sm leading-7 opacity-70 md:text-base">{t('admission', 'desc')}</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 md:gap-12 lg:grid-cols-12">
        <div className="space-y-6 md:space-y-8 lg:col-span-5">
          <h2 className="text-lg font-black tracking-tight md:text-xl">{t('admission', 'processTitle')}</h2>

          <div className="relative space-y-5 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-400/20 md:space-y-6">
            {ETAPES.map((etape) => (
              <div key={etape.num} className="relative flex gap-3 md:gap-4">
                <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  {etape.num}
                </div>
                <div className="space-y-1 pt-0.5">
                  <h3 className="text-sm font-bold tracking-tight">{etape.title}</h3>
                  <p className="text-xs leading-relaxed opacity-70">{etape.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border p-6 shadow-sm md:p-8 lg:col-span-7" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>{t('admission', 'documentsEyebrow')}</span>
              <h2 className="mt-2 text-2xl font-black tracking-tight">{t('admission', 'documentsTitle')}</h2>
              <p className="mt-2 text-sm leading-6 opacity-65">{t('admission', 'documentsDesc')}</p>
            </div>
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl md:flex" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)', color: 'var(--primary)' }}>
              <FileText size={21} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PIECES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border p-4 transition hover:-translate-y-1 hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--primary)', color: 'white' }}><Icon size={17} /></div>
                <h3 className="text-sm font-bold">{title}</h3>
                <p className="mt-1 text-xs leading-5 opacity-60">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t pt-4 text-xs leading-5 opacity-60" style={{ borderColor: 'var(--border)' }}>{t('admission', 'documentsNote')}</p>
        </div>

      </div>
    </div>
  );
}
