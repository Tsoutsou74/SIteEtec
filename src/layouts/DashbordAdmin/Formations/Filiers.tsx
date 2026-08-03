import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import {
  Search, Plus, Pencil, Trash2, X, Save,
  BookOpen, Layers, Users, CheckCircle, GraduationCap
} from 'lucide-react';
import ApiService from '../../../services/ApiService'; // Ajuste le chemin selon ton projet

interface Filiere {
  id: number;
  code: string; // ex: GL, ADM, BTP
  nom: string;  // ex: Génie Logiciel
  responsable: string;
  description: string;
  nombreEtudiants: number;
}

const EMPTY_FORM = {
  code: '', nom: '', responsable: '', description: '', nombreEtudiants: 0
};

const DEMO_FILIERES: Filiere[] = [
  { id: 1, code: 'GL', nom: 'GÃ©nie Logiciel', responsable: 'Dr. Rakoto', description: 'Conception et dÃ©veloppement de solutions numÃ©riques.', nombreEtudiants: 286 },
  { id: 2, code: 'ADM', nom: 'Administration', responsable: 'Mme. Rasoa', description: 'Management, gestion et pilotage des organisations.', nombreEtudiants: 214 },
  { id: 3, code: 'BTP', nom: 'BÃ¢timent et Travaux Publics', responsable: 'M. Andrianina', description: 'Formation pratique aux mÃ©tiers de la construction.', nombreEtudiants: 178 },
  { id: 4, code: 'ES', nom: 'Ã‰lectromÃ©canique', responsable: 'Dr. Martin', description: 'SystÃ¨mes Ã©lectriques, mÃ©caniques et automatisÃ©s.', nombreEtudiants: 142 },
];

export default function Filieres() {
  const { darkMode } = useTheme();
  const [data, setData] = useState<Filiere[]>(DEMO_FILIERES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // États pour le CRUD
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Filiere | null>(null);
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

  // ── Chargement des données ──────────────────────────────
  const fetchFilieres = async () => {
    setLoading(true);
    try {
      const response = await ApiService.filieres.getAll();
      if (response && response.data) {
        const mappedData = response.data.map((item: any) => ({
          id: Number(item.id),
          code: item.code || '',
          nom: item.nom || item.name || '',
          responsable: item.responsable || '',
          description: item.description || '',
          nombreEtudiants: Number(item.nombreEtudiants || 0)
        }));
        if (mappedData.length > 0) setData(mappedData);
      }
    } catch (error) {
      console.error("Erreur de récupération des filières :", error);
      showToast('Erreur lors du chargement des filières.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilieres();
  }, []);

  // ── Filtrage ────────────────────────────────────────────
  const filtered = data.filter(f => 
    f.nom.toLowerCase().includes(search.toLowerCase()) || 
    f.code.toLowerCase().includes(search.toLowerCase()) ||
    f.responsable.toLowerCase().includes(search.toLowerCase())
  );

  // ── Actions CRUD ────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModalMode('add');
  };

  const openEdit = (filiere: Filiere) => {
    const { id, ...rest } = filiere;
    setForm(rest);
    setSelected(filiere);
    setModalMode('edit');
  };

  const handleSave = async () => {
    if (!form.code || !form.nom) {
      showToast('Veuillez remplir au moins le code et le nom.');
      return;
    }

    try {
      if (modalMode === 'add') {
        const response = await ApiService.filieres.create(form);
        const newId = response?.data?.id ? Number(response.data.id) : (data.length > 0 ? Math.max(...data.map(f => f.id)) + 1 : 1);
        setData([...data, { id: newId, ...form }]);
        showToast('Filière ajoutée avec succès');
      } else if (modalMode === 'edit' && selected) {
        await ApiService.filieres.update(selected.id, form);
        setData(data.map(f => f.id === selected.id ? { ...f, ...form } : f));
        showToast('Filière mise à jour');
      }
      setModalMode(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la filière :", error);
      showToast('Une erreur est survenue lors de l’enregistrement.');
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        await ApiService.filieres.delete(deleteId);
        setData(data.filter(f => f.id !== deleteId));
        setDeleteId(null);
        showToast('Filière supprimée');
      } catch (error) {
        console.error("Erreur lors de la suppression de la filière :", error);
        showToast('Impossible de supprimer cette filière.');
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Gestion des Filières</h1>
          <p className="text-xs opacity-45 mt-1">Configurez les départements et les parcours d'études</p>
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition hover:opacity-90 self-start sm:self-center cursor-pointer" style={{ backgroundColor: 'var(--primary)' }}>
          <Plus size={14} /> Nouvelle Filière
        </button>
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
        style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
        <Search size={14} className="opacity-40 shrink-0" />
        <input
          type="text" placeholder="Rechercher une filière (code, nom, responsable)..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
        />
      </div>

      {/* Grille des Filières */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center opacity-40 text-xs border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
            Récupération des filières depuis le serveur...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center opacity-40 text-xs border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
            Aucune filière trouvée.
          </div>
        ) : (
          filtered.map(filiere => (
            <div key={filiere.id} className="p-5 rounded-2xl border flex flex-col justify-between space-y-4" style={cardStyle}>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">
                      {filiere.code}
                    </span>
                    <h3 className="font-black text-sm tracking-tight">{filiere.nom}</h3>
                  </div>
                  
                  {/* Actions d'édition rapides */}
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(filiere)} className="p-1.5 rounded-lg border text-amber-500 transition hover:bg-amber-500/5 cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => setDeleteId(filiere.id)} className="p-1.5 rounded-lg border text-red-500 transition hover:bg-red-500/5 cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] opacity-65 leading-relaxed line-clamp-2">{filiere.description}</p>
              </div>

              {/* Métriques */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t text-[11px] opacity-75" style={{ borderColor: 'var(--border)' }}>
                <span className="flex items-center gap-1"><GraduationCap size={12} className="opacity-50" /> Chef: {filiere.responsable}</span>
                <span className="flex items-center gap-1 justify-end font-medium"><Users size={12} className="opacity-50" /> {filiere.nombreEtudiants} inscrits</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Formulaire (Ajout/Modification) */}
      {modalMode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black">{modalMode === 'add' ? '➕ Créer une filière' : '✏️ Modifier la filière'}</h2>
              <button onClick={() => setModalMode(null)} className="p-1.5 rounded-lg hover:opacity-70 cursor-pointer"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Code</label>
                  <input name="code" value={form.code} onChange={handleChange} placeholder="ex: GL" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none font-mono uppercase" style={inputStyle} />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Nom complet</label>
                  <input name="nom" value={form.nom} onChange={handleChange} placeholder="ex: Génie Logiciel" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Responsable / Chef de Mention</label>
                <input name="responsable" value={form.responsable} onChange={handleChange} placeholder="ex: Dr. ANDRIA" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Objectifs et compétences cibles de la mention..." rows={3} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none resize-none" style={inputStyle} />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-xl font-bold border cursor-pointer" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white cursor-pointer" style={{ backgroundColor: 'var(--primary)' }}><Save size={13} /> Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black">Supprimer cette mention ?</h2>
              <p className="text-xs opacity-55">Cette action retirera la structure de la filière mais ne supprimera pas les étudiants associés.</p>
            </div>
            <div className="flex gap-3 justify-center text-xs">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border cursor-pointer" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl text-white bg-red-500 font-bold cursor-pointer">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
