import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import {
  Search, Plus, Eye, Pencil, Trash2, X, Save,
  ChevronLeft, ChevronRight, Filter, Download,
  User, Mail, Phone, MapPin, GraduationCap, Calendar,
  CheckCircle, AlertCircle, Clock,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
type Statut = 'Actif' | 'Suspendu' | 'Diplômé';
type Filiere = 'Génie Logiciel' | 'Administration' | 'BTP' | 'Électromécanique';

interface Etudiant {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  filiere: Filiere;
  niveau: string;
  statut: Statut;
  annee: string;
  moyenne: number;
}

// ─── Données initiales ────────────────────────────────────
const INITIAL: Etudiant[] = [
  { id: 1,  matricule: 'ETU-2024-0001', nom: 'RAKOTO',    prenom: 'Andry',    email: 'andry.rakoto@etec.mg',    telephone: '+261 34 12 345 67', adresse: 'Faravohitra, Fianarantsoa', dateNaissance: '2003-05-14', filiere: 'Génie Logiciel',   niveau: 'L3', statut: 'Actif',    annee: '2026–2027', moyenne: 16.2 },
  { id: 2,  matricule: 'ETU-2024-0002', nom: 'RAIVO',     prenom: 'Miora',    email: 'miora.raivo@etec.mg',     telephone: '+261 33 98 765 43', adresse: 'Tsianolondroa, Fianarantsoa', dateNaissance: '2004-02-20', filiere: 'Administration',  niveau: 'L2', statut: 'Actif',    annee: '2026–2027', moyenne: 14.8 },
  { id: 3,  matricule: 'ETU-2024-0003', nom: 'RASOA',     prenom: 'Haja',     email: 'haja.rasoa@etec.mg',      telephone: '+261 34 55 123 89', adresse: 'Ambositra',                  dateNaissance: '2003-11-08', filiere: 'BTP',             niveau: 'L3', statut: 'Actif',    annee: '2026–2027', moyenne: 15.5 },
  { id: 4,  matricule: 'ETU-2024-0004', nom: 'RABE',      prenom: 'Feno',     email: 'feno.rabe@etec.mg',       telephone: '+261 32 77 654 32', adresse: 'Ihosy',                      dateNaissance: '2002-07-30', filiere: 'Électromécanique', niveau: 'L3', statut: 'Suspendu', annee: '2026–2027', moyenne: 10.1 },
  { id: 5,  matricule: 'ETU-2024-0005', nom: 'ANDRIANA',  prenom: 'Lova',     email: 'lova.andriana@etec.mg',   telephone: '+261 34 44 321 09', adresse: 'Faravohitra, Fianarantsoa', dateNaissance: '2004-03-15', filiere: 'Administration',  niveau: 'L1', statut: 'Actif',    annee: '2026–2027', moyenne: 13.7 },
  { id: 6,  matricule: 'ETU-2023-0042', nom: 'RANDRIA',   prenom: 'Nomena',   email: 'nomena.randria@etec.mg',  telephone: '+261 33 11 234 56', adresse: 'Ambalavao',                  dateNaissance: '2001-09-22', filiere: 'Génie Logiciel',   niveau: 'M1', statut: 'Actif',    annee: '2026–2027', moyenne: 17.3 },
  { id: 7,  matricule: 'ETU-2022-0018', nom: 'RATSIMA',   prenom: 'Zo',       email: 'zo.ratsima@etec.mg',      telephone: '+261 34 88 456 78', adresse: 'Fianarantsoa Centre',        dateNaissance: '2000-12-05', filiere: 'BTP',             niveau: 'M2', statut: 'Diplômé',  annee: '2025–2026', moyenne: 18.1 },
  { id: 8,  matricule: 'ETU-2024-0008', nom: 'RAKOTON',   prenom: 'Sitraka',  email: 'sitraka.rakoton@etec.mg', telephone: '+261 32 22 789 01', adresse: 'Ambohimahasoa',              dateNaissance: '2003-06-18', filiere: 'Électromécanique', niveau: 'L2', statut: 'Actif',    annee: '2026–2027', moyenne: 14.0 },
];

const FILIERES: Filiere[] = ['Génie Logiciel', 'Administration', 'BTP', 'Électromécanique'];
const NIVEAUX  = ['L1', 'L2', 'L3', 'M1', 'M2'];
const STATUTS: Statut[] = ['Actif', 'Suspendu', 'Diplômé'];

const EMPTY: Omit<Etudiant, 'id'> = {
  matricule: '', nom: '', prenom: '', email: '', telephone: '',
  adresse: '', dateNaissance: '', filiere: 'Génie Logiciel',
  niveau: 'L1', statut: 'Actif', annee: '2026–2027', moyenne: 0,
};

// ─── Helpers ──────────────────────────────────────────────
const statutColor = (s: Statut) =>
  s === 'Actif' ? '#22c55e' : s === 'Suspendu' ? '#ef4444' : '#3b82f6';

const statutIcon = (s: Statut) =>
  s === 'Actif' ? <CheckCircle size={12} /> : s === 'Suspendu' ? <AlertCircle size={12} /> : <GraduationCap size={12} />;

const PAGE_SIZE = 5;

// ─── Composant principal ──────────────────────────────────
export default function AdminEtudiants() {
  const { darkMode } = useTheme();

  const [data, setData]             = useState<Etudiant[]>(INITIAL);
  const [search, setSearch]         = useState('');
  const [filtreFiliere, setFiltreFiliere] = useState('');
  const [filtreStatut, setFiltreStatut]   = useState('');
  const [page, setPage]             = useState(1);

  // Modals
  const [modalMode, setModalMode]   = useState<'view' | 'add' | 'edit' | null>(null);
  const [selected, setSelected]     = useState<Etudiant | null>(null);
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [form, setForm]             = useState<Omit<Etudiant, 'id'>>(EMPTY);
  const [saved, setSaved]           = useState(false);

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

  // ── Filtrage + pagination ─────────────────────────────
  const filtered = data.filter(e => {
    const q = search.toLowerCase();
    const matchSearch =
      e.nom.toLowerCase().includes(q) ||
      e.prenom.toLowerCase().includes(q) ||
      e.matricule.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q);
    const matchFiliere = filtreFiliere ? e.filiere === filtreFiliere : true;
    const matchStatut  = filtreStatut  ? e.statut  === filtreStatut  : true;
    return matchSearch && matchFiliere && matchStatut;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── CRUD ─────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY);
    setModalMode('add');
  };

  const openEdit = (e: Etudiant) => {
    const { id, ...rest } = e;
    setForm(rest);
    setSelected(e);
    setModalMode('edit');
  };

  const openView = (e: Etudiant) => {
    setSelected(e);
    setModalMode('view');
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      const newId = Math.max(...data.map(e => e.id)) + 1;
      const newMatricule = `ETU-${new Date().getFullYear()}-${String(newId).padStart(4, '0')}`;
      setData([...data, { id: newId, ...form, matricule: newMatricule }]);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const closeModal = () => { setModalMode(null); setSelected(null); };

  // ── Formulaire commun ─────────────────────────────────
  const FormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Nom</label>
          <input name="nom" value={form.nom} onChange={handleChange} placeholder="RAKOTO"
            className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none" style={inputStyle} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Prénom</label>
          <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Andry"
            className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none" style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="prenom.nom@etec.mg"
            className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none" style={inputStyle} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Téléphone</label>
          <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="+261 34 ..."
            className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none" style={inputStyle} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Adresse</label>
        <input name="adresse" value={form.adresse} onChange={handleChange} placeholder="Quartier, Ville"
          className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none" style={inputStyle} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Date de naissance</label>
          <input name="dateNaissance" type="date" value={form.dateNaissance} onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none" style={inputStyle} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Moyenne</label>
          <input name="moyenne" type="number" min="0" max="20" step="0.1" value={form.moyenne} onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none" style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Filière</label>
          <select name="filiere" value={form.filiere} onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none appearance-none cursor-pointer" style={inputStyle}>
            {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Niveau</label>
          <select name="niveau" value={form.niveau} onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none appearance-none cursor-pointer" style={inputStyle}>
            {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Statut</label>
          <select name="statut" value={form.statut} onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none appearance-none cursor-pointer" style={inputStyle}>
            {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Année académique</label>
        <input name="annee" value={form.annee} onChange={handleChange} placeholder="2026–2027"
          className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none" style={inputStyle} />
      </div>
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Toast */}
      {saved && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white"
          style={{ backgroundColor: '#22c55e' }}>
          <CheckCircle size={15} /> Modifications enregistrées
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Gestion des étudiants</h1>
          <p className="text-xs opacity-45 mt-1">{filtered.length} étudiant{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition hover:opacity-70 cursor-pointer"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <Download size={13} /> Exporter
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Plus size={14} /> Ajouter un étudiant
          </button>
        </div>
      </div>

      {/* Barre de recherche + filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <Search size={14} className="opacity-40 shrink-0" />
          <input
            type="text" placeholder="Rechercher par nom, matricule, email..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
          />
        </div>
        <select value={filtreFiliere} onChange={e => { setFiltreFiliere(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', color: 'var(--text)' }}>
          <option value="">Toutes les filières</option>
          {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={filtreStatut} onChange={e => { setFiltreStatut(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', color: 'var(--text)' }}>
          <option value="">Tous les statuts</option>
          {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tableau */}
      <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Étudiant', 'Matricule', 'Filière', 'Niveau', 'Moyenne', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-xs opacity-40">
                    Aucun étudiant trouvé
                  </td>
                </tr>
              ) : paginated.map(e => (
                <tr key={e.id} className="border-b transition hover:opacity-80"
                  style={{ borderColor: 'var(--border)' }}>

                  {/* Étudiant */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0"
                        style={{ backgroundColor: '#3b82f6' }}>
                        {e.prenom[0]}{e.nom[0]}
                      </div>
                      <div>
                        <p className="font-bold">{e.prenom} {e.nom}</p>
                        <p className="opacity-50">{e.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-mono opacity-70">{e.matricule}</td>
                  <td className="px-4 py-3 opacity-75">{e.filiere}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-[10px] font-black"
                      style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                      {e.niveau}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-black" style={{ color: e.moyenne >= 12 ? '#22c55e' : '#ef4444' }}>
                      {e.moyenne}/20
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black w-fit"
                      style={{ backgroundColor: statutColor(e.statut) + '18', color: statutColor(e.statut) }}>
                      {statutIcon(e.statut)} {e.statut}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openView(e)}
                        className="p-1.5 rounded-lg border transition hover:opacity-70 cursor-pointer"
                        style={{ borderColor: 'var(--border)', color: '#3b82f6' }}
                        title="Voir">
                        <Eye size={13} />
                      </button>
                      <button onClick={() => openEdit(e)}
                        className="p-1.5 rounded-lg border transition hover:opacity-70 cursor-pointer"
                        style={{ borderColor: 'var(--border)', color: '#f59e0b' }}
                        title="Modifier">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleteId(e.id)}
                        className="p-1.5 rounded-lg border transition hover:opacity-70 cursor-pointer"
                        style={{ borderColor: 'var(--border)', color: '#ef4444' }}
                        title="Supprimer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t"
          style={{ borderColor: 'var(--border)' }}>
          <p className="text-[11px] opacity-45">
            Page {page} / {totalPages} · {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg border transition disabled:opacity-30 hover:opacity-70 cursor-pointer"
              style={{ borderColor: 'var(--border)' }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className="w-7 h-7 rounded-lg text-xs font-bold border transition cursor-pointer"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: page === n ? 'var(--primary)' : 'transparent',
                  color: page === n ? 'white' : 'var(--text)',
                }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg border transition disabled:opacity-30 hover:opacity-70 cursor-pointer"
              style={{ borderColor: 'var(--border)' }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL VOIR ─────────────────────────────────── */}
      {modalMode === 'view' && selected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black">Fiche étudiant</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:opacity-70 cursor-pointer"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Avatar + nom */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shrink-0"
                  style={{ backgroundColor: '#3b82f6' }}>
                  {selected.prenom[0]}{selected.nom[0]}
                </div>
                <div>
                  <p className="font-black text-base">{selected.prenom} {selected.nom}</p>
                  <p className="text-xs opacity-50">{selected.matricule}</p>
                  <span className="flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-black w-fit"
                    style={{ backgroundColor: statutColor(selected.statut) + '18', color: statutColor(selected.statut) }}>
                    {statutIcon(selected.statut)} {selected.statut}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { icon: <Mail size={12} />,          label: 'Email',        val: selected.email },
                  { icon: <Phone size={12} />,         label: 'Téléphone',    val: selected.telephone },
                  { icon: <MapPin size={12} />,        label: 'Adresse',      val: selected.adresse },
                  { icon: <Calendar size={12} />,      label: 'Naissance',    val: selected.dateNaissance },
                  { icon: <GraduationCap size={12} />, label: 'Filière',      val: selected.filiere },
                  { icon: <User size={12} />,          label: 'Niveau',       val: selected.niveau },
                ].map((row, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-45 flex items-center gap-1">{row.icon} {row.label}</p>
                    <p className="font-semibold">{row.val}</p>
                  </div>
                ))}
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-45">Moyenne</p>
                  <p className="font-black text-base" style={{ color: selected.moyenne >= 12 ? '#22c55e' : '#ef4444' }}>
                    {selected.moyenne}/20
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-45">Année</p>
                  <p className="font-semibold">{selected.annee}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => openEdit(selected)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                style={{ backgroundColor: '#f59e0b' }}>
                <Pencil size={13} /> Modifier
              </button>
              <button onClick={closeModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer"
                style={{ borderColor: 'var(--border)' }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL AJOUTER / MODIFIER ────────────────────── */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black">
                {modalMode === 'add' ? '➕ Ajouter un étudiant' : '✏️ Modifier l\'étudiant'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:opacity-70 cursor-pointer"><X size={16} /></button>
            </div>
            <div className="overflow-y-auto p-6">
              <FormFields />
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2 shrink-0" style={{ borderColor: 'var(--border)' }}>
              <button onClick={closeModal}
                className="px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer hover:opacity-70"
                style={{ borderColor: 'var(--border)' }}>
                Annuler
              </button>
              <button onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}>
                <Save size={13} />
                {modalMode === 'add' ? 'Enregistrer' : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONFIRMER SUPPRESSION ─────────────────── */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h2 className="text-sm font-black mb-1">Confirmer la suppression</h2>
              <p className="text-xs opacity-55">Cette action est irréversible. L'étudiant sera définitivement supprimé.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border cursor-pointer hover:opacity-70"
                style={{ borderColor: 'var(--border)' }}>
                Annuler
              </button>
              <button onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 cursor-pointer hover:opacity-90">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}