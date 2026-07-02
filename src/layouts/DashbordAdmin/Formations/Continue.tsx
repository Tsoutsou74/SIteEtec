import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Briefcase, 
  Clock, Award, CheckCircle, X, Layers 
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

// ─── INTERFACES ──────────────────────────────────────────
interface FormationContinue {
  id: string;
  code: string;
  titre: string;
  domaine: string;
  volumeHoraire: string; // ex: "40 heures", "6 mois (Cours du soir)"
  tarifEntreprise: string; // Spécifique formation pro
  typePublic: string; // ex: "Cadres, Ingénieurs, Demandeurs d'emploi"
  description: string;
  statut: 'Disponible' | 'En cours' | 'Clôturé';
}

// ─── DONNÉES INITIALES DE TEST ───────────────────────────
const INITIAL_CONTINUE: FormationContinue[] = [
  {
    id: '1',
    code: 'FC-DEV-AI',
    titre: 'Intégration des API d\'Intelligence Artificielle (Gemini/OpenAI)',
    domaine: 'Informatique & Tech',
    volumeHoraire: '36 heures (Cours du soir)',
    tarifEntreprise: '850 000 Ar',
    typePublic: 'Développeurs, Chefs de projet',
    description: 'Conception d\'assistants virtuels et intégration de modèles LLM dans des architectures d\'entreprise.',
    statut: 'Disponible',
  },
  {
    id: '2',
    code: 'FC-MGT-AG',
    titre: 'Management Agile et Certification Scrum Master',
    domaine: 'Management & RH',
    volumeHoraire: '24 heures (Weekend)',
    tarifEntreprise: '600 000 Ar',
    typePublic: 'Managers, Team Leads',
    description: 'Maîtrise des frameworks Scrum et Kanban pour piloter des projets complexes à Antananarivo.',
    statut: 'En cours',
  },
  {
    id: '3',
    code: 'FC-BTP-REV',
    titre: 'Modélisation 3D et initiation BIM avec Revit',
    domaine: 'Génie Civil & BTP',
    volumeHoraire: '60 heures',
    tarifEntreprise: '1 200 000 Ar',
    typePublic: 'Architectes, Techniciens supérieurs',
    description: 'Prise en main des outils collaboratifs de conception numérique pour les infrastructures modernes.',
    statut: 'Clôturé',
  }
];

