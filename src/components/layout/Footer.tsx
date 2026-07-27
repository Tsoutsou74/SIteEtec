import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone, PlaySquare, Send, Share2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useT } from '../../config/I18nProvider';

const footerSections = [
  {
    titleKey: 'universityTitle' as const,
    links: [
      { labelKey: 'history' as const, path: '/historiques' },
      // { labelKey: 'organigram' as const, path: '/organigrammes' },
      { labelKey: 'news' as const, path: '/actualites' },
    ],
  },
  {
    titleKey: 'trainingTitle' as const,
    links: [
      { labelKey: 'training' as const, path: '/formations' },
    ],
  },
  {
    titleKey: 'quickLinksTitle' as const,
    links: [
      { labelKey: 'admission' as const, path: '/admission' },
      { labelKey: 'contact' as const, path: '/contact' },
      { labelKey: 'login' as const, path: '/log_in' },
      // { labelKey: 'application' as const, path: '/Inscriptions' },
    ],
  },
] as const;

const socialLinks = [
  { labelKey: 'facebook' as const, icon: MessageCircle, href: 'https://facebook.com' },
  { labelKey: 'linkedin' as const, icon: Share2, href: 'https://linkedin.com' },
  { labelKey: 'youtube' as const, icon: PlaySquare, href: 'https://youtube.com' },
] as const;

export default function Footer() {
  const { darkMode } = useTheme();
  const { t } = useT();

  const panelStyle = {
    backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    borderColor: 'var(--border)',
  };

  return (
    <footer
      className="mt-auto border-t transition-colors"
      style={{ backgroundColor: 'transparent', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_2fr_1.1fr]">
          <div className="space-y-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <span
                className="flex h-11 w-20 items-center justify-center rounded-xl border text-sm font-black"
                style={{
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,128,0,0.08)',
                  borderColor: darkMode ? 'rgba(255,255,255,0.16)' : 'rgba(0,128,0,0.25)',
                  color: darkMode ? 'inherit' : '#16a34a',
                }}
              >
                E-TEC
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-green-500">E-TEC University</p>
                <p className="text-[11px] font-semibold uppercase tracking-widest opacity-55">Faravohitra</p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed opacity-70">
              {t('footer', 'description')}
            </p>

            <div className="space-y-3 text-xs opacity-80">
              <p className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-green-500" />
                <span>{t('footer', 'location')}</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={15} className="shrink-0 text-green-500" />
                <span>{t('topbar', 'phone')}</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail size={15} className="shrink-0 text-green-500" />
                <span>{t('topbar', 'email')}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.titleKey}>
                <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-green-500">
                  {t('footer', section.titleKey)}
                </h2>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="opacity-70 transition hover:opacity-100 hover:text-green-500">
                        {t('navbar', link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border p-5" style={panelStyle}>
              <h2 className="text-sm font-black uppercase tracking-wider">{t('footer', 'newsletterTitle')}</h2>
              <p className="mt-2 text-xs leading-relaxed opacity-65">
                {t('footer', 'newsletterDesc')}
              </p>
              <form className="mt-4 flex overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                <input
                  type="email"
                  placeholder={t('footer', 'emailPlaceholder')}
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs outline-none"
                  style={{ color: 'var(--text)' }}
                />
                <button
                  type="submit"
                  className="flex w-11 items-center justify-center text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary)' }}
                  aria-label={t('footer', 'send')}
                >
                  <Send size={15} />
                </button>
              </form>
            </div>

            <div>
              <h2 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-green-500">{t('contact', 'socialTitle')}</h2>
              <div className="flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.labelKey}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t('footer', social.labelKey)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:border-green-500 hover:text-green-500"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs opacity-65 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: 'var(--border)' }}
        >
          <p>
            Copyright 2026 E-TEC University. {t('footer', 'rights')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="transition hover:text-green-500">{t('footer', 'support')}</Link>
            <Link to="/admission" className="transition hover:text-green-500">{t('footer', 'application')}</Link>
            <Link to="/actualites" className="transition hover:text-green-500">{t('footer', 'communiques')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
