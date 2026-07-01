import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, Plus, Edit2, Trash2, X, CheckCircle, 
  Building2, MapPin, Users, ShieldCheck, Activity, AlertTriangle
} from 'lucide-react';

// ── Types pour la gestion des Campus & Blocs ──────────────────
interface EspaceCampus {
  id: string;
  nom: string;       // ex: "Bloc A - Informatique"
  localisation: string; // ex: "Analamahitsy, Tananarive"
  sallesDispo: number;
  capaciteTotale: number;
  responsableSecurite: string;
  statut: 'Opérationnel' | 'Maintenance' | 'Surchargé';
}

const INITIAL_CAMPUS: EspaceCampus[] = [
  {
    id: 'CAMP-A',
    nom: 'Bloc A - Génie Logiciel & Tech',
    localisation: 'Antananarivo - Centre',
    sallesDispo: 12,
    capaciteTotale: 450,
    responsableSecurite: 'M. Jean de Dieu',
    statut: 'Opérationnel'
  },
  {
    id: 'CAMP-B',
    nom: 'Bloc B - Management & Amphis',
    localisation: 'Antananarivo - Centre',
    sallesDispo: 8,
    capaciteTotale: 600,
    responsableSecurite: 'Mme Volana',
    statut: 'Surchargé'
  },
  {
    id: 'CAMP-LAB',
    nom: 'Laboratoire de Recherche & Cyber',
    localisation: 'Annexe Analamahitsy',
    sallesDispo: 4,
    capaciteTotale: 120,
    responsableSecurite: 'M. Toky',
    statut: 'Maintenance'
  }
];

const EMPTY_CAMPUS_FORM: Omit<EspaceCampus, 'id'> = {
  nom: '',
  localisation: 'Antananarivo - Centre',
  sallesDispo: 5,
  capaciteTotale: 150,
  responsableSecurite: '',
  statut: 'Opérationnel'
};

