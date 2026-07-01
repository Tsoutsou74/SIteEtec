import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, Plus, Trash2, Edit2, X, CheckCircle, 
  Calendar, Clock, User, MapPin, BookOpen, GraduationCap, AlertCircle
} from 'lucide-react';

// ── Types pour l'Emploi du Temps ──────────────────────────────
export type JourSemaine = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';

interface SeanceCours {
  id: string;
  matiere: string;
  classe: string; // ex: M1 Génie Logiciel, L2 Réseaux
  enseignant: string;
  salle: string;
  jour: JourSemaine;
  heureDebut: string; // ex: "08:00"
  heureFin: string;   // ex: "10:00"
}

// Données de test initiales réalistes pour ETEC
const INITIAL_SEANCES: SeanceCours[] = [
  {
    id: '1',
    matiere: 'Architecture Spring Boot & API Rest',
    classe: 'M1 Génie Logiciel',
    enseignant: 'Dr. Rakoto',
    salle: 'Salle 102 - Bloc A',
    jour: 'Lundi',
    heureDebut: '08:00',
    heureFin: '11:45'
  },
  {
    id: '2',
    matiere: 'Algorithmique & Structures de Données',
    classe: 'L1 Informatique',
    enseignant: 'M. Randria',
    salle: 'Amphi B',
    jour: 'Mardi',
    heureDebut: '14:00',
    heureFin: '17:30'
  },
  {
    id: '3',
    matiere: 'Gestion financière & Trading Quantitatif',
    classe: 'M2 Management',
    enseignant: 'Mme Razafy',
    salle: 'Labo Info 1',
    jour: 'Mercredi',
    heureDebut: '09:45',
    heureFin: '11:45'
  },
  {
    id: '4',
    matiere: 'Développement Frontend avec React & Vite',
    classe: 'L2 Génie Logiciel',
    enseignant: 'M. Andria',
    salle: 'Salle 204',
    jour: 'Jeudi',
    heureDebut: '08:00',
    heureFin: '11:45'
  }
];

