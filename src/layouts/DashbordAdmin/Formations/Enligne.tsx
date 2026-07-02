import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Laptop, 
  Video, FileText, Link, CheckCircle, X, Users 
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

// ─── INTERFACES ──────────────────────────────────────────
interface FormationEnLigne {
  id: string;
  code: string;
  titre: string;
  categorie: string;
  nbChapitres: number;
  nbVideos: number;
  lienPlateforme: string; // Lien direct vers l'espace de cours (Moodle/Teams)
  enseignant: string;
  statut: 'Publié' | 'Brouillon' | 'Archivé';
}

// ─── DONNÉES INITIALES DE TEST ───────────────────────────
const INITIAL_ONLINE: FormationEnLigne[] = [
  {
    id: '1',
    code: 'EL-PHP-SYM',
    titre: 'Développement Web Avancé avec Symfony',
    categorie: 'Informatique',
    nbChapitres: 12,
    nbVideos: 45,
    lienPlateforme: 'https://elearning.etec.mg/course/view.php?id=102',
    enseignant: 'Dr. Rakoto',
    statut: 'Publié',
  },
  {
    id: '2',
    code: 'EL-MGT-FIN',
    titre: 'Analyse Financière et Gestion de Trésorerie',
    categorie: 'Management & Finance',
    nbChapitres: 8,
    nbVideos: 28,
    lienPlateforme: 'https://elearning.etec.mg/course/view.php?id=88',
    enseignant: 'Mme Rabe',
    statut: 'Publié',
  },
  {
    id: '3',
    code: 'EL-BTP-CAD',
    titre: 'Dessin Technique et Initiation AutoCAD 2D/3D',
    categorie: 'Génie Civil & BTP',
    nbChapitres: 6,
    nbVideos: 18,
    lienPlateforme: 'https://elearning.etec.mg/course/view.php?id=45',
    enseignant: 'Ing. Randria',
    statut: 'Brouillon',
  }
];

