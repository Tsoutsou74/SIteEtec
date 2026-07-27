import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../context/ThemeContext';
import { Landmark, Code, HardHat, Cpu, ArrowRight, GraduationCap, X, CheckCircle, BookOpen, Clock, Quote } from 'lucide-react';
import { useT } from '../config/I18nProvider';

interface FilierDetail {
  code: string;
  nom: string;
  description: string;
  options: string[];
  duration: string;
  image: string;
  category: string;
  icon: React.ReactNode;
  objectifs: string[];
  debouches: string[];
  conditions: string[];
  semestres: string;
}

interface FilierCardProps {
  item: FilierDetail;
  detailsLabel: string;
  onDetails: (item: FilierDetail) => void;
}

function FilierCard({ item, detailsLabel, onDetails }: FilierCardProps) {
  const { darkMode } = useTheme();

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border shadow-md backdrop-blur-md"
      style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      {/* Image */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden bg-gray-500/10 sm:h-36 md:h-40">
        <img
          src={item.image}
          alt={item.nom}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=60';
          }}
        />
        <span className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: 'var(--primary)' }}>
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col justify-between p-3 md:p-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(255,191,0,0.1)', color: 'var(--primary)' }}>
              {item.icon}
            </div>
            <h3 className="text-sm font-black leading-snug tracking-tight md:text-base">
              {item.nom}
            </h3>
          </div>

          <p className="mb-2 text-xs leading-relaxed opacity-70">
            {item.description}
          </p>

        </div>

        <div className="flex items-center justify-between gap-2 border-t pt-2 mt-2" style={{ borderColor: 'var(--border)' }}>
          <span className="text-[10px] font-bold uppercase tracking-wide opacity-60 leading-tight">
            {item.duration}
          </span>
          <button
            onClick={() => onDetails(item)}
            className="flex shrink-0 cursor-pointer items-center gap-1 text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--primary)' }}
          >
            {detailsLabel} <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal de détails (CORRIGÉ AVEC UN Z-INDEX ET ESPACEMENT AU-DESSUS DE TOUT) ───
function FilierModal({ item, onClose }: { item: FilierDetail; onClose: () => void }) {
  const { darkMode } = useTheme();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    (
    <div
      className="fixed inset-x-0 bottom-0 top-[82px] z-[10000] flex items-end justify-center bg-black/45 p-3 sm:top-[103px] sm:items-center sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-full w-full max-w-xl flex-col overflow-hidden rounded-[28px] border shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
        style={{
          backgroundColor: darkMode ? '#0c0c0c' : '#ffffff',
          borderColor: 'var(--border)',
          color: 'var(--text)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="relative h-56 w-full overflow-hidden sm:h-60 md:h-64">
            <img
              src={item.image}
              alt={item.nom}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=60';
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.65) 100%)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white"
                  style={{ backgroundColor: 'rgba(11,122,59,0.92)' }}
                >
                  {item.category}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                  {item.duration}
                </span>
              </div>
              <h2 className="mt-3 max-w-2xl text-2xl font-black leading-[1.05] tracking-tight text-white sm:text-3xl md:text-4xl">
                {item.nom}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/40 sm:right-4 sm:top-4"
            aria-label="Fermer le dialogue"
          >
            <X size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7">
          <p className="max-w-3xl text-sm leading-relaxed opacity-80">{item.description}</p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <span
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold"
              style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
            >
              <Clock size={13} style={{ color: 'var(--primary)' }} /> {item.duration}
            </span>
            <span
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold"
              style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
            >
              <BookOpen size={13} style={{ color: 'var(--primary)' }} /> {item.semestres}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)' }}>
            <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] opacity-55">
              Objectifs pédagogiques
            </h4>
            <ul className="space-y-2">
              {item.objectifs.map((obj) => (
                <li key={obj} className="flex items-start gap-2 text-xs leading-relaxed opacity-80">
                  <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }} />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)' }}>
            <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] opacity-55">
              Pièces à fournir
            </h4>
            <ul className="space-y-2">
              {item.conditions.map((c) => (
                <li key={c} className="flex items-start gap-2 text-xs leading-relaxed opacity-80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full cursor-pointer rounded-2xl py-3 text-sm font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
    ),
    document.body,
  );
}