const JOURS: JourSemaine[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const CLASSES_DISPO = ['Tout le campus', 'L1 Informatique', 'L2 Génie Logiciel', 'M1 Génie Logiciel', 'M2 Management', 'Réseaux & Sécurité'];

const EMPTY_FORM: Omit<SeanceCours, 'id'> = {
  matiere: '',
  classe: 'L1 Informatique',
  enseignant: '',
  salle: '',
  jour: 'Lundi',
  heureDebut: '08:00',
  heureFin: '10:00'
};

export default function EmploisDTemps() {
  const { darkMode } = useTheme();
  const [seances, setSeances] = useState<SeanceCours[]>(INITIAL_SEANCES);
  const [filtreClasse, setFiltreClasse] = useState('Tout le campus');

  // États pour le CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SeanceCours, 'id'>>(EMPTY_FORM);
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

  // ── Filtrage selon la classe sélectionnée ─────────────────────
  const filteredSeances = seances.filter(s => 
    filtreClasse === 'Tout le campus' ? true : s.classe === filtreClasse
  );

  // ── Handlers CRUD ──────────────────────────────────────────────
  const handleOpenCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (seance: SeanceCours) => {
    setForm({
      matiere: seance.matiere,
      classe: seance.classe,
      enseignant: seance.enseignant,
      salle: seance.salle,
      jour: seance.jour,
      heureDebut: seance.heureDebut,
      heureFin: seance.heureFin
    });
    setEditingId(seance.id);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.matiere || !form.enseignant || !form.salle) {
      showToast('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (editingId) {
      // UPDATE
      setSeances(seances.map(s => s.id === editingId ? { id: editingId, ...form } : s));
      showToast('Séance de cours mise à jour avec succès');
    } else {
      // CREATE
      const newSeance: SeanceCours = {
        id: Math.random().toString(36).substr(2, 9),
        ...form
      };
      setSeances([...seances, newSeance]);
      showToast('Nouveau cours planifié au calendrier');
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setSeances(seances.filter(s => s.id !== deleteId));
      setDeleteId(null);
      showToast('Cours supprimé de l\'emploi du temps');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-500">
          <CheckCircle size={15} /> {toastMessage}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Gestion des Emplois du Temps</h1>
          <p className="text-xs opacity-45 mt-1">Planifiez les cours, assignez les salles et attribuez les enseignants par filière</p>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition hover:opacity-90 self-start sm:self-center" style={{ backgroundColor: 'var(--primary)' }}>
          <Plus size={14} /> Planifier un cours
        </button>
      </div>

      {/* Barre de sélection de la classe pour filtrer la vue globale */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border" style={cardStyle}>
        <div className="flex items-center gap-2">
          <GraduationCap size={16} className="text-blue-500 shrink-0" />
          <span className="text-xs font-bold">Filtrer l'affichage par promotion :</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CLASSES_DISPO.map(cls => (
            <button
              key={cls} onClick={() => setFiltreClasse(cls)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                filtreClasse === cls 
                  ? 'text-white' 
                  : 'bg-transparent opacity-60 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: filtreClasse === cls ? 'var(--primary)' : 'transparent',
                borderColor: filtreClasse === cls ? 'var(--primary)' : 'var(--border)'
              }}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* ── Vue Calendrier Hebdomadaire Organisé par Jour ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {JOURS.map(jour => {
          const coursDuJour = filteredSeances.filter(s => s.jour === jour)
            .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut));

          return (
            <div key={jour} className="p-4 rounded-2xl border space-y-3 flex flex-col h-full" style={cardStyle}>
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                <span className="font-black text-xs tracking-wide uppercase opacity-75 flex items-center gap-1.5">
                  <Calendar size={13} className="text-blue-500" /> {jour}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold font-mono bg-black/5 dark:bg-white/5 opacity-50">
                  {coursDuJour.length} cours
                </span>
              </div>

              {/* Liste des séances pour ce jour spécifique */}
              <div className="space-y-3 flex-1">
                {coursDuJour.length === 0 ? (
                  <div className="h-24 flex items-center justify-center text-center opacity-30 text-[11px] border border-dashed rounded-xl" style={{ borderColor: 'var(--border)' }}>
                    Aucun cours programmé
                  </div>
                ) : (
                  coursDuJour.map(seance => (
                    <div key={seance.id} className="p-3 rounded-xl border space-y-2 relative group transition bg-black/[0.01] dark:bg-white/[0.01]" style={{ borderColor: 'var(--border)' }}>
                      
                      {/* En-tête de la séance : Heure & Badge Classe */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1 text-[11px] font-black text-blue-500 font-mono">
                          <Clock size={12} /> {seance.heureDebut} - {seance.heureFin}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/10">
                          {seance.classe}
                        </span>
                      </div>

                      {/* Corps : Matière */}
                      <p className="text-xs font-black tracking-tight leading-snug pr-14" style={{ color: 'var(--text)' }}>
                        {seance.matiere}
                      </p>

                      {/* Prof & Salle */}
                      <div className="space-y-1 pt-1 border-t text-[10px] opacity-60" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-1">
                          <User size={11} /> {seance.enseignant}
                        </div>
                        <div className="flex items-center gap-1 font-medium">
                          <MapPin size={11} className="text-red-500/70" /> {seance.salle}
                        </div>
                      </div>

                      {/* Boutons Actions contextuels (Affichés au survol / Action admin) */}
                      <div className="absolute right-2 bottom-2 flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(seance)} className="p-1 rounded-lg border bg-var(--card) transition hover:bg-blue-500/10 hover:text-blue-500" style={{ borderColor: 'var(--border)' }}>
                          <Edit2 size={11} />
                        </button>
                        <button onClick={() => setDeleteId(seance.id)} className="p-1 rounded-lg border bg-var(--card) text-red-500 transition hover:bg-red-500/10" style={{ borderColor: 'var(--border)' }}>
                          <Trash2 size={11} />
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL : Ajouter / Modifier un Cours ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleSave} className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black flex items-center gap-1.5">
                <BookOpen size={15} /> {editingId ? 'Modifier le créneau' : 'Planifier un nouveau cours'}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:opacity-70"><X size={16} /></button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              {/* Matière */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Nom du Module / Matière *</label>
                <input name="matiere" value={form.matiere} onChange={handleChange} placeholder="ex: Programmation Symfony & EasyAdmin" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} required />
              </div>

              {/* Enseignant */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Enseignant Responsable *</label>
                <input name="enseignant" value={form.enseignant} onChange={handleChange} placeholder="ex: M. Andrianina" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} required />
              </div>

              {/* Classe & Salle */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Classe / Niveau</label>
                  <select name="classe" value={form.classe} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {CLASSES_DISPO.filter(c => c !== 'Tout le campus').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Salle de cours *</label>
                  <input name="salle" value={form.salle} onChange={handleChange} placeholder="ex: Salle 102 - Bloc A" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} required />
                </div>
              </div>

              {/* Jour & Horaires */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Jour</label>
                  <select name="jour" value={form.jour} onChange={handleChange} className="w-full px-2 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {JOURS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Début</label>
                  <input type="time" name="heureDebut" value={form.heureDebut} onChange={handleChange} className="w-full px-2 py-2.5 rounded-xl border focus:outline-none font-mono" style={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Fin</label>
                  <input type="time" name="heureFin" value={form.heureFin} onChange={handleChange} className="w-full px-2 py-2.5 rounded-xl border focus:outline-none font-mono" style={inputStyle} />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl font-bold border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button type="submit" className="px-4 py-2 rounded-xl font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}>
                {editingId ? 'Enregistrer les modifications' : 'Confirmer la planification'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL : Confirmation de Suppression ── */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertCircle size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black">Annuler ce cours ?</h2>
              <p className="text-xs opacity-55">La séance sera définitivement retirée de l'agenda numérique des étudiants et des enseignants.</p>
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