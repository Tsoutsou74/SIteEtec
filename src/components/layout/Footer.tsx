import React from 'react';

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 border-t transition-colors mt-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-xs">
        <div className="space-y-4">
          <span className="font-bold tracking-wider uppercase text-gradient text-sm">Université de Fianarantsoa</span>
          <p className="leading-relaxed opacity-70">Université d'excellence et d'innovation technologique à Madagascar.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-wider">Liens</h4>
          <ul className="space-y-2 opacity-80">
            <li className="hover:underline cursor-pointer">Scolarité</li>
            <li className="hover:underline cursor-pointer">Recherche</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-wider">Contact</h4>
          <p className="opacity-80 leading-relaxed">BP 300 E-TEC • Madagascar</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 uppercase tracking-wider">Newsletter</h4>
          <div className="flex max-w-xs relative items-center">
            <input type="email" placeholder="Votre email" className="p-2.5 rounded-xl w-full text-xs focus:outline-none pr-10" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            <button className="absolute right-1.5 text-white p-1.5 rounded-lg text-xs" style={{ backgroundColor: 'var(--primary)' }}>➔</button>
          </div>
        </div>
      </div>
    </footer>
  );
}