import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import {
  Search, Plus, Pencil, Trash2, X, Save,
  Calendar, CheckCircle, AlertCircle, Laptop, GraduationCap, Clock
} from 'lucide-react';

// ── Types Révisés avec TypeFormation ──────────────────────
export type TypeFormation = 'Initiale' | 'Continue' | 'En ligne';

interface Programme {
  id: number;
  anneeAcademique: string; // ex: 2025-2026
  filiere: string;          // ex: Génie Logiciel
  niveau: 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
  typeFormation: TypeFormation; // Le type de rythme d'étude
  titre: string;           // ex: Parcours Web & Mobile Avancé
  heuresTheoriques: number;
  heuresPratiques: number;
  statut: 'Actif' | 'En attente' | 'Archivé';
}

const INITIAL_PROGRAMMES: Programme[] = [
  { id: 1, anneeAcademique: '2025-2026', filiere: 'Génie Logiciel', niveau: 'L3', typeFormation: 'Initiale', titre: 'Parcours Web, Mobile & Architecture Cloud', heuresTheoriques: 240, heuresPratiques: 180, statut: 'Actif' },
  { id: 2, anneeAcademique: '2025-2026', filiere: 'Administration', niveau: 'M1', typeFormation: 'Continue', titre: 'Executive Master — Entrepreneuriat & Finance', heuresTheoriques: 300, heuresPratiques: 100, statut: 'Actif' },
  { id: 3, anneeAcademique: '2025-2026', filiere: 'BTP', niveau: 'L2', typeFormation: 'Initiale', titre: 'Infrastructures & Dessin Technique assisté par Ordinateur', heuresTheoriques: 200, heuresPratiques: 150, statut: 'En attente' },
  { id: 4, anneeAcademique: '2025-2026', filiere: 'Génie Logiciel', niveau: 'L3', typeFormation: 'En ligne', titre: 'Parcours Distanciel — Développement Full-Stack', heuresTheoriques: 210, heuresPratiques: 140, statut: 'Actif' },
  { id: 5, anneeAcademique: '2024-2025', filiere: 'Génie Logiciel', niveau: 'L3', typeFormation: 'Initiale', titre: 'Ancien Programme Systèmes & Réseaux', heuresTheoriques: 220, heuresPratiques: 160, statut: 'Archivé' },
];

const FILIERES = ['Génie Logiciel', 'Administration', 'BTP', 'Électromécanique'];
const NIVEAUX: Programme['niveau'][] = ['L1', 'L2', 'L3', 'M1', 'M2'];
const STATUTS: Programme['statut'][] = ['Actif', 'En attente', 'Archivé'];
const TYPES_FORMATION: TypeFormation[] = ['Initiale', 'Continue', 'En ligne'];

const EMPTY_FORM = {
  anneeAcademique: '2025-2026', filiere: 'Génie Logiciel', niveau: 'L3' as Programme['niveau'], typeFormation: 'Initiale' as TypeFormation, titre: '', heuresTheoriques: 120, heuresPratiques: 120, statut: 'En attente' as Programme['statut']
};

