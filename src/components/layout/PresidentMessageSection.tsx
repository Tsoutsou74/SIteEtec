import React, { useEffect, useState } from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/ApiService';

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
    "Bienvenue a E-TEC University. Notre ambition est simple : offrir une formation superieure utile, exigeante et directement reliee aux realites du monde professionnel.",
  imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=520',
};

export default function PresidentMessageSection() {
  const { darkMode } = useTheme();
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
    <section className="w-full py-10 md:py-16 animate-fade-in">
      <div
        className="rounded-3xl border p-5 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center shadow-sm"
        style={{
          backgroundColor: darkMode ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.72)',
          borderColor: 'var(--border)',
          color: 'var(--text)',
        }}
      >
        <div className="lg:col-span-4 flex items-center gap-4">
          <div className="w-24 h-28 md:w-32 md:h-40 rounded-2xl overflow-hidden border shrink-0" style={{ borderColor: 'var(--border)' }}>
            <img
              src={message.imageUrl || FALLBACK_MESSAGE.imageUrl}
              alt={message.authorName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Mot du President</p>
            <h2 className="text-lg md:text-xl font-black tracking-tight truncate">{message.authorName}</h2>
            <p className="text-xs font-bold opacity-55 mt-1">{message.authorTitle}</p>
          </div>
        </div>

        <div className="lg:col-span-8 relative">
          <Quote size={70} className="absolute -top-5 right-0 opacity-[0.05]" />
          <div className="relative space-y-4">
            <h3 className="text-xl md:text-2xl font-black tracking-tight text-blue-500 leading-tight">
              {message.quote}
            </h3>
            <p className="text-sm opacity-75 leading-relaxed line-clamp-3">
              {message.content}
            </p>
            <Link
              to="/motduPresidents"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide transition hover:opacity-80"
              style={{ color: 'var(--primary)' }}
            >
              Lire le message complet <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
