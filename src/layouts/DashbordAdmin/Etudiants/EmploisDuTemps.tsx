import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import {
  Search, Plus, Eye, Pencil, Trash2, X, Save,
  Calendar, Clock, BookOpen, MapPin, User, CheckCircle
} from 'lucide-react';

type Filiere = 'Génie Logiciel' | 'Administration' | 'BTP' | 'Électromécanique';
const FILIERES: Filiere[] = ['Génie Logiciel', 'Administration', 'BTP', 'Électromécanique'];
const NIVEAUX = ['L1', 'L2', 'L3', 'M1', 'M2'];
const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HEURES = ['08:00', '10:00', '14:00', '16:00'];

interface CoursEtudiant {
  id: number;
  filiere: Filiere;
  niveau: string;
  jour: string;
  heureDebut: string;
  matiere: string;
  enseignant: string;
  salle: string;
  annee: string;
}

const INITIAL_COURS: CoursEtudiant[] = [
  { id: 1, filiere: 'Génie Logiciel', niveau: 'L3', jour: 'Lundi', heureDebut: '08:00', matiere: 'Développement Full-Stack', enseignant: 'M. RAKOTO', salle: 'Salle Lab 4', annee: '2026–2027' },
  { id: 2, filiere: 'Génie Logiciel', niveau: 'L3', jour: 'Mercredi', heureDebut: '14:00', matiere: 'Architecture Microservices', enseignant: 'Mme RASOA', salle: 'Amphi A', annee: '2026–2027' },
];

const EMPTY_FORM = {
  filiere: 'Génie Logiciel' as Filiere, niveau: 'L1', jour: 'Lundi',
  heureDebut: '08:00', matiere: '', enseignant: '', salle: '', annee: '2026–2027'
};

export default function AdminEmploisDuTempsEtudiants() {
  const { darkMode } = useTheme();
  const [data, setData] = useState<CoursEtudiant[]>(INITIAL_COURS);
  const [filtreFiliere, setFiltreFiliere] = useState<Filiere>('Génie Logiciel');
  const [filtreNiveau, setFiltreNiveau] = useState<string>('L3');

  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<CoursEtudiant | null>(null);
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

  const currentSlots = data.filter(e => e.filiere === filtreFiliere && e.niveau === filtreNiveau);

  const openAdd = (jour: string, heure: string) => {
    setForm({ ...EMPTY_FORM, filiere: filtreFiliere, niveau: filtreNiveau, jour, heureDebut: heure });
    setModalMode('add');
  };

  const openEdit = (e: CoursEtudiant) => {
    const { id, ...rest } = e;
    setForm(rest);
    setSelected(e);
    setModalMode('edit');
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newId = data.length > 0 ? Math.max(...data.map(e => e.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    } else if (modalMode === 'edit' && selected) {
      setData(data.map(e => e.id === selected.id ? { ...e, ...form } : e));
    }
    setModalMode(null);
    showToast();
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setData(data.filter(e => e.id !== deleteId));
      setDeleteId(null);
      showToast();
    }
  };

  const showToast = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="space-y-5">
      {saved && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-500">
          <CheckCircle size={15} /> Emploi du temps mis à jour
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Emploi du temps · Étudiants</h1>
          <p className="text-xs opacity-45 mt-1">Planification des cours par classe</p>
        </div>
      </div>

      {/* Sélection de la classe */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={filtreFiliere} onChange={e => setFiltreFiliere(e.target.value as Filiere)}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none" style={inputStyle}>
          {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={filtreNiveau} onChange={e => setFiltreNiveau(e.target.value)}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none" style={inputStyle}>
          {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* Grille de l'emploi du temps */}
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
                        <div className="p-2 rounded-xl h-full flex flex-col justify-between text-[11px] bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          <div>
                            <p className="font-black leading-tight line-clamp-2">{cours.matiere}</p>
                            <p className="opacity-75 mt-0.5 flex items-center gap-0.5"><User size={10} /> {cours.enseignant}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-blue-500/10">
                            <span className="font-mono opacity-90 flex items-center gap-0.5"><MapPin size={10} /> {cours.salle}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(cours)} className="p-1 rounded bg-[var(--card)] border border-[var(--border)] text-amber-500"><Pencil size={10} /></button>
                              <button onClick={() => setDeleteId(cours.id)} className="p-1 rounded bg-[var(--card)] border border-[var(--border)] text-red-500"><Trash2 size={10} /></button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => openAdd(jour, heure)} className="w-full h-full rounded-xl border border-dashed border-[var(--border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs gap-1 text-[var(--text)]">
                          <Plus size={12} /> Ajouter
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
              <h2 className="text-sm font-black">{modalMode === 'add' ? '➕ Ajouter un cours' : '✏️ Modifier le cours'}</h2>
              <button onClick={() => setModalMode(null)} className="p-1.5 rounded-lg hover:opacity-70"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Nom de la Matière</label>
                <input name="matiere" value={form.matiere} onChange={handleChange} placeholder="ex: Programmation Web" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Enseignant</label>
                <input name="enseignant" value={form.enseignant} onChange={handleChange} placeholder="ex: Dr. ANDRIA" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Salle</label>
                  <input name="salle" value={form.salle} onChange={handleChange} placeholder="ex: Salle 102" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Année Académique</label>
                  <input name="annee" value={form.annee} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
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
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto"><Trash2 size={20} /></div>
            <div>
              <h2 className="text-sm font-black">Retirer ce cours ?</h2>
              <p className="text-xs opacity-55">Ce créneau horaire redeviendra libre.</p>
            </div>
            <div className="flex gap-3 justify-center text-xs">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl text-white bg-red-500">Retirer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}