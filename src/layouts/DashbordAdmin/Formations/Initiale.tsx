import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, BookOpen, 
  Clock, Calendar, CheckCircle, X, ShieldAlert 
} from 'lucide-react';

// ─── INTERFACES ──────────────────────────────────────────
interface Formation {
  id: string;
  code: string;
  titre: string;
  filiere: string;
  duree: string; // ex: "3 ans (Licence)"
  frais: string; // ex: "1 200 000 Ariary / an"
  description: string;
  statut: 'Actif' | 'Inactif';
}

// ─── DONNÉES INITIALES DE TEST ───────────────────────────
const INITIAL_FORMATIONS: Formation[] = [
  {
    id: '1',
    code: 'INF-L',
    titre: 'Licence en Informatique de Gestion',
    filiere: 'Informatique',
    duree: '3 ans',
    frais: '1 400 000 Ar',
    description: 'Formation axée sur le développement logiciel, les bases de données et la gestion d\'entreprise.',
    statut: 'Actif',
  },
  {
    id: '2',
    code: 'BTP-M',
    titre: 'Master en Bâtiment et Travaux Publics',
    filiere: 'Génie Civil',
    duree: '2 ans',
    frais: '1 800 000 Ar',
    description: 'Approfondissement des structures, de la gestion de chantiers et du dimensionnement.',
    statut: 'Actif',
  },
  {
    id: '3',
    code: 'MGT-L',
    titre: 'Licence en Management des Entreprises',
    filiere: 'Management',
    duree: '3 ans',
    frais: '1 200 000 Ar',
    description: 'Acquisition des fondamentaux de la gestion, finance, et ressources humaines.',
    statut: 'Inactif',
  }
];

