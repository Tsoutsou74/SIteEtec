import React from 'react';

export default function Testimonial() {
  return (
    <section className="py-12 px-8 rounded-2xl border text-center max-w-4xl mx-auto space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <p className="text-sm italic opacity-80 leading-relaxed">
        "Le cadre d'apprentissage moderne proposé ici et la qualité des modules en technologies de l'information ont largement dépassé mes attentes."
      </p>
      <div>
        <h5 className="text-xs font-bold text-gradient">Rova Aliana</h5>
        <p className="text-[10px] opacity-50">Étudiante en Master Data Science</p>
      </div>
    </section>
  );
}