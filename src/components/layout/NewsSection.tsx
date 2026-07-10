import React from 'react';
import { useT } from '../../config/I18nProvider';

export default function NewsSection() {
  const { t } = useT();
  const news = [
    { title: t('news', 'item1Title'), date: t('news', 'item1Date'), img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80' },
    { title: t('news', 'item2Title'), date: t('news', 'item2Date'), img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black tracking-tight">{t('news', 'sectionLabel')}</h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {news.map((item, idx) => (
          <div key={idx} className="card-hover flex h-full flex-col overflow-hidden rounded-2xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="h-40 overflow-hidden">
              <img src={item.img} alt={item.title} className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105" />
            </div>
            <div className="space-y-2 p-5">
              <span className="text-[10px] font-bold uppercase opacity-50">{item.date}</span>
              <h4 className="line-clamp-2 text-xs font-bold tracking-tight leading-snug">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
