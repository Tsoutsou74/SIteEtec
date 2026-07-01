import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Search, Plus, Pencil, Trash2, X, Save, 
  UserPlus, Mail, Phone, BookOpen, CheckCircle, AlertTriangle 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: 'Permanent' | 'Vacataire';
  matieres: string[];
}

const INITIAL_ENSEIGNANTS: Enseignant[] = [
  { id: 1, nom: 'ANDRIAMALALA', prenom: 'Rija', email: 'rija.andria@etec.mg', telephone: '+261 34 88 777 11', statut: 'Permanent', matieres: ['Algorithmique Avancée', 'Architecture Java / Spring'] },
  { id: 2, nom: 'RAZAFINDRAKOTO', prenom: 'Lova', email: 'lova.razaf@etec.mg', telephone: '+261 33 99 888 22', statut: 'Vacataire', matieres: ['Gestion de Projet & Agilité', 'Comptabilité'] },
  { id: 3, nom: 'HERILALA', prenom: 'Sitraka', email: 'sitraka.heri@etec.mg', telephone: '+261 32 11 222 33', statut: 'Permanent', matieres: ['Développement Web (React/Next)'] },
];

const EMPTY_FORM = {
  nom: '', prenom: '', email: '', telephone: '', statut: 'Vacataire' as Enseignant['statut'], matieresRaw: ''
};

export default function AdminEnseignants() {
  const { darkMode } = useTheme();
  const [data, setData] = useState<Enseignant[]>(INITIAL_ENSEIGNANTS);
  const [search, setSearch] = useState('');

  // États pour le CRUD
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Enseignant | null>(null);
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

  // ─── Filtrage ───────────────────────────────────────────
  const filtered = data.filter(e => 
    e.nom.toLowerCase().includes(search.toLowerCase()) || 
    e.prenom.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Actions CRUD ───────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModalMode('add');
  };

  const openEdit = (prof: Enseignant) => {
    setForm({
      nom: prof.nom,
      prenom: prof.prenom,
      email: prof.email,
      telephone: prof.telephone,
      statut: prof.statut,
      matieresRaw: prof.matieres.join(', ')
    });
    setSelected(prof);
    setModalMode('edit');
  };

  const handleSave = () => {
    if (!form.nom || !form.prenom || !form.email) {
      showToast('Veuillez remplir le nom, prénom et email.');
      return;
    }

    // Séparer les matières par virgule et nettoyer les espaces
    const matieresArray = form.matieresRaw
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    if (modalMode === 'add') {
      const newId = data.length > 0 ? Math.max(...data.map(e => e.id)) + 1 : 1;
      const newProf: Enseignant = {
        id: newId,
        nom: form.nom.toUpperCase(),
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
        statut: form.statut,
        matieres: matieresArray
      };
      setData([...data, newProf]);
      showToast('Enseignant recruté avec succès');
    } else if (modalMode === 'edit' && selected) {
      setData(data.map(e => e.id === selected.id ? {
        ...e,
        nom: form.nom.toUpperCase(),
        prenom: form.prenom,
        email: form.email,
        telephone: form.telephone,
        statut: form.statut,
        matieres: matieresArray
      } : e));
      showToast('Dossier enseignant mis à jour');
    }
    setModalMode(null);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setData(data.filter(e => e.id !== deleteId));
      setDeleteId(null);
      showToast('Enseignant retiré du système');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-5">
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-500 animate-in fade-in slide-in-from-top-4">
          <CheckCircle size={15} /> {toastMessage}
        </div>
      )}

      {/* En-tête de page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Gestion des Enseignants</h1>
          <p className="text-xs opacity-45 mt-1">Recrutement, suivi des statuts RH et affectations des cours</p>
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition hover:opacity-90 self-start sm:self-center" style={{ backgroundColor: 'var(--primary)' }}>
          <Plus size={14} /> Recruter un Enseignant
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
        style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
        <Search size={14} className="opacity-40 shrink-0" />
        <input
          type="text" placeholder="Rechercher par nom, prénom ou email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
        />
      </div>

      {/* Tableau CRUD des enseignants */}
      <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Enseignant', 'Contact', 'Statut RH', 'Matières prises en charge', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center opacity-40">Aucun dossier enseignant trouvé</td>
                </tr>
              ) : (
                filtered.map(prof => (
                  <tr key={prof.id} className="border-b transition hover:opacity-95" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3.5 font-bold">
                      {prof.prenom} {prof.nom}
                    </td>
                    <td className="px-4 py-3.5 space-y-0.5 opacity-85">
                      <p className="flex items-center gap-1"><Mail size={11} className="opacity-40" /> {prof.email}</p>
                      <p className="flex items-center gap-1"><Phone size={11} className="opacity-40" /> {prof.telephone}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${prof.statut === 'Permanent' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                        {prof.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {prof.matieres.length === 0 ? (
                          <span className="opacity-35 italic text-[11px]">Aucune matière assignée</span>
                        ) : (
                          prof.matieres.map((m, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border font-medium" style={{ borderColor: 'var(--border)' }}>
                              {m}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(prof)} className="p-1.5 rounded-lg border text-amber-500 transition hover:bg-amber-500/5" style={{ borderColor: 'var(--border)' }}>
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => setDeleteId(prof.id)} className="p-1.5 rounded-lg border text-red-500 transition hover:bg-red-500/5" style={{ borderColor: 'var(--border)' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL AJOUT / MODIFICATION ─────────────────── */}
      {modalMode && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black flex items-center gap-1.5">
                <UserPlus size={16} className="text-blue-500" />
                {modalMode === 'add' ? 'Recruter un Enseignant' : 'Modifier le Dossier Cadre'}
              </h2>
              <button onClick={() => setModalMode(null)} className="p-1.5 rounded-lg hover:opacity-70"><X size={16} /></button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Nom de famille</label>
                  <input name="nom" value={form.nom} onChange={handleChange} placeholder="ex: ANDRIA" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none uppercase" style={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Prénom</label>
                  <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="ex: Rija" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Adresse Email Professionnelle</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="nom.prenom@etec.mg" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Statut RH</label>
                  <select name="statut" value={form.statut} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    <option value="Permanent">Permanent</option>
                    <option value="Vacataire">Vacataire</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Numéro de Téléphone</label>
                <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="ex: +261 34 00 000 00" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center justify-between">
                  <span>Matières enseignées</span>
                  <span className="opacity-40 lowercase font-normal">(Séparer par des virgules)</span>
                </label>
                <textarea name="matieresRaw" value={form.matieresRaw} onChange={handleChange} placeholder="ex: Algorithmique Avancée, Architecture Cloud, DevOps" rows={3} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none resize-none leading-relaxed" style={inputStyle} />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => setModalMode(null)} className="px-4 py-2 rounded-xl font-bold border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}><Save size={13} /> Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL CONFIRMATION SUPPRESSION ───────────────── */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black">Licencier ou retirer l'enseignant ?</h2>
              <p className="text-xs opacity-55">Cette opération supprimera l'intervenant de l'annuaire ainsi que ses affectations de matières courantes.</p>
            </div>
            <div className="flex gap-3 justify-center text-xs">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl text-white bg-red-500 font-bold">Confirmer la rupture</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}