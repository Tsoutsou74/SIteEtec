import React, { useEffect, useState } from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/ApiService';
import { useT } from '../../config/I18nProvider';

interface PresidentMessage {
  id?: number;
  authorName: string;
  authorTitle: string;
  quote: string;
  content: string;
  imageUrl: string;
  isActive?: boolean;
}

const FALLBACK_MESSAGE: PresidentMessage = {
  authorName: 'Pr. Andrianaivoravelona',
  authorTitle: 'President fondateur',
  quote: "Batir ensemble l'avenir technologique et professionnel de Madagascar.",
  content:
    'Bienvenue a E-TEC University. Notre ambition est simple : offrir une formation superieure utile, exigeante et directement reliee aux realites du monde professionnel.',
  imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=520',
};

export default function PresidentMessageSection() {
  const { darkMode } = useTheme();
  const { t } = useT();
  const [message, setMessage] = useState<PresidentMessage>(FALLBACK_MESSAGE);

  useEffect(() => {
    let isMounted = true;

    const loadMessage = async () => {
      try {
        const response = await ApiService.mots.getAll();
        const data = response.data;

        if (isMounted && Array.isArray(data) && data.length > 0) {
          setMessage(data.find((item: PresidentMessage) => item.isActive) || data[0]);
        }
      } catch {
        if (isMounted) {
          setMessage(FALLBACK_MESSAGE);
        }
      }
    };

    loadMessage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="animate-fade-in w-full py-10 md:py-16">
      <div
        className="grid grid-cols-1 items-center gap-6 rounded-3xl border p-5 shadow-sm md:gap-8 md:p-8 lg:grid-cols-12"
        style={{
          backgroundColor: darkMode ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.72)',
          borderColor: 'var(--border)',
          color: 'var(--text)',
        }}
      >
        <div className="flex items-center gap-4 lg:col-span-4">
          <div className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl border md:h-40 md:w-32" style={{ borderColor: 'var(--border)' }}>
            <img src={message.imageUrl || FALLBACK_MESSAGE.imageUrl} alt={message.authorName} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-blue-500">{t('navbar', 'president')}</p>
            <h2 className="truncate text-lg font-black tracking-tight md:text-xl">{message.authorName}</h2>
            <p className="mt-1 text-xs font-bold opacity-55">{message.authorTitle}</p>
          </div>
        </div>

        <div className="relative lg:col-span-8">
          <Quote size={70} className="absolute -top-5 right-0 opacity-[0.05]" />
          <div className="relative space-y-4">
            <h3 className="text-xl font-black leading-tight tracking-tight text-blue-500 md:text-2xl">
              {message.quote}
            </h3>
            <p className="line-clamp-3 text-sm leading-relaxed opacity-75">
              {message.content}
            </p>
            <Link
              to="/motduPresidents"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide transition hover:opacity-80"
              style={{ color: 'var(--primary)' }}
            >
              {t('about', 'readMore')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
