import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';

interface ArticleProps {
  image: string;
  category: string;
  date: string;
  author: string;
  title: string;
  excerpt: string;
}

function NewsCard({ image, category, date, author, title, excerpt }: ArticleProps) {
  const { darkMode } = useTheme();

  return (
    <article
      className="rounded-3xl border shadow-md overflow-hidden backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full"
      style={{
        backgroundColor: darkMode ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.45)",
        borderColor: 'var(--border)',
        color: 'var(--text)'
      }}
    >
      {/* Image */}
      <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden bg-gray-500/10 shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span
          className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-sm"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {category}
        </span>
      </div>

      {/* Contenu */}
      <div className="p-4 md:p-6 flex flex-col flex-grow justify-between">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3 md:gap-4 text-[11px] opacity-60 font-medium">
            <span className="flex items-center gap-1">
              <Calendar size={12} style={{ color: 'var(--primary)' }} /> {date}
            </span>
            <span className="flex items-center gap-1">
              <User size={12} style={{ color: 'var(--primary)' }} /> {author}
            </span>
          </div>
          <h3 className="text-base md:text-lg font-black tracking-tight leading-snug line-clamp-2 hover:opacity-80 cursor-pointer">
            {title}
          </h3>
          <p className="text-xs opacity-70 leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
          <button
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition hover:opacity-80 cursor-pointer"
            style={{ color: 'var(--primary)' }}
          >
            Lire l'article <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function NewsPage() {
  const ARTICLES: ArticleProps[] = [
    {
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      category: "Innovation",
      date: "10 Juin 2026",
      author: "Labo Tech",
      title: "Hackathon E-TEC 2026 : Les étudiants créent les solutions de demain",
      excerpt: "Pendant 48 heures non-stop, nos étudiants en Génie Logiciel et Réseaux ont développé des applications innovantes pour répondre aux enjeux de transition numérique."
    },
    {
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      category: "Innovation",
      date: "10 Juin 2026",
      author: "Labo Tech",
      title: "Hackathon E-TEC 2026 : Les étudiants créent les solutions de demain",
      excerpt: "Pendant 48 heures non-stop, nos étudiants en Génie Logiciel et Réseaux ont développé des applications innovantes pour répondre aux enjeux de transition numérique."
    },
    {
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
      category: "Académique",
      date: "01 Juin 2026",
      author: "Scolarité",
      title: "Ouverture des inscriptions pour l'année universitaire 2026-2027",
      excerpt: "Les dossiers de candidature pour nos quatre filières majeures (BTP, Gestion, Électromécanique, Informatique) sont dès à présent disponibles en ligne."
    }
  ];

  return (
    <div className="w-full px-0 sm:px-4 md:px-8 lg:px-12 py-10 md:py-16 animate-fade-in">

      {/* En-tête */}
      <div className="max-w-2xl mb-10 md:mb-16 space-y-3 md:space-y-4 px-1">
        <span
          className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
          style={{ color: 'var(--primary)' }}
        >
          <Newspaper size={14} /> Actualités & Média
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
          Suivez la vie de <span className="text-gradient">notre Université</span>
        </h1>
        <p className="text-sm opacity-70 leading-relaxed">
          Restez informé des derniers projets, des innovations pédagogiques, des événements et des réalisations marquantes de la communauté E-TEC.
        </p>
      </div>

      {/* Grille des articles
          - mobile  : 1 colonne (cards empilées, facile à lire)
          - sm      : 2 colonnes
          - lg      : 3 colonnes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {ARTICLES.map((article, index) => (
          <NewsCard key={index} {...article} />
        ))}
      </div>

      {/* Bouton Voir plus */}
      <div className="mt-10 md:mt-16 flex justify-center">
        <button
          className="flex items-center gap-2 px-5 md:px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer shadow-md"
          style={{
            borderColor: 'var(--primary)',
            color: 'var(--primary)',
            backgroundColor: 'transparent'
          }}
        >
          Voir plus d'actualités <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}