// ─── Données des filières ─────────────────────────────────────────────────────
const STATIC_FILIERES: FilierDetail[] = [
  {
    code: 'GL',
    nom: 'Informatique',
    description: "Développement d'applications web, mobiles et architectures cloud.",
    options: ['Développement web & mobile', 'Administration système', 'Cloud et réseaux', 'Cybersécurité'],
    duration: 'Licence 3 ans / Master 5 ans',
    icon: <Code size={18} />,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
    category: 'Informatique',
    semestres: '6 semestres (Licence) / 10 semestres (Master)',
    objectifs: [
      'Maîtriser les langages de programmation modernes (Java, Python, JavaScript)',
      'Concevoir et déployer des applications web et mobiles',
      'Administrer des réseaux et des systèmes Linux/Windows',
      'Appliquer les bonnes pratiques de cybersécurité',
      'Gérer des projets informatiques avec des méthodes agiles',
    ],
    debouches: [
      'Développeur Full Stack', 'Ingénieur Réseaux', 'Administrateur Système',
      'Expert Cybersécurité', 'Chef de projet IT', 'Architecte Cloud',
    ],
    conditions: [
      'Diplôme du bac ou relevé de notes certifié',
      'Copie ou bulletin de naissance',
      '04 photos d’identité',
      'CIN',
      'Certificat de résidence',
    ],
  },
  {
    code: 'ADM',
    nom: 'Gestion',
    description: 'Gestion des entreprises, comptabilité et management stratégique.',
    options: ['Management', 'Comptabilité et finance', 'Marketing', 'Ressources humaines'],
    duration: 'Licence 3 ans / Master 5 ans',
    icon: <Landmark size={18} />,
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=600&q=80',
    category: 'Gestion',
    semestres: '6 semestres (Licence) / 10 semestres (Master)',
    objectifs: [
      'Maîtriser les outils de gestion et de comptabilité d\'entreprise',
      'Développer des compétences en management d\'équipe',
      'Analyser les marchés et élaborer des stratégies marketing',
      'Gérer les ressources humaines et les conflits organisationnels',
      'Lire et interpréter les états financiers',
    ],
    debouches: [
      'Directeur Administratif', 'Comptable/Auditeur', 'Responsable RH',
      'Chef Marketing', 'Contrôleur de Gestion', 'Consultant d\'entreprise',
    ],
    conditions: [
      'Diplôme du bac ou relevé de notes certifié',
      'Copie ou bulletin de naissance',
      '04 photos d’identité',
      'CIN',
      'Certificat de résidence',
    ],
  },
  {
    code: 'BTP',
    nom: 'Bâtiment et Travaux Publics',
    description: 'Infrastructures, génie civil et résistance des matériaux.',
    options: ['Dessin BTP', 'Topographie', 'Conduite de chantier', 'Structures et béton armé'],
    duration: 'Licence professionnelle 3 ans',
    icon: <HardHat size={18} />,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
    category: 'Génie Civil',
    semestres: '6 semestres',
    objectifs: [
      'Lire et produire des plans d\'architecture et de structure',
      'Maîtriser les logiciels de dessin assisté par ordinateur (AutoCAD)',
      'Conduire et superviser des chantiers de construction',
      'Calculer la résistance des matériaux et structures',
      'Effectuer des relevés topographiques de terrain',
    ],
    debouches: [
      'Conducteur de Travaux', 'Technicien Génie Civil', 'Dessinateur Projeteur',
      'Topographe', 'Chef de Chantier', 'Métreur',
    ],
    conditions: [
      'Diplôme du bac ou relevé de notes certifié',
      'Copie ou bulletin de naissance',
      '04 photos d’identité',
      'CIN',
      'Certificat de résidence',
    ],
  },
  {
    code: 'EM',
    nom: 'Électromécanique',
    description: 'Systèmes automatisés, maintenance industrielle et électricité.',
    options: ['Automatisme', 'Maintenance industrielle', 'Électricité', 'Systèmes mécaniques'],
    duration: 'Licence professionnelle 3 ans',
    icon: <Cpu size={18} />,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    category: 'Industrie',
    semestres: '6 semestres',
    objectifs: [
      'Installer et maintenir des équipements électromécaniques',
      'Programmer des automates industriels (PLC)',
      'Diagnostiquer et résoudre les pannes électriques et mécaniques',
      'Appliquer les normes de sécurité industrielle',
      'Gérer un plan de maintenance préventive',
    ],
    debouches: [
      'Technicien de Maintenance', 'Électricien Industriel', 'Automaticien',
      'Responsable Maintenance', 'Technicien en Automatisme', 'Ingénieur Procédés',
    ],
    conditions: [
      'Diplôme du bac ou relevé de notes certifié',
      'Copie ou bulletin de naissance',
      '04 photos d’identité',
      'CIN',
      'Certificat de résidence',
    ],
  },
];

export default function FiliersPage() {
  const { t } = useT();
  const [selectedFilier, setSelectedFilier] = useState<FilierDetail | null>(null);

  return (
    <div className="animate-fade-in w-full px-4 pb-12 pt-24 sm:px-6 md:px-8 md:pb-16 md:pt-28 lg:px-12">
      <div className="mb-6 max-w-2xl space-y-3 md:mb-10 md:space-y-4">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
          <GraduationCap size={20} /> {t('filiers', 'sectionLabel')}
        </span>
        <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {t('filiers', 'title1')} <span className="text-gradient">{t('filiers', 'title2')}</span>
        </h2>
        <p className="text-sm leading-relaxed opacity-70">{t('filiers', 'desc')}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
        {STATIC_FILIERES.map((item) => (
          <FilierCard
            key={item.code}
            item={item}
            detailsLabel={t('filiers', 'details')}
            onDetails={setSelectedFilier}
          />
        ))}
      </div>

      <div className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-[2rem] border bg-gradient-to-br from-amber-50/80 via-white/75 to-green-50/80 px-5 py-7 shadow-lg shadow-green-900/[0.04] backdrop-blur-md dark:from-amber-400/[0.08] dark:via-white/[0.03] dark:to-green-500/[0.08] md:mt-16 md:px-10 md:py-9" style={{ borderColor: 'var(--border)' }}>
        <div className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-gradient-to-b from-amber-400 via-green-500 to-blue-500" />
        <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-8 text-[9rem] font-black leading-none text-green-500/[0.06]">“</span>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
          <Quote size={32} strokeWidth={1.5} className="shrink-0 text-amber-500/70" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-8" style={{ backgroundColor: 'var(--primary)' }} />
              <span className="text-[10px] font-black uppercase tracking-[0.24em]" style={{ color: 'var(--primary)' }}>
                {t('about', 'sloganLabel')}
              </span>
            </div>
            <h2 className="text-xl font-black leading-tight tracking-tight md:text-2xl">
              <span className="text-gradient">{t('about', 'sloganTitle')}</span>
            </h2>
            <p className="text-sm font-medium italic leading-7 opacity-75 md:text-base">
              {t('about', 'sloganLine1')}<br />
              <span className="font-semibold opacity-90">{t('about', 'sloganLine2')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedFilier && (
        <FilierModal item={selectedFilier} onClose={() => setSelectedFilier(null)} />
      )}
    </div>
  );
}
