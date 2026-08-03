import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

import {
  Search, Plus, Pencil, Trash2, X, Save,
  Calendar, CheckCircle, AlertCircle, Image, Loader2, Upload
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────
export type CategorieActualite = 'Événement' | 'Flash Info' | 'Pédagogie' | 'Vie Étudiante';

interface Actualite {
  id: number;
  titre: string;
  categorie: CategorieActualite;
  datePublication: string;
  contenu: string;  
  imageUrl: string;
  statut: 'Publié' | 'Brouillon' | 'Archivé';
  important: boolean;
}

const CATEGORIES: CategorieActualite[] = ['Événement', 'Flash Info', 'Pédagogie', 'Vie Étudiante'];
const STATUTS: Actualite['statut'][] = ['Publié', 'Brouillon', 'Archivé'];

const EMPTY_FORM = {
  titre: '',
  categorie: 'Événement' as CategorieActualite,
  datePublication: new Date().toISOString().split('T')[0],
  contenu: '',
  imageUrl: '', 
  imageFile: null as File | null,
  statut: 'Brouillon' as Actualite['statut'],
  important: false
};

export default function Actualites() {
  const { darkMode } = useTheme();
  const [data, setData] = useState<Actualite[]>([]);
  const [search, setSearch] = useState('');
  const [filtreCategorie, setFiltreCategorie] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // États CRUD
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Actualite | null>(null);
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

  // ── Chargement depuis l'API ──────────────────────────────
  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    setIsLoading(true);
    try {
      const mockData: Actualite[] = [
        {
          id: 1,
          titre: 'Cérémonie de remise des diplômes',
          categorie: 'Événement',
          datePublication: '2026-07-25',
          contenu: 'La cérémonie de remise des diplômes pour la promotion 2026 aura lieu ce vendredi à l\'auditorium principal.',
          imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94',
          statut: 'Publié',
          important: true
        },
        {
          id: 2,
          titre: 'Nouveaux modules d\'IA',
          categorie: 'Pédagogie',
          datePublication: '2026-07-28',
          contenu: 'De nouveaux modules sur l\'Intelligence Artificielle générative ont été ajoutés au programme de Master 1.',
          imageUrl: '',
          statut: 'Publié',
          important: false
        },
        {
          id: 3,
          titre: 'Fermeture de la bibliothèque',
          categorie: 'Flash Info',
          datePublication: '2026-07-30',
          contenu: 'La bibliothèque universitaire sera fermée pour inventaire le week-end prochain.',
          imageUrl: '',
          statut: 'Brouillon',
          important: false
        }
      ];
      setData(mockData);
    } catch (err) {
      console.error("Erreur de chargement des actualités:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Filtrage ────────────────────────────────────────────
  const filtered = data.filter(act => {
    const q = search.toLowerCase();
    const matchSearch = act.titre.toLowerCase().includes(q) || act.contenu.toLowerCase().includes(q);
    const matchCategorie = filtreCategorie ? act.categorie === filtreCategorie : true;
    return matchSearch && matchCategorie;
  });

  // ── Actions CRUD ────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModalMode('add');
  };

  const openEdit = (act: Actualite) => {
    const { id, ...rest } = act;
    setForm({ ...rest, imageFile: null });
    setSelected(act);
    setModalMode('edit');
  };

  const handleSave = async () => {
    if (!form.titre || !form.contenu) {
      showToast("Veuillez renseigner le titre et le contenu de l'article.");
      return;
    }

    try {
      if (modalMode === 'add') {
        const newId = Date.now();
        setData([{ id: newId, ...form }, ...data]);
        showToast('Actualité créée avec succès');
      } else if (modalMode === 'edit' && selected) {
        setData(data.map(p => p.id === selected.id ? { ...p, ...form } : p));
        showToast('Actualité mise à jour');
      }
      setModalMode(null);
    } catch (err) {
      console.error("Erreur d'enregistrement:", err);
      showToast("Erreur lors de la sauvegarde.");
    }
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      const idToDelete = deleteId;
      setData(data.filter(p => p.id !== idToDelete));
      setDeleteId(null);
      showToast('Article supprimé définitivement');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm({ ...form, imageUrl: previewUrl, imageFile: file });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const getStatutBadge = (statut: Actualite['statut']) => {
    const styles = {
      Publié: 'bg-green-500/10 text-green-500 border-green-500/20',
      Brouillon: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      Archivé: 'bg-black/10 dark:bg-white/10 opacity-50 text-[var(--text)] border-transparent'
    };
    return `px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${styles[statut]}`;
  };

  const getCategorieBadge = (cat: CategorieActualite) => {
    const styles = {
      'Événement': 'bg-blue-500/10 text-blue-500',
      'Flash Info': 'bg-red-500/10 text-red-500',
      'Pédagogie': 'bg-purple-500/10 text-purple-500',
      'Vie Étudiante': 'bg-cyan-500/10 text-cyan-500'
    };
    return `px-2 py-0.5 rounded text-[10px] font-bold ${styles[cat]}`;
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-500">
          <CheckCircle size={15} /> {toastMessage}
        </div>
      )}

      {/* En-tête de section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Portail Actualités & Campus</h1>
          <p className="text-xs opacity-45 mt-1">Publiez les événements, notes administratives et flash infos pour l'université</p>
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition hover:opacity-90 self-start sm:self-center cursor-pointer" style={{ backgroundColor: 'var(--primary)' }}>
          <Plus size={14} /> Publier un article
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <Search size={14} className="opacity-40 shrink-0" />
          <input
            type="text" placeholder="Rechercher par mot-clé dans le titre ou le contenu..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
          />
        </div>
         
        <div className="w-full md:w-56">
          <select value={filtreCategorie} onChange={e => setFiltreCategorie(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none" style={inputStyle}>
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Grille de cartes */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 gap-2 opacity-50 text-xs">
          <Loader2 size={16} className="animate-spin" /> Chargement des articles...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center opacity-40 text-xs border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
              Aucun article d'actualité ne correspond à vos critères.
            </div>
          ) : (
            filtered.map(act => (
              <div key={act.id} className="rounded-2xl border overflow-hidden flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150 relative" style={cardStyle}>
                 
                {act.important && (
                  <span className="absolute top-3 left-3 z-10 px-2 py-0.5 text-[9px] font-black tracking-wider text-white bg-red-500 rounded-md uppercase shadow-lg">
                    🚨 Crucial
                  </span>
                )}

                <div className="h-44 w-full relative bg-black/10 overflow-hidden shrink-0">
                  {act.imageUrl ? (
                    <img src={act.imageUrl} alt={act.titre} className="w-full h-full object-cover transition duration-300 hover:scale-105" onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=60';
                    }} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                      <Image size={24} />
                      <span className="text-[10px] mt-1">Aucun média</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={getCategorieBadge(act.categorie)}>{act.categorie}</span>
                      <span className={getStatutBadge(act.statut)}>{act.statut}</span>
                    </div>

                    <h3 className="font-black text-xs md:text-sm tracking-tight leading-snug line-clamp-2" title={act.titre}>
                      {act.titre}
                    </h3>
                     
                    <p className="text-[11px] opacity-60 line-clamp-3 leading-relaxed">
                      {act.contenu}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-[11px]" style={{ borderColor: 'var(--border)' }}>
                    <span className="opacity-45 flex items-center gap-1 font-mono">
                      <Calendar size={11} /> {act.datePublication}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(act)} className="p-1.5 rounded-lg border text-amber-500 transition hover:bg-amber-500/5 cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                        <Pencil size={11} />
                      </button>
                      <button onClick={() => setDeleteId(act.id)} className="p-1.5 rounded-lg border text-red-500 transition hover:bg-red-500/5 cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Formulaire (Création / Modification) */}
      {modalMode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black">{modalMode === 'add' ? '📣 Rédiger une Actualité' : '✏️ Éditer la publication'}</h2>
              <button onClick={() => setModalMode(null)} className="p-1.5 rounded-lg hover:opacity-70 cursor-pointer"><X size={16} /></button>
            </div>
             
            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Titre de l'actualité</label>
                <input name="titre" value={form.titre} onChange={handleChange} placeholder="ex: Cérémonie de remise des diplômes Promotion 2026" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Catégorie</label>
                  <select name="categorie" value={form.categorie} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">État du document</label>
                  <select name="statut" value={form.statut} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                  <Upload size={12} /> Illustration de l'article (Fichier local)
                </label>
                 
                <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition" style={{ borderColor: 'var(--border)' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="Prévisualisation" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center p-4 opacity-50">
                      <Upload size={20} className="mx-auto mb-1" />
                      <span className="font-bold block text-[11px]">Parcourir l'ordinateur</span>
                      <span className="text-[9px]">PNG, JPG ou WEBP</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Date d'affichage</label>
                  <input type="date" name="datePublication" value={form.datePublication} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
                <label className="flex items-center gap-2 mt-5 p-2.5 rounded-xl border cursor-pointer select-none" style={{ borderColor: 'var(--border)' }}>
                  <input type="checkbox" name="important" checked={form.important} onChange={handleCheckboxChange} className="w-4 h-4 accent-red-500 cursor-pointer" />
                  <div>
                    <p className="font-bold text-[11px]">Épingler à l'accueil</p>
                    <p className="text-[9px] opacity-45">Marquer comme alerte majeure</p>
                  </div>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Corps de l'article (Texte de l'actualité)</label>
                <textarea name="contenu" value={form.contenu} onChange={handleChange} rows={4} placeholder="Saisissez les détails complets de l'information..." className="w-full px-3 py-2.5 rounded-xl border focus:outline-none resize-none leading-relaxed" style={inputStyle} />
              </div>
            </div>
             
            <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-xl font-bold border cursor-pointer" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white cursor-pointer" style={{ backgroundColor: 'var(--primary)' }}><Save size={13} /> Mettre en ligne</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation de Suppression */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertCircle size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black">Supprimer cette publication ?</h2>
              <p className="text-xs opacity-55">Cet article sera définitivement retiré du flux d'actualités.</p>
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
