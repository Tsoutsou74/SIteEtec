import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';

import {
  Plus, Pencil, Trash2, X, Save,
  Clock, MapPin, GraduationCap, CheckCircle, Loader2, AlertTriangle
} from 'lucide-react';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:00', '10:00', '14:00', '16:00'];
const ENSEIGNANTS = ['Dr. ANDRIA', 'Mme RASOA', 'M. RAKOTO', 'Mme MIORA'];

interface CoursEnseignant {
  id: number;
  enseignant: string;
  jour: string;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  filiere: string;
  niveau: string;
  salle: string;
}

const EMPTY_FORM = {
  enseignant: 'Dr. ANDRIA', jour: 'Lundi', heureDebut: '08:00', heureFin: '',
  matiere: '', filiere: '', niveau: '', salle: ''
};

export default function EmploisDTemps() {
  const { darkMode } = useTheme();
  const [data, setData] = useState<CoursEnseignant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedEnseignant, setSelectedEnseignant] = useState<string>('Dr. ANDRIA');

  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<CoursEnseignant | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);

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

  // ── Chargement initial depuis l'API ────────────────────
  useEffect(() => {
    fetchCours();
  }, []);

  const fetchCours = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const mockData: CoursEnseignant[] = [
        { id: 1, enseignant: 'Dr. ANDRIA', jour: 'Lundi', heureDebut: '08:00', heureFin: '10:00', matiere: 'Algorithmique', filiere: 'Informatique', niveau: 'L1', salle: 'Amphi A' },
      ];
      setData(mockData);
    } catch (err) {
      console.error(err);
      setLoadError("Impossible de charger l'emploi du temps.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentSlots = data.filter(e => e.enseignant === selectedEnseignant);

  const openAdd = (jour: string, heure: string) => {
    setForm({ ...EMPTY_FORM, enseignant: selectedEnseignant, jour, heureDebut: heure });
    setModalMode('add');
  };

  const openEdit = (e: CoursEnseignant) => {
    const { id, ...rest } = e;
    setForm(rest);
    setSelected(e);
    setModalMode('edit');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      if (modalMode === 'add') {
        const newCours: CoursEnseignant = { id: Date.now(), ...form };
        setData(prev => [...prev, newCours]);
      } else if (modalMode === 'edit' && selected) {
        const updated: CoursEnseignant = { ...selected, ...form };
        setData(prev => prev.map(e => e.id === selected.id ? updated : e));
      }
      setModalMode(null);
      showToast();
      setIsSaving(false);
    }, 500);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    const idToDelete = deleteId;
    setIsDeleting(true);
    setTimeout(() => {
      setData(prev => prev.filter(e => e.id !== idToDelete));
      setDeleteId(null);
      showToast();
      setIsDeleting(false);
    }, 500);
  };

  const showToast = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  // ─── États de chargement / erreur ────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 gap-2 opacity-60">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-xs font-bold">Chargement de l'emploi du temps...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-12 text-center border border-dashed rounded-2xl opacity-70" style={{ borderColor: 'var(--border)' }}>
        <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-xs font-bold mb-3">{loadError}</p>
        <button
          onClick={fetchCours}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {saved && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-500">
          <CheckCircle size={15} /> Emploi du temps enseignant mis à jour
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Emploi du temps · Enseignants</h1>
          <p className="text-xs opacity-45 mt-1">Gestion des charges horaires des professeurs</p>
        </div>
      </div>

      {/* Sélection de l'enseignant */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={selectedEnseignant} onChange={e => setSelectedEnseignant(e.target.value)}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none w-full sm:w-72" style={inputStyle}>
          {ENSEIGNANTS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Grille */}
      <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
        <div className="overflow-x-auto">
          <div className="min-w-[900px] grid grid-cols-7 gap-px bg-[var(--border)]">
            <div className="p-3 font-bold text-center opacity-50 bg-[var(--card)] text-xs">Heures</div>
            {JOURS.map(j => <div key={j} className="p-3 font-bold text-center opacity-70 bg-[var(--card)] text-xs">{j}</div>)}

            {HEURES.map(heure => (
              <React.Fragment key={heure}>
                <div className="p-4 flex items-center justify-center font-bold text-xs bg-[var(--card)] border-b border-[var(--border)]"><Clock size={12} className="mr-1 opacity-50" /> {heure}</div>
                {JOURS.map(jour => {
                  const cours = currentSlots.find(c => c.jour === jour && c.heureDebut === heure);
                  return (
                    <div key={`${jour}-${heure}`} className="p-2 min-h-[110px] bg-[var(--card)] transition hover:bg-black/5 flex flex-col justify-between group border-b border-r border-[var(--border)]">
                      {cours ? (
                        <div className="p-2 rounded-xl h-full flex flex-col justify-between text-[11px] bg-purple-500/10 text-purple-500 border border-purple-500/20">
                          <div>
                            <p className="font-black leading-tight line-clamp-2">{cours.matiere}</p>
                            <p className="opacity-75 mt-0.5 flex items-center gap-0.5"><GraduationCap size={10} /> {cours.filiere} {cours.niveau}</p>
                            <p className="opacity-60 mt-0.5 flex items-center gap-0.5 font-mono text-[10px]"><Clock size={10} /> jusqu'à {cours.heureFin}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-purple-500/10">
                            <span className="font-mono opacity-90 flex items-center gap-0.5"><MapPin size={10} /> {cours.salle}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(cours)} className="p-1 rounded bg-[var(--card)] border border-[var(--border)] text-amber-500"><Pencil size={10} /></button>
                              <button onClick={() => setDeleteId(cours.id)} className="p-1 rounded bg-[var(--card)] border border-[var(--border)] text-red-500"><Trash2 size={10} /></button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => openAdd(jour, heure)} className="w-full h-full rounded-xl border border-dashed border-[var(--border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs gap-1 text-[var(--text)]">
                          <Plus size={12} /> Assigner
                        </button>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Formulaire */}
      {modalMode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black">{modalMode === 'add' ? '➕ Assigner un cours' : '✏️ Modifier l\'affectation'}</h2>
              <button onClick={() => setModalMode(null)} className="p-1.5 rounded-lg hover:opacity-70"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Matière</label>
                <input name="matiere" value={form.matiere} onChange={handleChange} placeholder="ex: Architecture Système" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Filière</label>
                  <input name="filiere" value={form.filiere} onChange={handleChange} placeholder="ex: Génie Logiciel" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Niveau</label>
                  <input name="niveau" value={form.niveau} onChange={handleChange} placeholder="ex: M1" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Salle de classe</label>
                <input name="salle" value={form.salle} onChange={handleChange} placeholder="ex: Amphi Principal" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Heure de début</label>
                  <input type="time" name="heureDebut" value={form.heureDebut} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none font-mono" style={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Heure de fin</label>
                  <input type="time" name="heureFin" value={form.heureFin} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none font-mono" style={inputStyle} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-xl font-bold border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: 'var(--primary)' }}>
                {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto"><Trash2 size={20} /></div>
            <div>
              <h2 className="text-sm font-black">Libérer ce créneau ?</h2>
              <p className="text-xs opacity-55">L'enseignant n'aura plus ce cours planifié à cette heure.</p>
            </div>
            <div className="flex gap-3 justify-center text-xs">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 rounded-xl text-white bg-red-500 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                {isDeleting ? <Loader2 size={13} className="animate-spin" /> : null} Libérer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
