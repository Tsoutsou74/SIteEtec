import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Newspaper, X } from 'lucide-react';
import { useT } from '../config/I18nProvider';

interface ArticleProps {
  image: string;
  category: string;
  date: string;
  author: string;
  title: string;
  excerpt: string;
  details?: string;
}

const STATIC_ARTICLES: ArticleProps[] = [
  {
    image: 'https://images.unsplash.com/photo-1532649538693-f3a2ec1bf8bd?auto=format&fit=crop&w=600&q=80',
    category: 'Événement',
    date: '15 Mai 2026',
    author: 'ETEC University',
    title: 'Cérémonie de remise des diplômes 2026',
    excerpt: 'Les diplômés de la promotion 2026 ont été célébrés lors d\'une cérémonie solennelle organisée au sein du campus de Faravohitra.',
  },
  {
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    category: 'Innovation',
    date: '12 Mai 2026',
    author: 'ETEC University',
    title: 'Nouveau programme d\'incubation tech',
    excerpt: 'E-TEC lance un programme d\'incubation dédié aux étudiants entrepreneurs souhaitant développer leurs projets numériques innovants.',
  },
  {
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=600&q=80',
    category: 'Partenariat',
    date: '05 Mai 2026',
    author: 'ETEC University',
    title: 'Signature d\'un partenariat avec des entreprises locales',
    excerpt: 'E-TEC University renforce ses liens avec le secteur professionnel grâce à de nouveaux accords de stage et d\'emploi pour ses diplômés.',
  },
  {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    category: 'Formation',
    date: '28 Avril 2026',
    author: 'ETEC University',
    title: 'Ouverture des inscriptions pour la rentrée 2026–2027',
    excerpt: 'Les candidatures pour la prochaine année académique sont désormais ouvertes. Découvrez les formations disponibles et les modalités d\'admission.',
  },
  {
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
    category: 'Numérique',
    date: '20 Avril 2026',
    author: 'ETEC University',
    title: 'Atelier de développement web organisé pour les étudiants',
    excerpt: 'Un atelier pratique de développement web et mobile a été organisé pour les étudiants en génie logiciel avec des intervenants professionnels.',
  },
  {
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    category: 'Campus',
    date: '10 Avril 2026',
    author: 'ETEC University',
    title: 'Modernisation des infrastructures pédagogiques',
    excerpt: 'Le campus de Faravohitra bénéficie de nouvelles salles équipées de matériel informatique de dernière génération pour améliorer l\'expérience d\'apprentissage.',
  },
];

const ARTICLE_DETAILS = [
  'Cette cérémonie a réuni les diplômés, leurs familles et l’équipe pédagogique pour célébrer la fin de leur parcours. Un moment important qui met en valeur le travail accompli et ouvre la voie à de nouveaux projets professionnels.',
  'Le programme accompagne les étudiants dans la transformation de leurs idées en projets concrets. Ils bénéficient d’un encadrement, d’ateliers pratiques et de rencontres avec des professionnels du numérique.',
  'Ces nouveaux partenariats renforcent le lien entre la formation et le monde professionnel. Ils faciliteront l’accès aux stages, aux projets en entreprise et aux premières opportunités d’emploi.',
  'Les inscriptions pour la rentrée 2026–2027 sont ouvertes. Les candidats peuvent consulter les formations proposées, préparer les pièces demandées et se rapprocher de l’établissement pour finaliser leur dossier.',
  'Pendant cet atelier, les étudiants ont travaillé sur des cas pratiques de développement web et mobile. Les intervenants ont partagé leurs méthodes et leurs conseils pour réussir un projet numérique.',
  'La modernisation du campus améliore les conditions d’apprentissage et permet aux étudiants de travailler avec des équipements adaptés aux exigences actuelles de leur formation.',
];

function NewsCard({ image, title, excerpt, onRead }: ArticleProps & { onRead: () => void }) {
  const { darkMode } = useTheme();
  const { t } = useT();

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-3xl border shadow-md backdrop-blur-md"
      style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      <div className="relative h-32 w-full shrink-0 overflow-hidden bg-gray-500/10 sm:h-36 md:h-40">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=60';
          }}
        />
      </div>

        <div className="flex flex-grow flex-col justify-between p-3 md:p-3.5">
        <div className="space-y-1 md:space-y-1.5">
          <h3 className="line-clamp-2 text-sm font-black leading-snug tracking-tight md:text-base">
            {title}
          </h3>
          <p className="line-clamp-3 text-xs leading-relaxed opacity-70">
            {excerpt}
          </p>
        </div>

        <div className="mt-2 flex justify-end border-t pt-2" style={{ borderColor: 'var(--border)' }}>
          <button type="button" onClick={onRead} className="flex cursor-pointer items-center gap-1 text-xs font-bold uppercase tracking-wider transition hover:gap-2" style={{ color: 'var(--primary)' }}>
            {t('news', 'readArticle')} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function NewsPage({ showSeeMore = true }: { showSeeMore?: boolean }) {
  const navigate = useNavigate();
  const { t } = useT();
  const [selectedArticle, setSelectedArticle] = useState<ArticleProps | null>(null);

  useEffect(() => {
    if (!selectedArticle) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedArticle(null);
    };

    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);

  return (
    <div className="animate-fade-in w-full px-4 pb-8 pt-28 sm:px-6 md:px-8 md:pb-10 md:pt-32 lg:px-12">
      <div className="mb-4 max-w-2xl space-y-2 md:mb-7 md:space-y-3">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
          <Newspaper size={14} /> {t('news', 'sectionLabel')}
        </span>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          {t('news', 'title1')} <span className="text-gradient">{t('news', 'title2')}</span>
        </h1>
        <p className="text-sm leading-relaxed opacity-70">
          {t('news', 'desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
        {STATIC_ARTICLES.map((article, index) => (
          <NewsCard key={index} {...article} details={ARTICLE_DETAILS[index]} onRead={() => setSelectedArticle({ ...article, details: ARTICLE_DETAILS[index] })} />
        ))}
      </div>

      {selectedArticle && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedArticle(null);
          }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <article role="dialog" aria-modal="true" aria-labelledby="article-modal-title" className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border shadow-2xl" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
            <button type="button" aria-label="Fermer l’article" onClick={() => setSelectedArticle(null)} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:scale-105" title="Fermer">
              <X size={18} />
            </button>
            <img src={selectedArticle.image} alt="" className="h-48 w-full object-cover sm:h-64" />
            <div className="p-5 sm:p-6">
              <h2 id="article-modal-title" className="mt-4 text-2xl font-black leading-tight sm:text-3xl">{selectedArticle.title}</h2>
              <p className="mt-4 text-sm leading-7 opacity-75">{selectedArticle.excerpt}</p>
              <p className="mt-3 text-sm leading-7 opacity-75">{selectedArticle.details ?? selectedArticle.excerpt}</p>
            </div>
          </article>
        </div>
      )}

      {showSeeMore && (
        <div className="mt-10 flex justify-center md:mt-16">
          <button
            onClick={() => navigate('/actualites')}
            className="flex cursor-pointer items-center gap-2 rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-wider shadow-md md:px-6"
            style={{ borderColor: 'var(--primary)', color: 'var(--primary)', backgroundColor: 'transparent' }}
          >
            {t('news', 'seeMore')} <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
