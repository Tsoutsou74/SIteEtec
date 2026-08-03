import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mail, User, Phone, MapPin, Share2, Info, Send, CheckCircle } from 'lucide-react';
import { useT } from '../config/I18nProvider';

export default function ContactPage() {
  const { darkMode } = useTheme();
  const { t } = useT();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputStyle = {
    backgroundColor: 'var(--bg)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  const cardStyle = {
    borderColor: 'var(--border)',
  };

  return (
    <div className="animate-fade-in w-full px-4 pb-12 pt-44 sm:px-6 md:px-8 md:pb-16 md:pt-52 lg:px-12">
      <div className="mb-10 max-w-2xl space-y-3 md:mb-16 md:space-y-4">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
          <Info size={14} /> {t('contact', 'sectionLabel')}
        </span>
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {t('contact', 'title1')} <span className="text-gradient">{t('contact', 'title2')}</span>
        </h1>
        <p className="text-sm leading-relaxed opacity-70">{t('contact', 'desc')}</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 md:gap-12 lg:grid-cols-12">
        <div className="space-y-5 md:space-y-6 lg:col-span-5">
          <h2 className="text-lg font-black tracking-tight md:text-xl">{t('contact', 'coordTitle')}</h2>

          <div className="relative h-52 w-full overflow-hidden rounded-2xl border shadow-sm sm:h-60 md:h-64" style={cardStyle}>
            <iframe
              title="E-TEC University - Faravohitra"
              src="https://maps.google.com/maps?q=-18.908989,47.529536&t=&z=18&ie=UTF8&iwloc=&output=embed"
              className={`h-full w-full border-0 opacity-90 ${darkMode ? 'invert-[0.9] hue-rotate-180' : ''}`}
              allowFullScreen={false}
              loading="lazy"
            />
            <div className="pointer-events-none absolute left-1/2 top-[42%] z-10 -translate-x-1/2 -translate-y-full">
              <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] shadow-lg backdrop-blur-md"
                   style={{
                     backgroundColor: darkMode ? 'rgba(0,0,0,0.78)' : 'rgba(255,255,255,0.92)',
                     borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                     color: 'var(--primary)',
                   }}>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[9px] text-white">E</span>
                <span>E-TEC UNIVERSITY</span>
              </div>
              <div className="mx-auto h-3 w-3 translate-y-[-1px] rotate-45 border-b border-r" style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.78)' : 'rgba(255,255,255,0.92)', borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1.5 rounded-xl border p-3 md:p-4" style={cardStyle}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider md:text-xs" style={{ color: 'var(--primary)' }}>
                <MapPin size={12} /> {t('contact', 'locationTitle')}
              </div>
              <p className="text-xs font-bold leading-snug">{t('contact', 'locationAddr')}</p>
              <p className="text-[10px] opacity-60">{t('contact', 'locationHours')}</p>
            </div>

            <div className="space-y-1.5 rounded-xl border p-3 md:p-4" style={cardStyle}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider md:text-xs" style={{ color: 'var(--primary)' }}>
                <Phone size={12} /> {t('contact', 'phoneTitle')}
              </div>
              <p className="text-xs font-bold tracking-wide">+261 33 11 669 79</p>
              <p className="text-[10px] opacity-60">{t('contact', 'phoneFormat')}</p>
            </div>

            <div className="space-y-1.5 rounded-xl border p-3 md:p-4" style={cardStyle}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider md:text-xs" style={{ color: 'var(--primary)' }}>
                <Mail size={12} /> {t('contact', 'emailTitle')}
              </div>
              <p className="text-xs font-medium break-all">etecpoli@gmail.com</p>
              <p className="text-xs font-medium break-all opacity-60">etecpoli@gmail.com</p>
            </div>

            <div className="space-y-1.5 rounded-xl border p-3 md:p-4" style={cardStyle}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider md:text-xs" style={{ color: 'var(--primary)' }}>
                <Share2 size={12} /> {t('contact', 'socialTitle')}
              </div>
              <div className="flex flex-col gap-1 text-xs font-medium">
                <a href="#" className="flex items-center gap-1 text-blue-500 hover:underline">Facebook</a>
                <a href="#" className="flex items-center gap-1 text-red-500 hover:underline">YouTube</a>
              </div>
            </div>
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
                <h3 className="text-xl font-black tracking-tight md:text-2xl">{t('contact', 'successTitle')}</h3>
                <p className="mx-auto max-w-sm text-xs leading-relaxed opacity-75">
                  {t('contact', 'successDesc', { prenom: formData.prenom || '' })}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 cursor-pointer text-xs font-bold uppercase tracking-wider underline hover:opacity-80"
                >
                  {t('contact', 'newMessage')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <h2 className="mb-1 text-lg font-black tracking-tight md:text-xl">{t('contact', 'formTitle')}</h2>
                  <p className="text-xs opacity-60">{t('contact', 'formDesc')}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      <User size={10} /> {t('contact', 'labelNom')}
                    </label>
                    <input
                      type="text"
                      required
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder={t('contact', 'labelNom')}
                      className="w-full rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      <User size={10} /> {t('contact', 'labelPrenom')}
                    </label>
                    <input
                      type="text"
                      required
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder={t('contact', 'labelPrenom')}
                      className="w-full rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      <Mail size={10} /> {t('contact', 'labelEmail')}
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="exemple@gmail.com"
                      className="w-full rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                      <Phone size={10} /> {t('contact', 'labelPhone')}
                    </label>
                    <input
                      type="text"
                      required
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+261 34 ..."
                      className="w-full rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                    <Mail size={10} /> {t('contact', 'labelSubject')}
                  </label>
                  <input
                    type="text"
                    required
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    placeholder={t('contact', 'placeholderSubject')}
                    className="w-full rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                    style={inputStyle}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
                    <Mail size={10} /> {t('contact', 'labelMessage')}
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact', 'placeholderMessage')}
                    className="w-full resize-none rounded-xl border p-3 text-xs transition-colors focus:outline-none"
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {loading ? t('contact', 'loading') : t('contact', 'submit')} <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
