import React from 'react';

export default function Resultats() {
  return (
    <div
      className="rounded-2xl border p-8 md:p-12 text-center"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
    >
      <h1 className="text-xl md:text-2xl font-black tracking-tight mb-2">Résultats</h1>
      <p className="text-xs opacity-50">Page en construction — résultats détaillés par semestre</p>
    </div>
  );
}