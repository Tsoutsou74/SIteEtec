import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Search, User, Mail, Phone, BookOpen, 
  ChevronLeft, ChevronRight, CheckCircle, Clock, MessageSquare 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
type MatiereExpertise = string;

interface Enseignant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: 'Permanent' | 'Vacataire';
  matieres: MatiereExpertise[];
  disponibilite: 'Disponible' | 'En cours de cours' | 'Absent';
}

// ─── Données initiales (ETEC) ─────────────────────────────
const INITIAL_ENSEIGNANTS: Enseignant[] = [
  { id: '1', nom: 'ANDRIAMALALA', prenom: 'Rija', email: 'rija.andria@etec.mg', telephone: '+261 34 88 777 11', statut: 'Permanent', matieres: ['Algorithmique Avancée', 'Architecture Java / Spring'], disponibilite: 'Disponible' },
  { id: '2', nom: 'RAZAFINDRAKOTO', prenom: 'Lova', email: 'lova.razaf@etec.mg', telephone: '+261 33 99 888 22', statut: 'Vacataire', matieres: ['Gestion de Projet & Agilité', 'Comptabilité'], disponibilite: 'En cours de cours' },
  { id: '3', nom: 'HERILALA', prenom: 'Sitraka', email: 'sitraka.heri@etec.mg', telephone: '+261 32 11 222 33', statut: 'Permanent', matieres: ['Développement Web (React/Next)', 'DevOps & Cloud'], disponibilite: 'Disponible' },
  { id: '4', nom: 'RAMANANTOANINA', prenom: 'Faly', email: 'faly.ram@etec.mg', telephone: '+261 34 55 444 99', statut: 'Vacataire', matieres: ['BTP & Résistance des Matériaux'], disponibilite: 'Absent' },
];

const PAGE_SIZE = 4;

// ─── Helpers Styles ───────────────────────────────────────
const dispColor = (d: Enseignant['disponibilite']) =>
  d === 'Disponible' ? '#22c55e' : d === 'En cours de cours' ? '#3b82f6' : '#ef4444';

export default function EnseignantsList() {
  const { darkMode } = useTheme();

  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [page, setPage] = useState(1);
  
  // État de sélection pour voir les détails de l'enseignant
  const [selectedProf, setSelectedProf] = useState<Enseignant | null>(null);

  const inputStyle = {
    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  const cardStyle = {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  // ─── Filtrage ───────────────────────────────────────────
  const filtered = INITIAL_ENSEIGNANTS.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = 
      e.nom.toLowerCase().includes(q) || 
      e.prenom.toLowerCase().includes(q) || 
      e.matieres.some(m => m.toLowerCase().includes(q));
    const matchStatut = filtreStatut ? e.statut === filtreStatut : true;
    return matchSearch && matchStatut;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      
      {/* En-tête */}
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight">Corps Enseignant</h1>
        <p className="text-xs opacity-45 mt-1">Annuaire des professeurs et intervenants de l'ETEC</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <Search size={14} className="opacity-40 shrink-0" />
          <input
            type="text" placeholder="Rechercher par nom, matière, compétence..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
          />
        </div>
        <select value={filtreStatut} onChange={e => { setFiltreStatut(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none sm:w-48" style={inputStyle}>
          <option value="">Tous les statuts</option>
          <option value="Permanent">Permanent</option>
          <option value="Vacataire">Vacataire</option>
        </select>
      </div>

      {/* Grille d'affichage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginated.length === 0 ? (
          <div className="col-span-full py-12 text-center opacity-40 text-xs border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
            Aucun enseignant trouvé.
          </div>
        ) : (
          paginated.map(prof => (
            <div 
              key={prof.id} 
              onClick={() => setSelectedProf(prof)}
              className="p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] hover:shadow-md flex flex-col justify-between space-y-4"
              style={cardStyle}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm tracking-tight">{prof.prenom} {prof.nom}</h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-65">
                      {prof.statut}
                    </span>
                  </div>
                  
                  {/* Liste puces compétences */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {prof.matieres.map((m, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/5 text-blue-500 font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statut présence / disponibilité */}
                <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: dispColor(prof.disponibilite) }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dispColor(prof.disponibilite) }} />
                  {prof.disponibilite}
                </span>
              </div>

              {/* Footer de la carte */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-[11px] opacity-65" style={{ borderColor: 'var(--border)' }}>
                <span className="truncate flex items-center gap-1"><Mail size={11} className="opacity-50" /> {prof.email}</span>
                <span className="truncate flex items-center gap-1"><Phone size={11} className="opacity-50" /> {prof.telephone}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-2 text-xs">
        <p className="opacity-45">Page {page} sur {totalPages}</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border transition disabled:opacity-20" style={{ borderColor: 'var(--border)' }}><ChevronLeft size={14} /></button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border transition disabled:opacity-20" style={{ borderColor: 'var(--border)' }}><ChevronRight size={14} /></button>
        </div>
      </div>

      {/* ─── MODALE DÉTAILS ENSEIGNANT ───────────────────── */}
      {selectedProf && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 relative" style={cardStyle}>
            
            <div className="text-center space-y-2 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto font-black text-sm">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight">{selectedProf.prenom} {selectedProf.nom}</h2>
                <p className="text-[11px] opacity-45">Enseignant {selectedProf.statut}</p>
              </div>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase opacity-40">Matières assignées</span>
                <div className="space-y-1 pt-1">
                  {selectedProf.matieres.map((m, idx) => (
                    <p key={idx} className="font-semibold flex items-center gap-1.5"><BookOpen size={12} className="opacity-45" /> {m}</p>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase opacity-40">Contacts</span>
                <p className="font-medium flex items-center gap-2"><Mail size={12} className="opacity-50" /> {selectedProf.email}</p>
                <p className="font-medium flex items-center gap-2"><Phone size={12} className="opacity-50" /> {selectedProf.telephone}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={() => setSelectedProf(null)} className="py-2.5 rounded-xl font-bold text-xs border transition hover:opacity-75" style={{ borderColor: 'var(--border)' }}>
                Fermer
              </button>
              <a href={`mailto:${selectedProf.email}`} className="py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white flex items-center justify-center gap-1.5 shadow-md transition hover:bg-blue-700">
                <MessageSquare size={13} /> Contacter
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}