export default function Programmes() {
  const { darkMode } = useTheme();
  const [data, setData] = useState<Programme[]>(INITIAL_PROGRAMMES);
  const [search, setSearch] = useState('');
  const [filtreFiliere, setFiltreFiliere] = useState('');
  const [filtreType, setFiltreType] = useState<string>(''); // Filtre par type de formation

  // États CRUD
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Programme | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // ── Filtrage Amélioré ───────────────────────────────────
  const filtered = data.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.titre.toLowerCase().includes(q) || p.anneeAcademique.includes(q);
    const matchFiliere = filtreFiliere ? p.filiere === filtreFiliere : true;
    const matchType = filtreType ? p.typeFormation === filtreType : true;
    return matchSearch && matchFiliere && matchType;
  });

  // ── Actions CRUD ────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModalMode('add');
  };

  const openEdit = (p: Programme) => {
    const { id, ...rest } = p;
    setForm(rest);
    setSelected(p);
    setModalMode('edit');
  };

  const handleSave = () => {
    if (!form.titre || !form.anneeAcademique) {
      showToast('Veuillez renseigner le titre du parcours et l\'année académique.');
      return;
    }

    if (modalMode === 'add') {
      const newId = data.length > 0 ? Math.max(...data.map(p => p.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
      showToast('Nouveau programme académique créé');
    } else if (modalMode === 'edit' && selected) {
      setData(data.map(p => p.id === selected.id ? { ...p, ...form } : p));
      showToast('Maquette pédagogique mise à jour');
    }
    setModalMode(null);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setData(data.filter(p => p.id !== deleteId));
      setDeleteId(null);
      showToast('Programme supprimé définitivement');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const getStatutBadge = (statut: Programme['statut']) => {
    const styles = {
      Actif: 'bg-green-500/10 text-green-500',
      'En attente': 'bg-amber-500/10 text-amber-500',
      Archivé: 'bg-black/10 dark:bg-white/10 opacity-50 text-[var(--text)]'
    };
    return `px-2 py-0.5 rounded text-[10px] font-black uppercase ${styles[statut]}`;
  };

  // Icône et couleur adaptées au type de formation
  const getTypeFormationBadge = (type: TypeFormation) => {
    switch (type) {
      case 'Initiale':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 font-bold rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <GraduationCap size={11} /> Initiale (Lun - Ven)
          </span>
        );
      case 'Continue':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 font-bold rounded-md bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Clock size={11} /> Continue (Samedi)
          </span>
        );
      case 'En ligne':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 font-bold rounded-md bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <Laptop size={11} /> E-learning / En ligne
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-500">
          <CheckCircle size={15} /> {toastMessage}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Programmes & Cursus</h1>
          <p className="text-xs opacity-45 mt-1">Gérez l'ingénierie pédagogique par rythme d'étude (Initiale, Continue, En ligne)</p>
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition hover:opacity-90 self-start sm:self-center" style={{ backgroundColor: 'var(--primary)' }}>
          <Plus size={14} /> Nouveau Programme
        </button>
      </div>

      {/* Barre de Recherche et Filtres d'Administration */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <Search size={14} className="opacity-40 shrink-0" />
          <input
            type="text" placeholder="Rechercher par titre de parcours ou année..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {/* Sélecteur de rythme / type */}
          <select value={filtreType} onChange={e => setFiltreType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none flex-1 md:w-48" style={inputStyle}>
            <option value="">Tous les rythmes</option>
            <option value="Initiale">Formation Initiale</option>
            <option value="Continue">Formation Continue</option>
            <option value="En ligne">Formation En Ligne</option>
          </select>

          {/* Sélecteur de filière */}
          <select value={filtreFiliere} onChange={e => setFiltreFiliere(e.target.value)}
            className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none flex-1 md:w-48" style={inputStyle}>
            <option value="">Toutes les filières</option>
            {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* Liste des Programmes par Cartes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center opacity-40 text-xs border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
            Aucun parcours ou programme enregistré pour ces critères.
          </div>
        ) : (
          filtered.map(p => (
            <div key={p.id} className="p-5 rounded-2xl border flex flex-col justify-between space-y-4 animate-in fade-in zoom-in-95 duration-150" style={cardStyle}>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-500/10 text-blue-500">{p.niveau}</span>
                      <span className="text-xs font-bold opacity-75">{p.filiere}</span>
                      <span className="text-[10px] font-mono opacity-40">• {p.anneeAcademique}</span>
                    </div>
                    <h3 className="font-black text-sm tracking-tight leading-snug pt-0.5">{p.titre}</h3>
                  </div>
                  <span className={getStatutBadge(p.statut)}>{p.statut}</span>
                </div>

                {/* Insertion visuelle du rythme d'étude */}
                <div className="flex pt-0.5">
                  {getTypeFormationBadge(p.typeFormation)}
                </div>

                {/* Répartition de la charge horaire */}
                <div className="grid grid-cols-3 gap-2 bg-black/5 dark:bg-white/5 p-2.5 rounded-xl text-[11px]">
                  <div>
                    <p className="opacity-40 text-[10px] font-bold uppercase">Théorie (CM)</p>
                    <p className="font-bold mt-0.5">{p.heuresTheoriques}h</p>
                  </div>
                  <div>
                    <p className="opacity-40 text-[10px] font-bold uppercase">Pratique (TP)</p>
                    <p className="font-bold mt-0.5">{p.heuresPratiques}h</p>
                  </div>
                  <div>
                    <p className="opacity-40 text-[10px] font-bold uppercase font-black text-blue-500">Total Global</p>
                    <p className="font-black text-blue-500 mt-0.5">{p.heuresTheoriques + p.heuresPratiques}h</p>
                  </div>
                </div>
              </div>

              {/* Actions de pied de page */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[10px] opacity-45 flex items-center gap-1"><Calendar size={11} /> ETEC Management</span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg border text-amber-500 transition hover:bg-amber-500/5" style={{ borderColor: 'var(--border)' }}>
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg border text-red-500 transition hover:bg-red-500/5" style={{ borderColor: 'var(--border)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Formulaire (Ajout / Édition) */}
      {modalMode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black">{modalMode === 'add' ? '➕ Nouveau Plan de Programme' : '✏️ Modifier la Maquette'}</h2>
              <button onClick={() => setModalMode(null)} className="p-1.5 rounded-lg hover:opacity-70"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Intitulé / Titre du Programme</label>
                <input name="titre" value={form.titre} onChange={handleChange} placeholder="ex: Génie Logiciel avancé et Intégration IA" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Filière</label>
                  <select name="filiere" value={form.filiere} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Niveau d'Étude</label>
                  <select name="niveau" value={form.niveau} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              {/* AJOUT : Sélection du Type de Formation dans le Formulaire Admin */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Rythme / Type de Formation</label>
                <select name="typeFormation" value={form.typeFormation} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                  {TYPES_FORMATION.map(type => (
                    <option key={type} value={type}>
                      {type === 'Initiale' && 'Formation Initiale (En semaine, cours en présentiel)'}
                      {type === 'Continue' && 'Formation Continue (Samedi intensif / Professionnels)'}
                      {type === 'En ligne' && 'Formation En Ligne (Distanciel / E-learning)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Année Académique</label>
                  <input name="anneeAcademique" value={form.anneeAcademique} onChange={handleChange} placeholder="ex: 2025-2026" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Statut initial</label>
                  <select name="statut" value={form.statut} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Heures Cours Théoriques (CM)</label>
                  <input type="number" name="heuresTheoriques" value={form.heuresTheoriques} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Heures Travaux Pratiques (TP)</label>
                  <input type="number" name="heuresPratiques" value={form.heuresPratiques} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-xl font-bold border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}><Save size={13} /> Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertCircle size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black">Confirmer la suppression ?</h2>
              <p className="text-xs opacity-55">La suppression de ce cursus effacera la configuration horaire ainsi que les filtres d'emploi du temps associés pour cette année académique.</p>
            </div>
            <div className="flex gap-3 justify-center text-xs">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl text-white bg-red-500 font-bold">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}