export default function EnLigne() {
  const [formations, setFormations] = useState<FormationEnLigne[]>(INITIAL_ONLINE);
  const [search, setSearch] = useState('');
  
  // États pour le Modal Formulaire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEL, setCurrentEL] = useState<Partial<FormationEnLigne>>({});

  // ─── GESTION CRUD ───────────────────────────────────────
  
  const openModal = (formation: FormationEnLigne | null = null) => {
    if (formation) {
      setCurrentEL(formation);
    } else {
      setCurrentEL({ code: '', titre: '', categorie: '', nbChapitres: 0, nbVideos: 0, lienPlateforme: '', enseignant: '', statut: 'Brouillon' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEL.code || !currentEL.titre) return;

    if (currentEL.id) {
      // Modification
      setFormations(prev => prev.map(f => f.id === currentEL.id ? (currentEL as FormationEnLigne) : f));
    } else {
      // Création
      const newEL: FormationEnLigne = {
        ...(currentEL as Omit<FormationEnLigne, 'id'>),
        id: Date.now().toString(),
      };
      setFormations(prev => [newEL, ...prev]);
    }
    setIsModalOpen(false);
    setCurrentEL({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce cours en ligne ?")) {
      setFormations(prev => prev.filter(f => f.id !== id));
    }
  };

  const filteredFormations = formations.filter(f =>
    f.titre.toLowerCase().includes(search.toLowerCase()) ||
    f.code.toLowerCase().includes(search.toLowerCase()) ||
    f.categorie.toLowerCase().includes(search.toLowerCase()) ||
    f.enseignant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* ─── ENTÊTE & BARRE D'ACTIONS ────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wide">Formations en Ligne</h1>
          <p className="text-xs opacity-50">Gestion des cours sur la plateforme de e-learning et classes virtuelles</p>
        </div>
        
        <button
          onClick={() => openModal(null)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-900/10 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Plus size={16} />
          Mettre un cours en ligne
        </button>
      </div>

      {/* ─── BARRE DE RECHERCHE ──────────────────────────── */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl border text-xs max-w-md"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <Search size={14} className="opacity-40" />
        <input 
          type="text" 
          placeholder="Rechercher par titre, code, catégorie, auteur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full"
          style={{ color: 'var(--text)' }} 
        />
      </div>

      {/* ─── TABLEAU DES COURS EN LIGNE ──────────────────── */}
      <div className="border rounded-2xl overflow-hidden shadow-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-neutral-500/5 font-bold opacity-70" style={{ borderColor: 'var(--border)' }}>
                <th className="p-4 w-28">Code</th>
                <th className="p-4">Titre du cours</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4 text-center">Structure</th>
                <th className="p-4">Enseignant responsable</th>
                <th className="p-4">Lien E-learning</th>
                <th className="p-4 w-24 text-center">Statut</th>
                <th className="p-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
              {filteredFormations.length > 0 ? (
                filteredFormations.map((el) => (
                  <tr key={el.id} className="hover:bg-neutral-500/5 transition">
                    <td className="p-4 font-bold tracking-wider" style={{ color: 'var(--primary)' }}>{el.code}</td>
                    <td className="p-4">
                      <div className="font-semibold text-sm">{el.titre}</div>
                    </td>
                    <td className="p-4 opacity-80">{el.categorie}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3 text-neutral-400">
                        <span className="flex items-center gap-1" title="Chapitres"><FileText size={12} /> <b className="text-slate-200" style={{ color: 'var(--text)' }}>{el.nbChapitres}</b></span>
                        <span className="flex items-center gap-1" title="Vidéos"><Video size={12} /> <b className="text-slate-200" style={{ color: 'var(--text)' }}>{el.nbVideos}</b></span>
                      </div>
                    </td>
                    <td className="p-4 opacity-80 font-medium">{el.enseignant}</td>
                    <td className="p-4">
                      {el.lienPlateforme ? (
                        <a href={el.lienPlateforme} target="_blank" rel="noreferrer" 
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-medium transition hover:bg-neutral-500/10"
                          style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}>
                          <Link size={10} /> Moodle
                        </a>
                      ) : (
                        <span className="opacity-30">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        el.statut === 'Publié' ? 'bg-emerald-500/10 text-emerald-500' :
                        el.statut === 'Brouillon' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        {el.statut}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => openModal(el)}
                          className="p-1.5 rounded-lg border hover:bg-neutral-500/10 transition cursor-pointer"
                          style={{ borderColor: 'var(--border)' }}
                          title="Modifier"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDelete(el.id)}
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
                  <td colSpan={8} className="p-8 text-center opacity-40 italic">
                    Aucun cours virtuel répertorié.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL : AJOUTER / MODIFIER UN COURS ─────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-fade-in"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <Laptop size={16} style={{ color: 'var(--primary)' }} />
                <h3 className="text-sm font-black uppercase tracking-wide">
                  {currentEL.id ? 'Éditer le module e-learning' : 'Créer un module e-learning'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg opacity-50 hover:opacity-100 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh] no-scrollbar">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="font-bold opacity-60">ID Cours *</label>
                  <input 
                    type="text" required placeholder="ex: EL-PHP-01"
                    value={currentEL.code || ''}
                    onChange={e => setCurrentEL({...currentEL, code: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-bold tracking-wider"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="font-bold opacity-60">Titre du cours *</label>
                  <input 
                    type="text" required placeholder="ex: Apprendre l'architecture MVC..."
                    value={currentEL.titre || ''}
                    onChange={e => setCurrentEL({...currentEL, titre: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-semibold"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Catégorie</label>
                  <input 
                    type="text" placeholder="ex: Informatique, BTP, Langues..."
                    value={currentEL.categorie || ''}
                    onChange={e => setCurrentEL({...currentEL, categorie: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Enseignant responsable</label>
                  <input 
                    type="text" placeholder="ex: Dr. Jean Rabe"
                    value={currentEL.enseignant || ''}
                    onChange={e => setCurrentEL({...currentEL, enseignant: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Nombre de Chapitres</label>
                  <input 
                    type="number" min={0}
                    value={currentEL.nbChapitres || 0}
                    onChange={e => setCurrentEL({...currentEL, nbChapitres: parseInt(e.target.value) || 0})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-bold"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Nombre de supports vidéo</label>
                  <input 
                    type="number" min={0}
                    value={currentEL.nbVideos || 0}
                    onChange={e => setCurrentEL({...currentEL, nbVideos: parseInt(e.target.value) || 0})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-bold"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-bold opacity-60">URL Intégration LMS / Plateforme</label>
                  <input 
                    type="url" placeholder="https://elearning.etec.mg/..."
                    value={currentEL.lienPlateforme || ''}
                    onChange={e => setCurrentEL({...currentEL, lienPlateforme: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="font-bold opacity-60">Statut de diffusion</label>
                  <select 
                    value={currentEL.statut || 'Brouillon'}
                    onChange={e => setCurrentEL({...currentEL, statut: e.target.value as any})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-medium"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <option value="Brouillon">Brouillon</option>
                    <option value="Publié">Publié</option>
                    <option value="Archivé">Archivé</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
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