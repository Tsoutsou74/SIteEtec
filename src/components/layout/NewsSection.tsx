import React from 'react';

export default function NewsSection() {
  const news = [
    { title: "Cérémonie de remise des diplômes 2026", date: "15 Mai", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80" },
    { title: "Nouveau programme d'incubation tech", date: "12 Mai", img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black tracking-tight">Dernières actualités</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {news.map((item, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden border flex flex-col h-full group card-hover" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="overflow-hidden h-40">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" />
            </div>
            <div className="p-5 space-y-2">
              <span className="text-[10px] opacity-50 font-bold uppercase">{item.date}</span>
              <h4 className="text-xs font-bold tracking-tight line-clamp-2 leading-snug">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}