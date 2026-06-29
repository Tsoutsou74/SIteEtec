import React from 'react';
import { Radio, Image as ImageIcon, Play } from 'lucide-react';

export default function Galery() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Galerie Photos */}
      <div className="p-5 rounded-2xl border flex items-center justify-between card-hover" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <ImageIcon size={20} className="text-amber-500" />
          <div>
            <h4 className="text-xs font-bold">Galerie</h4>
            <p className="text-[10px] opacity-60">Photos du campus</p>
          </div>
        </div>
        <button className="text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer bg-amber-500">Voir</button>
      </div>

      {/* Vidéos */}
      <div className="p-5 rounded-2xl border flex items-center justify-between card-hover" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <Play size={20} className="text-blue-500" />
          <div>
            <h4 className="text-xs font-bold">Vidéos</h4>
            <p className="text-[10px] opacity-60">Rétrospective & projets</p>
          </div>
        </div>
        <button className="text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer bg-blue-500">Lire</button>
      </div>
    </section>
  );
}