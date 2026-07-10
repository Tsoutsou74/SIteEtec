import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';
import ApiService from '../services/ApiService';
import { useT } from '../config/I18nProvider';

interface ArticleProps {
  image: string;
  category: string;
  date: string;
  author: string;
  title: string;
  excerpt: string;
}

interface ActualiteApi {
  id?: number;
  titre?: string;
  categorie?: string;
  datePublication?: string;
  contenu?: string;
  imageUrl?: string;
  statut?: string;
  important?: boolean;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80';

function formatDate(date?: string, locale?: string) {
  if (!date) return '';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  const dateLocale = locale === 'en' ? 'en-US' : locale === 'mg' ? 'mg-MG' : 'fr-FR';

  return new Intl.DateTimeFormat(dateLocale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate);
}

function toArticle(actualite: ActualiteApi, locale: string, categoryFallback: string): ArticleProps {
  return {
    image: actualite.imageUrl || FALLBACK_IMAGE,
    category: actualite.categorie || categoryFallback,
    date: formatDate(actualite.datePublication, locale),
    author: 'ETEC University',
    title: actualite.titre || categoryFallback,
    excerpt: actualite.contenu || '',
  };
}

function NewsCard({ image, category, date, author, title, excerpt }: ArticleProps) {
  const { darkMode } = useTheme();
  const { t } = useT();

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-3xl border shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      <div className="relative h-40 w-full shrink-0 overflow-hidden bg-gray-500/10 sm:h-44 md:h-48">
        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
        <span className="absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: 'var(--primary)' }}>
          {category}
        </span>
      </div>

      <div className="flex flex-grow flex-col justify-between p-4 md:p-6">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3 text-[11px] font-medium opacity-60 md:gap-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} style={{ color: 'var(--primary)' }} /> {date}
            </span>
            <span className="flex items-center gap-1">
              <User size={12} style={{ color: 'var(--primary)' }} /> {author}
            </span>
          </div>
          <h3 className="cursor-pointer line-clamp-2 text-base font-black leading-snug tracking-tight hover:opacity-80 md:text-lg">
            {title}
          </h3>
          <p className="line-clamp-3 text-xs leading-relaxed opacity-70">
            {excerpt}
          </p>
        </div>

        <div className="mt-4 flex justify-end border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <button className="flex cursor-pointer items-center gap-1 text-xs font-bold uppercase tracking-wider transition hover:opacity-80" style={{ color: 'var(--primary)' }}>
            {t('news', 'readArticle')} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function NewsPage() {
  const navigate = useNavigate();
  const { t, locale } = useT();
  const fallbackCategory = t('navbar', 'news');
  const FALLBACK_ARTICLES: ArticleProps[] = [
    {
      image: FALLBACK_IMAGE,
      category: 'Innovation',
      date: '10 Juin 2026',
      author: 'Labo Tech',
      title: 'Hackathon E-TEC 2026 : Les etudiants creent les solutions de demain',
      excerpt: 'Pendant 48 heures non-stop, nos etudiants en Genie Logiciel et Reseaux ont developpe des applications innovantes pour repondre aux enjeux de transition numerique.',
    },
    {
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
      category: 'Innovation',
      date: '10 Juin 2026',
      author: 'Labo Tech',
      title: 'Hackathon E-TEC 2026 : Les etudiants creent les solutions de demain',
      excerpt: 'Pendant 48 heures non-stop, nos etudiants en Genie Logiciel et Reseaux ont developpe des applications innovantes pour repondre aux enjeux de transition numerique.',
    },
    {
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
      category: 'Academique',
      date: '01 Juin 2026',
      author: 'Scolarite',
      title: "Ouverture des inscriptions pour l'annee universitaire 2026-2027",
      excerpt: 'Les dossiers de candidature pour nos quatre filieres majeures (BTP, Gestion, Electromecanique, Informatique) sont des a present disponibles en ligne.',
    },
  ];

  const [articles, setArticles] = useState<ArticleProps[]>(FALLBACK_ARTICLES);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        const response = await ApiService.actualites.getAll();
        const data = response.data;

        if (isMounted && Array.isArray(data) && data.length > 0) {
          setArticles(data.map((item: ActualiteApi) => toArticle(item, locale, fallbackCategory)));
        }
      } catch {
        if (isMounted) {
          setArticles(FALLBACK_ARTICLES);
        }
      }
    };

    loadNews();

    return () => {
      isMounted = false;
    };
  }, [fallbackCategory, locale]);

  return (
    <div className="animate-fade-in w-full px-0 py-10 sm:px-4 md:px-8 md:py-16 lg:px-12">
      <div className="mb-10 max-w-2xl space-y-3 px-1 md:mb-16 md:space-y-4">
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {articles.map((article, index) => (
          <NewsCard key={index} {...article} />
        ))}
      </div>

      <div className="mt-10 flex justify-center md:mt-16">
        <button
          onClick={() => navigate('/actualites')}
          className="flex cursor-pointer items-center gap-2 rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-wider shadow-md transition-all duration-300 hover:scale-105 md:px-6"
          style={{ borderColor: 'var(--primary)', color: 'var(--primary)', backgroundColor: 'transparent' }}
        >
          {t('news', 'seeMore')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
