import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Search, GraduationCap, Mail, Phone, MapPin, 
  ChevronLeft, ChevronRight, Filter, BookOpen, ShieldCheck 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
type Filiere = 'Génie Logiciel' | 'Administration' | 'BTP' | 'Électromécanique';

interface Etudiant {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  filiere: Filiere;
  niveau: 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
  statut: 'Actif' | 'Inactif';
}

// ─── Données initiales (ETEC) ─────────────────────────────
const INITIAL_ETUDIANTS: Etudiant[] = [
  { id: '1', matricule: 'ET-2024-001', nom: 'RAKOTOMALALA', prenom: 'Andry', email: 'andry.rakoto@etec.mg', telephone: '+261 34 11 222 33', filiere: 'Génie Logiciel', niveau: 'L3', statut: 'Actif' },
  { id: '2', matricule: 'ET-2024-042', nom: 'RAVELO', prenom: 'Mialy', email: 'mialy.ravelo@etec.mg', telephone: '+261 33 22 333 44', filiere: 'Administration', niveau: 'M1', statut: 'Actif' },
  { id: '3', matricule: 'ET-2025-015', nom: 'RANDRIA', prenom: 'Faly', email: 'faly.randria@etec.mg', telephone: '+261 32 44 555 66', filiere: 'BTP', niveau: 'L2', statut: 'Actif' },
  { id: '4', matricule: 'ET-2023-089', nom: 'ANDRIAMALALA', prenom: 'Thierry', email: 'thierry.andria@etec.mg', telephone: '+261 34 55 666 77', filiere: 'Électromécanique', niveau: 'L3', statut: 'Inactif' },
  { id: '5', matricule: 'ET-2024-112', nom: 'RASOANANDRASANA', prenom: 'Hariniaina', email: 'hari.rasoa@etec.mg', telephone: '+261 33 77 888 99', filiere: 'Génie Logiciel', niveau: 'L3', statut: 'Actif' },
];

const FILIERES: Filiere[] = ['Génie Logiciel', 'Administration', 'BTP', 'Électromécanique'];
const NIVEAUX = ['L1', 'L2', 'L3', 'M1', 'M2'];
const PAGE_SIZE = 4;

export default function ListEtudiants() {
  const { darkMode } = useTheme();

  // États de filtrage et recherche
  const [search, setSearch] = useState('');
  const [filtreFiliere, setFiltreFiliere] = useState('');
  const [filtreNiveau, setFiltreNiveau] = useState('');
  const [page, setPage] = useState(1);

  // État de sélection pour voir les détails d'un étudiant
  const [selectedEtudiant, setSelectedEtudiant] = useState<Etudiant | null>(null);

  // Styles Dynamiques
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

  // ─── Filtrage Logique ───────────────────────────────────
  const filtered = INITIAL_ETUDIANTS.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = 
      e.nom.toLowerCase().includes(q) || 
      e.prenom.toLowerCase().includes(q) || 
      e.matricule.toLowerCase().includes(q);
    
    const matchFiliere = filtreFiliere ? e.filiere === filtreFiliere : true;
    const matchNiveau = filtreNiveau ? e.niveau === filtreNiveau : true;

    return matchSearch && matchFiliere && matchNiveau;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      
      {/* En-tête de page */}
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight">Liste des Étudiants</h1>
        <p className="text-xs opacity-45 mt-1">Consulter l'annuaire global des inscrits</p>
      </div>

      {/* Barre de recherche et Filtres */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border sm:col-span-1"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <Search size={14} className="opacity-40 shrink-0" />
          <input
            type="text"
            placeholder="Nom, prénom, matricule..."
            value={search}
            onChange={el => { setSearch(el.target.value); setPage(1); }}
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ color: 'var(--text)' }}
          />
        </div>

        <select 
          value={filtreFiliere} 
          onChange={el => { setFiltreFiliere(el.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none" 
          style={inputStyle}
        >
          <option value="">Toutes les filières</option>
          {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select 
          value={filtreNiveau} 
          onChange={el => { setFiltreNiveau(el.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none" 
          style={inputStyle}
        >
          <option value="">Tous les niveaux</option>
          {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* Vue Grille Cartes (Scannable et moderne) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedData.length === 0 ? (
          <div className="col-span-full py-12 text-center opacity-40 text-xs border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
            Aucun étudiant ne correspond à vos critères de recherche.
          </div>
        ) : (
          paginatedData.map(etudiant => (
            <div 
              key={etudiant.id} 
              onClick={() => setSelectedEtudiant(etudiant)}
              className="p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] hover:shadow-md flex flex-col justify-between space-y-4"
              style={cardStyle}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-60">
                    {etudiant.matricule}
                  </span>
                  <h3 className="font-black text-sm tracking-tight pt-1">
                    {etudiant.prenom} {etudiant.nom}
                  </h3>
                  <p className="text-[11px] opacity-50 flex items-center gap-1">
                    <BookOpen size={11} /> {etudiant.filiere}
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                  etudiant.niveau.startsWith('M') ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {etudiant.niveau}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-[11px] opacity-70" style={{ borderColor: 'var(--border)' }}>
                <span className="truncate flex items-center gap-1"><Mail size={11} className="opacity-45" /> {etudiant.email}</span>
                <span className="truncate flex items-center gap-1"><Phone size={11} className="opacity-45" /> {etudiant.telephone}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Simple */}
      <div className="flex items-center justify-between px-2 py-2 text-xs">
        <p className="opacity-45">Page {page} sur {totalPages}</p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1} 
            className="p-2 rounded-xl border transition disabled:opacity-20" 
            style={{ borderColor: 'var(--border)' }}
          >
            <ChevronLeft size={14} />
          </button>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages} 
            className="p-2 rounded-xl border transition disabled:opacity-20" 
            style={{ borderColor: 'var(--border)' }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ─── MODALE DETAILS ÉTUDIANT ─────────────────────── */}
      {selectedEtudiant && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 relative" style={cardStyle}>
            
            <div className="text-center space-y-3 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mx-auto font-black text-lg">
                {selectedEtudiant.prenom[0]}{selectedEtudiant.nom[0]}
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight">{selectedEtudiant.prenom} {selectedEtudiant.nom}</h2>
                <p className="font-mono text-[10px] opacity-45 mt-0.5">{selectedEtudiant.matricule}</p>
              </div>
              <div className="flex gap-2 justify-center">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500">
                  {selectedEtudiant.filiere}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                  <ShieldCheck size={10} /> {selectedEtudiant.statut}
                </span>
              </div>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase opacity-40">Contact direct</span>
                <p className="font-medium flex items-center gap-2"><Mail size={12} className="opacity-50" /> {selectedEtudiant.email}</p>
                <p className="font-medium flex items-center gap-2 pt-1"><Phone size={12} className="opacity-50" /> {selectedEtudiant.telephone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase opacity-40">Cursus universitaire</span>
                <p className="font-medium flex items-center gap-2"><GraduationCap size={12} className="opacity-50" /> Niveau d'études actuel : {selectedEtudiant.niveau}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase opacity-40">Centre régional</span>
                <p className="font-medium flex items-center gap-2"><MapPin size={12} className="opacity-50" /> Campus ETEC Antananarivo</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedEtudiant(null)} 
              className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs border transition hover:opacity-80" 
              style={{ borderColor: 'var(--border)' }}
            >
              Fermer la fiche
            </button>
          </div>
        </div>
      )}

    </div>
  );
}