import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone, PlaySquare, Send, Share2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const footerSections = [
  {
    title: 'Universite',
    links: [
      { label: 'Historique', path: '/historiques' },
      { label: 'Mot du President', path: '/motduPresidents' },
      { label: 'Organigramme', path: '/organigrammes' },
      { label: 'Actualites', path: '/actualites' },
    ],
  },
  {
    title: 'Formations',
    links: [
      { label: 'Formation initiale', path: '/formationInitiale' },
      { label: 'Formation continue', path: '/formationContinue' },
      { label: 'Formations en ligne', path: '/formationsEnligne' },
      { label: 'Toutes les filieres', path: '/formations' },
    ],
  },
  {
    title: 'Acces rapides',
    links: [
      { label: 'Admissions', path: '/admission' },
      { label: 'Contact', path: '/contact' },
      { label: 'Connexion', path: '/log_in' },
      { label: 'Inscription etudiant', path: '/Inscriptions' },
    ],
  },
];

const socialLinks = [
  { label: 'Facebook', icon: MessageCircle, href: 'https://facebook.com' },
  { label: 'LinkedIn', icon: Share2, href: 'https://linkedin.com' },
  { label: 'YouTube', icon: PlaySquare, href: 'https://youtube.com' },
];

export default function Footer() {
  const { darkMode } = useTheme();

  const panelStyle = {
    backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    borderColor: 'var(--border)',
  };

  return (
    <footer
      className="mt-auto border-t transition-colors"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
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
              Etablissement d enseignement superieur oriente vers les competences professionnelles,
              l innovation technologique et l accompagnement des etudiants a Madagascar.
            </p>

            <div className="space-y-3 text-xs opacity-80">
              <p className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-green-500" />
                <span>Faravohitra, Antananarivo, Madagascar</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={15} className="shrink-0 text-green-500" />
                <span>+261 34 00 123 45</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail size={15} className="shrink-0 text-green-500" />
                <span>contact@etec.mg</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-green-500">
                  {section.title}
                </h2>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="opacity-70 transition hover:opacity-100 hover:text-green-500">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border p-5" style={panelStyle}>
              <h2 className="text-sm font-black uppercase tracking-wider">Newsletter</h2>
              <p className="mt-2 text-xs leading-relaxed opacity-65">
                Recevez les actualites, les admissions et les annonces de formations.
              </p>
              <form className="mt-4 flex overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs outline-none"
                  style={{ color: 'var(--text)' }}
                />
                <button
                  type="submit"
                  className="flex w-11 items-center justify-center text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary)' }}
                  aria-label="Envoyer"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>

            <div>
              <h2 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-green-500">Reseaux</h2>
              <div className="flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
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
          <p>Copyright 2026 E-TEC University. Tous droits reserves.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="transition hover:text-green-500">Support</Link>
            <Link to="/admission" className="transition hover:text-green-500">Candidature</Link>
            <Link to="/actualites" className="transition hover:text-green-500">Communiques</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
