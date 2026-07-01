import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import {
  Search, Plus, Pencil, Trash2, X, Save,
  BookOpen, Award, Clock, CheckCircle, Layers, ShieldAlert
} from 'lucide-react';

interface Module {
  id: number;
  code: string;       // ex: UE-GL301
  nom: string;        // ex: Architecture & Qualité Logicielle
  filiere: string;    // ex: Génie Logiciel
  semestre: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';
  credits: number;    // Nombre de crédits ECTS
  volumeHoraire: number; // Volume horaire global (ex: 60)
}

const INITIAL_MODULES: Module[] = [
  { id: 1, code: 'UE-GL301', nom: 'Développement Full-Stack & DevOps', filiere: 'Génie Logiciel', semestre: 'S5', credits: 6, volumeHoraire: 60 },
  { id: 2, code: 'UE-GL302', nom: 'Architectures Distribuées & Cloud', filiere: 'Génie Logiciel', semestre: 'S5', credits: 5, volumeHoraire: 45 },
  { id: 3, code: 'UE-ADM401', nom: 'Management Stratégique & RH', filiere: 'Administration', semestre: 'S1', credits: 4, volumeHoraire: 40 },
  { id: 4, code: 'UE-BTP203', nom: 'Résistance des Matériaux & Structures', filiere: 'BTP', semestre: 'S3', credits: 6, volumeHoraire: 50 },
];

const SEMESTRES = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
const FILIERES = ['Génie Logiciel', 'Administration', 'BTP', 'Électromécanique'];

const EMPTY_FORM = {
  code: '', nom: '', filiere: 'Génie Logiciel', semestre: 'S1' as Module['semestre'], credits: 4, volumeHoraire: 45
};

export default function Modules() {
  const { darkMode } = useTheme();
  const [data, setData] = useState<Module[]>(INITIAL_MODULES);
  const [search, setSearch] = useState('');
  const [filtreFiliere, setFiltreFiliere] = useState('');

  // États CRUD
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Module | null>(null);
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

  // ── Filtrage ────────────────────────────────────────────
  const filtered = data.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = m.nom.toLowerCase().includes(q) || m.code.toLowerCase().includes(q);
    const matchFiliere = filtreFiliere ? m.filiere === filtreFiliere : true;
    return matchSearch && matchFiliere;
  });

  // ── Actions CRUD ────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModalMode('add');
  };

  const openEdit = (m: Module) => {
    const { id, ...rest } = m;
    setForm(rest);
    setSelected(m);
    setModalMode('edit');
  };

  const handleSave = () => {
    if (!form.code || !form.nom) {
      showToast('Veuillez renseigner le code et le libellé de l\'UE.');
      return;
    }

    if (modalMode === 'add') {
      const newId = data.length > 0 ? Math.max(...data.map(m => m.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
      showToast('Module d\'enseignement ajouté');
    } else if (modalMode === 'edit' && selected) {
      setData(data.map(m => m.id === selected.id ? { ...m, ...form } : m));
      showToast('Module mis à jour avec succès');
    }
    setModalMode(null);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setData(data.filter(m => m.id !== deleteId));
      setDeleteId(null);
      showToast('Module supprimé définitivement');
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
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Modules & Unités d'Enseignement</h1>
          <p className="text-xs opacity-45 mt-1">Gérez le catalogue des modules, coefficients et volumes horaires</p>
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition hover:opacity-90 self-start sm:self-center" style={{ backgroundColor: 'var(--primary)' }}>
          <Plus size={14} /> Nouveau Module
        </button>
      </div>

      {/* Recherche et Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <Search size={14} className="opacity-40 shrink-0" />
          <input
            type="text" placeholder="Rechercher par code ou libellé d'UE..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
          />
        </div>
        <select value={filtreFiliere} onChange={e => setFiltreFiliere(e.target.value)}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none sm:w-56" style={inputStyle}>
          <option value="">Toutes les filières</option>
          {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Tableau / Liste scannable des Modules */}
      <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Code UE', 'Libellé / Module', 'Filière & Semestre', 'Crédits', 'Volume Horaire', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center opacity-40">Aucun module dans cette section</td>
                </tr>
              ) : filtered.map(m => (
                <tr key={m.id} className="border-b transition hover:opacity-90" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3.5 font-mono font-black text-blue-500">{m.code}</td>
                  <td className="px-4 py-3.5 font-bold tracking-tight">{m.nom}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="opacity-75">{m.filiere}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/5 dark:bg-white/5 opacity-60">{m.semestre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-emerald-500/10 text-emerald-500 w-fit">
                      <Award size={11} /> {m.credits} ECTS
                    </span>
                  </td>
                  <td className="px-4 py-3.5 opacity-75 font-medium flex items-center gap-1 mt-1.5">
                    <Clock size={12} className="opacity-45" /> {m.volumeHoraire} heures
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg border text-amber-500 transition hover:bg-amber-500/5" style={{ borderColor: 'var(--border)' }}>
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded-lg border text-red-500 transition hover:bg-red-500/5" style={{ borderColor: 'var(--border)' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulaire (Ajout / Modification) */}
      {modalMode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black">{modalMode === 'add' ? '➕ Ajouter un Module (UE)' : '✏️ Éditer l\'UE'}</h2>
              <button onClick={() => setModalMode(null)} className="p-1.5 rounded-lg hover:opacity-70"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Code UE</label>
                  <input name="code" value={form.code} onChange={handleChange} placeholder="ex: UE-GL301" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none font-mono uppercase" style={inputStyle} />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Libellé du Module</label>
                  <input name="nom" value={form.nom} onChange={handleChange} placeholder="ex: Architecture Système & Cloud" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Filière concernée</label>
                  <select name="filiere" value={form.filiere} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Semestre</label>
                  <select name="semestre" value={form.semestre} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {SEMESTRES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Crédits (ECTS)</label>
                  <input type="number" name="credits" value={form.credits} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Volume Horaire (h)</label>
                  <input type="number" name="volumeHoraire" value={form.volumeHoraire} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
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

      {/* Modal Suppression */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black">Supprimer cette UE ?</h2>
              <p className="text-xs opacity-55">Retirer ce module impactera l'affichage des notes et des coefficients liés à cette Unité.</p>
            </div>
            <div className="flex gap-3 justify-center text-xs">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl text-white bg-red-500 font-bold">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}