export default function Continue() {
  const [formations, setFormations] = useState<FormationContinue[]>(INITIAL_CONTINUE);
  const [search, setSearch] = useState('');
  
  // États pour le Modal Formulaire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFC, setCurrentFC] = useState<Partial<FormationContinue> | null>(null);

  // ─── GESTION CRUD ───────────────────────────────────────
  
  const openModal = (formation: FormationContinue | null = null) => {
    if (formation) {
      setCurrentFC(formation);
    } else {
      setCurrentFC({ code: '', titre: '', domaine: '', volumeHoraire: '', tarifEntreprise: '', typePublic: '', description: '', statut: 'Disponible' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFC?.code || !currentFC?.titre) return;

    if (currentFC.id) {
      // Modification
      setFormations(prev => prev.map(f => f.id === currentFC.id ? (currentFC as FormationContinue) : f));
    } else {
      // Création
      const newFC: FormationContinue = {
        ...(currentFC as Omit<FormationContinue, 'id'>),
        id: Date.now().toString(),
      };
      setFormations(prev => [newFC, ...prev]);
    }
    setIsModalOpen(false);
    setCurrentFC(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Voulez-vous supprimer ce module de formation continue ?")) {
      setFormations(prev => prev.filter(f => f.id !== id));
    }
  };

  const filteredFormations = formations.filter(f =>
    f.titre.toLowerCase().includes(search.toLowerCase()) ||
    f.code.toLowerCase().includes(search.toLowerCase()) ||
    f.domaine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* ─── ENTÊTE & BARRE D'ACTIONS ────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wide">Formation Continue</h1>
          <p className="text-xs opacity-50">Gestion des certifications, modules courts et perfectionnements professionnels</p>
        </div>
        
        <button
          onClick={() => openModal(null)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-900/10 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Plus size={16} />
          Créer un module pro
        </button>
      </div>

      {/* ─── BARRE DE RECHERCHE ──────────────────────────── */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl border text-xs max-w-md"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <Search size={14} className="opacity-40" />
        <input 
          type="text" 
          placeholder="Rechercher un module, code ou domaine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full"
          style={{ color: 'var(--text)' }} 
        />
      </div>

      {/* ─── TABLEAU DES FORMATIONS CONTINUES ────────────── */}
      <div className="border rounded-2xl overflow-hidden shadow-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-neutral-500/5 font-bold opacity-70" style={{ borderColor: 'var(--border)' }}>
                <th className="p-4 w-28">Référence</th>
                <th className="p-4">Titre du module</th>
                <th className="p-4">Domaine d'expertise</th>
                <th className="p-4">Volume Horaire</th>
                <th className="p-4">Public Cible</th>
                <th className="p-4">Coût/Participant</th>
                <th className="p-4 w-24 text-center">Statut</th>
                <th className="p-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
              {filteredFormations.length > 0 ? (
                filteredFormations.map((fc) => (
                  <tr key={fc.id} className="hover:bg-neutral-500/5 transition">
                    <td className="p-4 font-bold tracking-wider" style={{ color: 'var(--primary)' }}>{fc.code}</td>
                    <td className="p-4">
                      <div className="font-semibold text-sm">{fc.titre}</div>
                      <div className="text-[10px] opacity-50 max-w-sm truncate mt-0.5">{fc.description}</div>
                    </td>
                    <td className="p-4 opacity-80">
                      <span className="px-2 py-0.5 bg-neutral-500/10 rounded-md text-[10px] font-medium">{fc.domaine}</span>
                    </td>
                    <td className="p-4 opacity-80">{fc.volumeHoraire}</td>
                    <td className="p-4 opacity-70 truncate max-w-[120px]">{fc.typePublic}</td>
                    <td className="p-4 font-bold opacity-90">{fc.tarifEntreprise}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${
                        fc.statut === 'Disponible' ? 'bg-emerald-500/10 text-emerald-500' :
                        fc.statut === 'En cours' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-neutral-500/20 text-neutral-500'
                      }`}>
                        {fc.statut}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => openModal(fc)}
                          className="p-1.5 rounded-lg border hover:bg-neutral-500/10 transition cursor-pointer"
                          style={{ borderColor: 'var(--border)' }}
                          title="Modifier"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDelete(fc.id)}
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
                    Aucun module pro enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL : AJOUTER / MODIFIER UN MODULE ────────── */}
      {isModalOpen && currentFC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-fade-in"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <Briefcase size={16} style={{ color: 'var(--primary)' }} />
                <h3 className="text-sm font-black uppercase tracking-wide">
                  {currentFC.id ? 'Modifier la session pro' : 'Créer une session continue'}
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
                  <label className="font-bold opacity-60">Réf. Module *</label>
                  <input 
                    type="text" required placeholder="ex: FC-MGT-01"
                    value={currentFC.code}
                    onChange={e => setCurrentFC({...currentFC, code: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-bold tracking-wider"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="font-bold opacity-60">Intitulé du Module de formation *</label>
                  <input 
                    type="text" required placeholder="ex: Management d'équipe..."
                    value={currentFC.titre}
                    onChange={e => setCurrentFC({...currentFC, titre: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-semibold"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Domaine d'activité</label>
                  <input 
                    type="text" placeholder="ex: RH, Technologie, Marketing..."
                    value={currentFC.domaine}
                    onChange={e => setCurrentFC({...currentFC, domaine: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Volume Horaire & Planning</label>
                  <input 
                    type="text" placeholder="ex: 30 heures (Samedi)"
                    value={currentFC.volumeHoraire}
                    onChange={e => setCurrentFC({...currentFC, volumeHoraire: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Coût d'inscription</label>
                  <input 
                    type="text" placeholder="ex: 750 000 Ar"
                    value={currentFC.tarifEntreprise}
                    onChange={e => setCurrentFC({...currentFC, tarifEntreprise: e.target.value})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-bold"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold opacity-60">Statut opérationnel</label>
                  <select 
                    value={currentFC.statut}
                    onChange={e => setCurrentFC({...currentFC, statut: e.target.value as any})}
                    className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none font-medium"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <option value="Disponible">Disponible (Inscriptions ouvertes)</option>
                    <option value="En cours">En cours (Session active)</option>
                    <option value="Clôturé">Clôturé</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold opacity-60">Public professionnel ciblé</label>
                <input 
                  type="text" placeholder="ex: Ingénieurs, Cadres supérieurs, Chefs de projet..."
                  value={currentFC.typePublic}
                  onChange={e => setCurrentFC({...currentFC, typePublic: e.target.value})}
                  className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold opacity-60">Objectifs de la formation pro</label>
                <textarea 
                  rows={3} placeholder="Détaillez les compétences visées à la fin de la session..."
                  value={currentFC.description}
                  onChange={e => setCurrentFC({...currentFC, description: e.target.value})}
                  className="w-full p-2.5 rounded-xl border bg-neutral-500/5 outline-none resize-none"
                  style={{ borderColor: 'var(--border)' }}
                />
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