export default function campus() {
  const { darkMode } = useTheme();
  const [sites, setSites] = useState<EspaceCampus[]>(INITIAL_CAMPUS);
  const [search, setSearch] = useState('');
  
  // États CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<EspaceCampus, 'id'>>(EMPTY_CAMPUS_FORM);
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
  const filteredSites = sites.filter(s => 
    s.nom.toLowerCase().includes(search.toLowerCase()) || 
    s.localisation.toLowerCase().includes(search.toLowerCase())
  );

  // ── Handlers CRUD ───────────────────────────────────────
  const handleOpenCreate = () => {
    setForm(EMPTY_CAMPUS_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (site: EspaceCampus) => {
    setForm({
      nom: site.nom,
      localisation: site.localisation,
      sallesDispo: site.sallesDispo,
      capaciteTotale: site.capaciteTotale,
      responsableSecurite: site.responsableSecurite,
      statut: site.statut
    });
    setEditingId(site.id);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.responsableSecurite) {
      showToast('Veuillez remplir toutes les informations d\'infrastructure.');
      return;
    }

    if (editingId) {
      setSites(sites.map(s => s.id === editingId ? { id: editingId, ...form } : s));
      showToast('Infrastructure du campus mise à jour');
    } else {
      const newSite: EspaceCampus = {
        id: `CAMP-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        ...form
      };
      setSites([...sites, newSite]);
      showToast('Nouveau bloc rattaché au campus ETEC');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setSites(sites.filter(s => s.id !== deleteId));
      setDeleteId(null);
      showToast('Bâtiment retiré du système de tracking');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const getStatutBadge = (statut: EspaceCampus['statut']) => {
    const classes = {
      'Opérationnel': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Maintenance': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'Surchargé': 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${classes[statut]}`}>{statut}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-500">
          <CheckCircle size={15} /> {toastMessage}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Infrastructures & Campus</h1>
          <p className="text-xs opacity-45 mt-1">Supervisez les locaux de l'université ETEC, gérez la capacité des amphis et suivez la maintenance</p>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition hover:opacity-90 self-start sm:self-center" style={{ backgroundColor: 'var(--primary)' }}>
          <Plus size={14} /> Ajouter un bâtiment
        </button>
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border"
        style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
        <Search size={14} className="opacity-40 shrink-0" />
        <input
          type="text" placeholder="Rechercher un bloc ou une localisation..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
        />
      </div>

      {/* Grille des blocs/sites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSites.map(site => (
          <div key={site.id} className="p-5 rounded-2xl border space-y-4 transition hover:bg-black/[0.005] dark:hover:bg-white/[0.005]" style={cardStyle}>
            
            {/* Ligne d'en-tête */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-70 font-bold">{site.id}</span>
                  <h3 className="font-black text-sm tracking-tight">{site.nom}</h3>
                </div>
                <p className="text-[11px] opacity-50 flex items-center gap-1">
                  <MapPin size={11} className="text-red-500" /> {site.localisation}
                </p>
              </div>
              {getStatutBadge(site.statut)}
            </div>

            {/* Metrics Salles & Capacité */}
            <div className="grid grid-cols-2 gap-3 bg-black/[0.02] dark:bg-white/[0.02] p-3 rounded-xl border text-xs" style={{ borderColor: 'var(--border)' }}>
              <div className="space-y-0.5">
                <span className="opacity-45 text-[10px] block font-bold uppercase tracking-wider">Salles de cours</span>
                <span className="font-black text-sm">{site.sallesDispo} Salles actives</span>
              </div>
              <div className="space-y-0.5">
                <span className="opacity-45 text-[10px] block font-bold uppercase tracking-wider">Capacité d'accueil</span>
                <span className="font-black text-sm flex items-center gap-1"><Users size={13} /> {site.capaciteTotale} places</span>
              </div>
            </div>

            {/* Footer de carte : Sécurité & Actions */}
            <div className="flex items-center justify-between border-t pt-3 text-xs" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-1 opacity-60 text-[11px]">
                <ShieldCheck size={13} className="text-blue-500" />
                <span>Sécurité : **{site.responsableSecurite}**</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button onClick={() => handleOpenEdit(site)} className="p-1.5 rounded-lg border hover:bg-blue-500/10 hover:text-blue-500 transition" style={{ borderColor: 'var(--border)' }}>
                  <Edit2 size={12} />
                </button>
                <button onClick={() => setDeleteId(site.id)} className="p-1.5 rounded-lg border text-red-500 hover:bg-red-500/10 transition" style={{ borderColor: 'var(--border)' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ── MODAL : Ajouter / Modifier Infrastructure ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleSave} className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black flex items-center gap-1.5">
                <Building2 size={15} /> {editingId ? 'Modifier l\'infrastructure' : 'Ajouter une infrastructure'}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:opacity-70"><X size={16} /></button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Nom du Bloc / Bâtiment *</label>
                <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} placeholder="ex: Bloc C - Amphithéâtre" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">Nombre de Salles</label>
                  <input type="number" value={form.sallesDispo} onChange={e => setForm({...form, sallesDispo: parseInt(e.target.value) || 0})} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none font-bold" style={inputStyle} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">Capacité Étudiants Max</label>
                  <input type="number" value={form.capaciteTotale} onChange={e => setForm({...form, capaciteTotale: parseInt(e.target.value) || 0})} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none font-bold" style={inputStyle} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Responsable de Site / Sécurité *</label>
                <input value={form.responsableSecurite} onChange={e => setForm({...form, responsableSecurite: e.target.value})} placeholder="ex: Mme Tantely" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">Localisation</label>
                  <select value={form.localisation} onChange={e => setForm({...form, localisation: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    <option value="Antananarivo - Centre">Tana Centre</option>
                    <option value="Annexe Analamahitsy">Analamahitsy</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase opacity-60">Statut initial</label>
                  <select value={form.statut} onChange={e => setForm({...form, statut: e.target.value as EspaceCampus['statut']})} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    <option value="Opérationnel">Opérationnel</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Surchargé">Surchargé</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl font-bold border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button type="submit" className="px-4 py-2 rounded-xl font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}>
                Sauvegarder l'espace
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL : Suppression ── */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black">Désaffecter ce bâtiment ?</h2>
              <p className="text-xs opacity-55">Cela entraînera le retrait des salles associées pour l'attribution des prochains cours.</p>
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