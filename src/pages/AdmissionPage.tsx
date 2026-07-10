import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ClipboardCheck, User, Mail, Phone, BookOpen, Send, CheckCircle } from 'lucide-react';
import ApiService from '../services/ApiService';
import { useT } from '../config/I18nProvider';

interface FiliereApi {
  id?: number;
  code?: string;
  nom?: string;
  responsable?: string;
}

export default function AdmissionPage() {
  const { darkMode } = useTheme();
  const { t } = useT();
  const [submitted, setSubmitted] = useState(false);
  const [filiers, setFiliers] = useState<FiliereApi[]>([]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    filiere: 'Administration et Gestion',
  });

  useEffect(() => {
    let isMounted = true;

    const loadFiliers = async () => {
      try {
        const response = await ApiService.filieres.getAll();
        const data = response.data;

        if (isMounted && Array.isArray(data) && data.length > 0) {
          setFiliers(data);
          setFormData((current) => ({ ...current, filiere: data[0].nom || current.filiere }));
        }
      } catch {
        if (isMounted) {
          setFiliers([]);
        }
      }
    };

    loadFiliers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const ETAPES = [
    { num: '01', title: t('admission', 'step1Title'), desc: t('admission', 'step1Desc') },
    { num: '02', title: t('admission', 'step2Title'), desc: t('admission', 'step2Desc') },
    { num: '03', title: t('admission', 'step3Title'), desc: t('admission', 'step3Desc') },
    { num: '04', title: t('admission', 'step4Title'), desc: t('admission', 'step4Desc') },
  ];

  const inputStyle = {
    backgroundColor: 'var(--bg)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  const fallbackOptions = [
    t('admission', 'optionFallback1'),
    t('admission', 'optionFallback2'),
    t('admission', 'optionFallback3'),
    t('admission', 'optionFallback4'),
  ];

  return (
    <div className="animate-fade-in w-full px-0 py-10 sm:px-4 md:px-8 md:py-16 lg:px-12">
      <div className="mb-10 max-w-2xl space-y-3 px-1 md:mb-16 md:space-y-4">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
          <ClipboardCheck size={14} /> {t('admission', 'sectionLabel')}
        </span>
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {t('admission', 'title1')} <span className="text-gradient">{t('admission', 'title2')}</span>
        </h1>
        <p className="text-sm leading-relaxed opacity-70">{t('admission', 'desc')}</p>
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

        <div className="lg:col-span-7">
          <div
            className="rounded-3xl border p-5 shadow-lg backdrop-blur-md transition-all duration-300 md:p-8"
            style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            {submitted ? (
              <div className="animate-scale-up space-y-4 py-10 text-center md:py-12">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-500 md:h-16 md:w-16">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-xl font-black tracking-tight md:text-2xl">{t('admission', 'successTitle')}</h3>
                <p className="mx-auto max-w-sm text-xs leading-relaxed opacity-75">
                  {t('admission', 'successDesc', { prenom: formData.prenom || '' })}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 cursor-pointer text-xs font-bold uppercase tracking-wider underline hover:opacity-80"
                >
                  {t('admission', 'newRequest')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <h2 className="mb-1 text-lg font-black tracking-tight md:text-xl">{t('admission', 'formTitle')}</h2>
                  <p className="text-xs opacity-60">{t('admission', 'formDesc')}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      <User size={10} /> {t('admission', 'labelNom')}
                    </label>
                    <input
                      type="text"
                      required
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder={t('admission', 'placeholderNom')}
                      className="w-full rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      <User size={10} /> {t('admission', 'labelPrenom')}
                    </label>
                    <input
                      type="text"
                      required
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder={t('admission', 'placeholderPrenom')}
                      className="w-full rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                    <Mail size={10} /> {t('admission', 'labelEmail')}
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('admission', 'placeholderEmail')}
                    className="w-full rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                    style={inputStyle}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      <Phone size={10} /> {t('admission', 'labelPhone')}
                    </label>
                    <input
                      type="tel"
                      required
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder={t('admission', 'placeholderPhone')}
                      className="w-full rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      <BookOpen size={10} /> {t('admission', 'labelFiliere')}
                    </label>
                    <select
                      name="filiere"
                      value={formData.filiere}
                      onChange={handleChange}
                      className="w-full cursor-pointer appearance-none rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                      style={inputStyle}
                    >
                      {filiers.length > 0 ? (
                        filiers.map((filiere) => (
                          <option key={filiere.id || filiere.code || filiere.nom} value={filiere.nom || ''}>
                            {filiere.nom}
                          </option>
                        ))
                      ) : (
                        fallbackOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-95"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {t('admission', 'submit')} <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