export default function FormationsInitiale() {
  const [formations, setFormations] = useState<Formation[]>(INITIAL_FORMATIONS);
  const [search, setSearch] = useState('');
  
  // États pour le Modal (Formulaire)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFormation, setCurrentFormation] = useState<Partial<Formation> | null>(null);

  // ─── GESTION CRUD ───────────────────────────────────────
  
  // Ouvrir pour ajouter ou modifier
  const openModal = (formation: Formation | null = null) => {
    if (formation) {
      setCurrentFormation(formation); // Mode Édition
    } else {
      setCurrentFormation({ code: '', titre: '', filiere: '', duree: '', frais: '', description: '', statut: 'Actif' }); // Mode Ajout
    }
    setIsModalOpen(true);
  };

  // Soumettre le formulaire (Ajouter ou Sauvegarder modification)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFormation?.code || !currentFormation?.titre) return;

    if (currentFormation.id) {
      // Update
      setFormations(prev => prev.map(f => f.id === currentFormation.id ? (currentFormation as Formation) : f));
    } else {
      // Create
      const newFormation: Formation = {
        ...(currentFormation as Omit<Formation, 'id'>),
        id: Date.now().toString(),
      };
      setFormations(prev => [newFormation, ...prev]);
    }
    setIsModalOpen(false);
    setCurrentFormation(null);
  };

  // Supprimer une formation
  const handleDelete = (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette formation initiale ?")) {
      setFormations(prev => prev.filter(f => f.id !== id));
    }
  };

  // Filtrer les formations en temps réel
  const filteredFormations = formations.filter(f =>
    f.titre.toLowerCase().includes(search.toLowerCase()) ||
    f.code.toLowerCase().includes(search.toLowerCase()) ||
    f.filiere.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* ─── ENTÊTE & BARRE D'ACTIONS ────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wide">Formations Initiales</h1>
          <p className="text-xs opacity-50">Gestion du catalogue des cursus à temps plein d'E-TEC</p>
        </div>
        
        <button
          onClick={() => openModal(null)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-900/10 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Plus size={16} />
          Ajouter une formation
        </button>
      </div>

      {/* ─── BARRE DE RECHERCHE ──────────────────────────── */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl border text-xs max-w-md"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <Search size={14} className="opacity-40" />
        <input 
          type="text" 
          placeholder="Rechercher par code, titre, filière..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full"
          style={{ color: 'var(--text)' }} 
        />
      </div>

      {/* ─── LISTE / TABLEAU DES FORMATIONS ──────────────── */}
      <div className="border rounded-2xl overflow-hidden shadow-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-neutral-500/5 font-bold opacity-70" style={{ borderColor: 'var(--border)' }}>
                <th className="p-4 w-24">Code</th>
                <th className="p-4">Cursus / Titre</th>
                <th className="p-4">Filière</th>
                <th className="p-4">Durée</th>
                <th className="p-4">Frais de Scolarité</th>
                <th className="p-4 w-24 text-center">Statut</th>
                <th className="p-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
              {filteredFormations.length > 0 ? (
                filteredFormations.map((formation) => (
                  <tr key={formation.id} className="hover:bg-neutral-500/5 transition">
                    <td className="p-4 font-bold tracking-wider" style={{ color: 'var(--primary)' }}>{formation.code}</td>
                    <td className="p-4">
                      <div className="font-semibold text-sm">{formation.titre}</div>
                      <div className="text-[10px] opacity-50 max-w-md truncate mt-0.5">{formation.description}</div>
                    </td>
                    <td className="p-4 opacity-80">{formation.filiere}</td>
                    <td className="p-4 opacity-80">{formation.duree}</td>
                    <td className="p-4 font-medium opacity-90">{formation.frais}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        formation.statut === 'Actif' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {formation.statut}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => openModal(formation)}
                          className="p-1.5 rounded-lg border hover:bg-neutral-500/10 transition cursor-pointer"
                          style={{ borderColor: 'var(--border)' }}
                          title="Modifier"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDelete(formation.id)}
                          className="p-1.5 rounded-lg border hover:bg-rose-500/10 text-rose-500 transition cursor-pointer"
                          style={{ borderColor: 'var(--border)' }}
                          title="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center opacity-40 italic">
                    Aucune formation initiale trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL FORMULAIRE (AJOUT / MODIFICATION) ──────── */}
      {isModalOpen && currentFormation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg rounded-2xl border shadow-2xl animate-fade-in flex flex-col overflow-hidden"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <BookOpen size={16} style={{ color: 'var(--primary)' }} />
                <h3 className="text-sm font-black uppercase tracking-wide">
                  {currentFormation.id ? 'Modifier la formation' : 'Nouvelle formation'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg opacity-50 hover:opacity-100 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh] no-scrollbar">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="font-bold opacity-60">Code Formation *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: INF-L"
                    value={currentFormation.code}
                    onChange={e => setCurrentFormation({...currentFormation, code: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-bold tracking-wider"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="font-bold opacity-60">Intitulé du cursus *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: Licence Professionnelle en..."
                    value={currentFormation.titre}
                    onChange={e => setCurrentFormation({...currentFormation, titre: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-semibold"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Filière / Département</label>
                  <input 
                    type="text" 
                    placeholder="ex: Informatique, Management..."
                    value={currentFormation.filiere}
                    onChange={e => setCurrentFormation({...currentFormation, filiere: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Durée d'études</label>
                  <input 
                    type="text" 
                    placeholder="ex: 3 ans, 2 ans"
                    value={currentFormation.duree}
                    onChange={e => setCurrentFormation({...currentFormation, duree: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Frais Annuels (Ariary)</label>
                  <input 
                    type="text" 
                    placeholder="ex: 1 400 000 Ar"
                    value={currentFormation.frais}
                    onChange={e => setCurrentFormation({...currentFormation, frais: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Statut d'inscription</label>
                  <select 
                    value={currentFormation.statut}
                    onChange={e => setCurrentFormation({...currentFormation, statut: e.target.value as 'Actif' | 'Inactif'})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-medium"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <option value="Actif">Actif (Inscriptions Ouvertes)</option>
                    <option value="Inactif">Inactif (Fermé)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold opacity-60">Description & Débouchés</label>
                <textarea 
                  rows={3}
                  placeholder="Détails du programme de formation..."
                  value={currentFormation.description}
                  onChange={e => setCurrentFormation({...currentFormation, description: e.target.value})}
                  className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none resize-none"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>

              {/* Boutons d'action du Modal */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold hover:bg-neutral-500/5 transition cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold text-white transition hover:opacity-90 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}