import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, CheckCircle, XCircle, Clock, Filter, 
  FileCheck, UserPlus, Mail, Phone, Calendar, GraduationCap,
  Plus, Edit2, Trash2, X, Check, CalendarDays, ActiveIndicator, AlertCircle
} from 'lucide-react';

// ─── Interfaces ─────────────────────────────────────────────────────
interface Candidature {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  mentionDemandee: string;
  niveau: 'Licence 1' | 'Licence 3' | 'Master 1' | 'Master 2';
  dateSoumission: string;
  statut: 'En attente' | 'Accepté' | 'Rejeté';
}

interface PeriodeInscription {
  id: string;
  titre: string;
  dateDebut: string;
  dateFin: string;
  anneeUniversitaire: string;
  estActive: boolean;
}

// ─── Données Initiales ──────────────────────────────────────────────
const INITIAL_PERIODES: PeriodeInscription[] = [
  {
    id: 'PER-2026-01',
    titre: 'Session Principale - Vague 1',
    dateDebut: '2026-05-01',
    dateFin: '2026-08-31',
    anneeUniversitaire: '2026-2027',
    estActive: true,
  },
  {
    id: 'PER-2026-02',
    titre: 'Rentrée de Printemps / Tardive',
    dateDebut: '2026-10-01',
    dateFin: '2026-11-15',
    anneeUniversitaire: '2026-2027',
    estActive: false,
  }
];

const INITIAL_CANDIDATURES: Candidature[] = [
  {
    id: 'ETEC-REG-001',
    nom: 'ANDRIANINA',
    prenom: 'Tahina',
    email: 'tahina.andria@gmail.com',
    telephone: '+261 34 56 789 01',
    mentionDemandee: 'Génie Logiciel / Informatique',
    niveau: 'Master 1',
    dateSoumission: '2026-06-28',
    statut: 'En attente'
  },
  {
    id: 'ETEC-REG-002',
    nom: 'RASOAMALALA',
    prenom: 'Fanja',
    email: 'fanja.rasoa@outlook.com',
    telephone: '+261 32 45 612 34',
    mentionDemandee: 'Management & Gestion d\'Entreprise',
    niveau: 'Licence 1',
    dateSoumission: '2026-06-25',
    statut: 'Accepté'
  },
  {
    id: 'ETEC-REG-003',
    nom: 'RAKOTOMALALA',
    prenom: 'Rivo',
    email: 'rivo.rakoto@yahoo.fr',
    telephone: '+261 33 11 222 33',
    mentionDemandee: 'Réseaux & Sécurité',
    niveau: 'Licence 3',
    dateSoumission: '2026-06-20',
    statut: 'Rejeté'
  }
];

export default function InscriptionsOuvert() {
  const { darkMode } = useTheme();
  
  // ─── États principaux ─────────────────────────────────────────────
  const [candidatures, setCandidatures] = useState<Candidature[]>(INITIAL_CANDIDATURES);
  const [periodes, setPeriodes] = useState<PeriodeInscription[]>(INITIAL_PERIODES);
  
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals de configuration
  const [isCandidatureModalOpen, setIsCandidatureModalOpen] = useState(false);
  const [editingCandidature, setEditingCandidature] = useState<Candidature | null>(null);

  const [isPeriodeModalOpen, setIsPeriodeModalOpen] = useState(false);
  const [editingPeriode, setEditingPeriode] = useState<PeriodeInscription | null>(null);

  // Formulaires locaux
  const [candForm, setCandForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', mentionDemandee: '',
    niveau: 'Licence 1' as Candidature['niveau'], statut: 'En attente' as Candidature['statut']
  });

  const [periodeForm, setPeriodeForm] = useState({
    titre: '', dateDebut: '', dateFin: '', anneeUniversitaire: '2026-2027', estActive: false
  });

  // Styles Dynamiques réutilisables
  const inputStyle = {
    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  const cardStyle = {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  // ─── Toast Helper ──────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ─── Filtrage des Candidatures ────────────────────────────────────
  const filteredCandidatures = useMemo(() => {
    return candidatures.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = 
        c.nom.toLowerCase().includes(q) || 
        c.prenom.toLowerCase().includes(q) || 
        c.mentionDemandee.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      
      const matchStatut = filtreStatut ? c.statut === filtreStatut : true;
      return matchSearch && matchStatut;
    });
  }, [candidatures, search, filtreStatut]);

  // ─── CRUD Candidatures ────────────────────────────────────────────
  const openAddCand = () => {
    setEditingCandidature(null);
    setCandForm({ nom: '', prenom: '', email: '', telephone: '', mentionDemandee: '', niveau: 'Licence 1', statut: 'En attente' });
    setIsCandidatureModalOpen(true);
  };

  const openEditCand = (c: Candidature) => {
    setEditingCandidature(c);
    setCandForm({ nom: c.nom, prenom: c.prenom, email: c.email, telephone: c.telephone, mentionDemandee: c.mentionDemandee, niveau: c.niveau, statut: c.statut });
    setIsCandidatureModalOpen(true);
  };

  const handleCandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    if (editingCandidature) {
      setCandidatures(prev => prev.map(c => c.id === editingCandidature.id ? { ...c, ...candForm } : c));
      showToast(`Dossier ${editingCandidature.id} mis à jour avec succès.`);
    } else {
      const newId = `ETEC-REG-${String(candidatures.length + 1).padStart(3, '0')}`;
      const newCand: Candidature = { id: newId, ...candForm, dateSoumission: today };
      setCandidatures(prev => [newCand, ...prev]);
      showToast(`Dossier d'inscription ${newId} créé.`);
    }
    setIsCandidatureModalOpen(false);
  };

  const handleChangerStatut = (id: string, nouveauStatut: 'Accepté' | 'Rejeté') => {
    setCandidatures(prev => prev.map(c => c.id === id ? { ...c, statut: nouveauStatut } : c));
    showToast(`Dossier ${id} marqué comme : ${nouveauStatut}`);
  };

  const handleDeleteCand = (id: string) => {
    if (confirm("Voulez-vous définitivement supprimer ce dossier de candidature ?")) {
      setCandidatures(prev => prev.filter(c => c.id !== id));
      showToast("Candidature retirée des archives.");
    }
  };

  // ─── CRUD Périodes d'Inscription ──────────────────────────────────
  const openAddPeriode = () => {
    setEditingPeriode(null);
    setPeriodeForm({ titre: '', dateDebut: '', dateFin: '', anneeUniversitaire: '2026-2027', estActive: false });
    setIsPeriodeModalOpen(true);
  };

  const openEditPeriode = (p: PeriodeInscription) => {
    setEditingPeriode(p);
    setPeriodeForm({ titre: p.titre, dateDebut: p.dateDebut, dateFin: p.dateFin, anneeUniversitaire: p.anneeUniversitaire, estActive: p.estActive });
    setIsPeriodeModalOpen(true);
  };

  const handlePeriodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedPeriodes = [...periodes];
    
    // Si la période actuelle est configurée comme active, on désactive d'abord toutes les autres
    if (periodeForm.estActive) {
      updatedPeriodes = updatedPeriodes.map(p => ({ ...p, estActive: false }));
    }

    if (editingPeriode) {
      setPeriodes(updatedPeriodes.map(p => p.id === editingPeriode.id ? { ...p, ...periodeForm } : p));
      showToast(`Session "${periodeForm.titre}" modifiée.`);
    } else {
      const newPeriode: PeriodeInscription = {
        id: `PER-${Date.now()}`,
        ...periodeForm
      };
      setPeriodes([...updatedPeriodes, newPeriode]);
      showToast(`Nouvelle période de recrutement ouverte.`);
    }
    setIsPeriodeModalOpen(false);
  };

  const handleDeletePeriode = (id: string) => {
    if (confirm("Supprimer cette période ? Les candidats associés risquent de ne plus avoir de rattachement temporel.")) {
      setPeriodes(prev => prev.filter(p => p.id !== id));
      showToast("Période d'inscription supprimée.");
    }
  };

  const getStatutBadge = (statut: Candidature['statut']) => {
    switch (statut) {
      case 'En attente':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase border bg-amber-500/10 text-amber-500 border-amber-500/20 flex items-center gap-1"><Clock size={10} /> En attente</span>;
      case 'Accepté':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase border bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1"><CheckCircle size={10} /> Validé</span>;
      case 'Rejeté':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase border bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1"><XCircle size={10} /> Refusé</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast de Notification global */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-600 border border-green-500/30 animate-fade-in">
          <FileCheck size={15} /> {toastMessage}
        </div>
      )}

      {/* En-tête Général */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Inscriptions & Campagnes d'Admission</h1>
          <p className="text-xs opacity-50 mt-1">Configurez les fenêtres d'ouverture et validez les dossiers d'admission de l'E-TEC.</p>
        </div>
      </div>

      {/* ─── SECTION 1 : GESTION DES PÉRIODES (BENTO LAYOUT) ─────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-blue-500" />
            <h2 className="text-xs font-black uppercase tracking-wider opacity-70">Sessions & Calendrier de Recrutement</h2>
          </div>
          <button 
            onClick={openAddPeriode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white shadow bg-blue-600 hover:opacity-90 transition cursor-pointer"
          >
            <Plus size={14} /> Ouvrir une Session
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {periodes.map(p => (
            <div 
              key={p.id} 
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                p.estActive ? 'border-green-500/40 shadow-sm' : ''
              }`}
              style={{
                backgroundColor: p.estActive ? 'rgba(0,180,0,0.02)' : 'var(--card)',
                borderColor: p.estActive ? 'rgba(0,180,0,0.2)' : 'var(--border)'
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono opacity-40 font-bold">{p.anneeUniversitaire}</span>
                  {p.estActive ? (
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-green-500 text-white tracking-widest flex items-center gap-1">
                      ● Active (En cours)
                    </span>
                  ) : (
                    <span className="text-[9px] opacity-40 font-bold">Fermée</span>
                  )}
                </div>
                <h3 className="font-black text-xs tracking-tight line-clamp-1">{p.titre}</h3>
                <p className="text-[11px] opacity-60 mt-2 flex items-center gap-1">
                  Du <strong>{p.dateDebut}</strong> au <strong>{p.dateFin}</strong>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-end gap-1.5" style={{ borderColor: 'var(--border)' }}>
                <button 
                  onClick={() => openEditPeriode(p)}
                  className="p-1.5 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition opacity-60 hover:opacity-100 cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Edit2 size={11} />
                </button>
                <button 
                  onClick={() => handleDeletePeriode(p.id)}
                  className="p-1.5 rounded-lg border text-red-500 border-red-500/10 hover:bg-red-500/5 transition cursor-pointer"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="opacity-10" style={{ borderColor: 'var(--border)' }} />

      {/* ─── SECTION 2 : RECHERCHE & DOSSIERS CANDIDATS ───────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-green-500" />
            <h2 className="text-xs font-black uppercase tracking-wider opacity-70">Registre des Dossiers d'Inscription</h2>
          </div>
          <button 
            onClick={openAddCand}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-bold text-xs text-white shadow transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Plus size={14} /> Saisir un Dossier (Manuel)
          </button>
        </div>

        {/* Barre de Filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
            style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}>
            <Search size={14} className="opacity-40 shrink-0" />
            <input
              type="text" placeholder="Rechercher par nom, mention ou code de dossier..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
            />
          </div>
          <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)}
            className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none sm:w-48" style={inputStyle}>
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Accepté">Validé</option>
            <option value="Rejeté">Refusé</option>
          </select>
        </div>

        {/* Liste des Demandes */}
        <div className="grid grid-cols-1 gap-3">
          {filteredCandidatures.length === 0 ? (
            <div className="py-12 text-center opacity-40 text-xs border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
              Aucun dossier d'inscription ne correspond à vos critères.
            </div>
          ) : (
            filteredCandidatures.map(c => (
              <div key={c.id} className="p-4 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition hover:bg-black/[0.005] dark:hover:bg-white/[0.005]" style={cardStyle}>
                
                {/* Infos Candidat */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-70 font-bold">{c.id}</span>
                    <h3 className="font-black text-sm tracking-tight leading-tight">{c.nom} {c.prenom}</h3>
                    {getStatutBadge(c.statut)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs opacity-75 pt-1">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap size={13} className="opacity-50 text-blue-500 shrink-0" />
                      <span className="truncate">{c.mentionDemandee} • <strong>{c.niveau}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] opacity-60 truncate">
                      <Mail size={12} className="shrink-0" /> {c.email}
                    </div>
                    <div className="flex items-center gap-1.5 opacity-60">
                      <Phone size={12} className="shrink-0" /> {c.telephone}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] opacity-45">
                      <Calendar size={12} className="shrink-0" /> Reçu le {c.dateSoumission}
                    </div>
                  </div>
                </div>

                {/* Actions Intégrées (Édition / Décisions Admin) */}
                <div className="flex items-center lg:justify-end gap-2 border-t lg:border-t-0 pt-3 lg:pt-0" style={{ borderColor: 'var(--border)' }}>
                  
                  <button 
                    onClick={() => openEditCand(c)}
                    className="p-2 rounded-xl border text-[11px] font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition opacity-70 hover:opacity-100 cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Edit2 size={12} />
                  </button>

                  {c.statut === 'En attente' ? (
                    <>
                      <button onClick={() => handleChangerStatut(c.id, 'Rejeté')} className="px-3 py-2 rounded-xl text-[11px] font-bold border border-red-500/20 text-red-500 transition hover:bg-red-500/5 flex items-center gap-1 cursor-pointer">
                        Refuser
                      </button>
                      <button onClick={() => handleChangerStatut(c.id, 'Accepté')} className="px-3 py-2 rounded-xl text-[11px] font-bold text-white transition hover:opacity-90 flex items-center gap-1 cursor-pointer" style={{ backgroundColor: 'var(--primary)' }}>
                        <UserPlus size={13} /> Valider l'admission
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleDeleteCand(c.id)}
                      className="px-3 py-2 rounded-xl text-[11px] font-bold border border-red-500/10 text-red-500 hover:bg-red-500/5 transition cursor-pointer"
                    >
                      Supprimer
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── MODAL : AJOUT / MODIFICATION CANDIDATURE ───────────────────────── */}
      {isCandidatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black uppercase tracking-wider">
                {editingCandidature ? `Modifier le dossier - ${editingCandidature.id}` : 'Enregistrer une candidature'}
              </h2>
              <button onClick={() => setIsCandidatureModalOpen(false)} className="p-1 opacity-50 hover:opacity-100 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCandSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Nom</label>
                  <input type="text" required placeholder="Ex: ANDRIANINA"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }} value={candForm.nom}
                    onChange={e => setCandForm({...candForm, nom: e.target.value.toUpperCase()})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Prénom</label>
                  <input type="text" required placeholder="Ex: Tahina"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }} value={candForm.prenom}
                    onChange={e => setCandForm({...candForm, prenom: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Email</label>
                  <input type="email" required placeholder="adresse@exemple.com"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }} value={candForm.email}
                    onChange={e => setCandForm({...candForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Téléphone</label>
                  <input type="text" required placeholder="Ex: +261 34 56 789 01"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }} value={candForm.telephone}
                    onChange={e => setCandForm({...candForm, telephone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Mention / Parcours</label>
                  <input type="text" required placeholder="Ex: Génie Logiciel"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }} value={candForm.mentionDemandee}
                    onChange={e => setCandForm({...candForm, mentionDemandee: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Niveau d'entrée</label>
                  <select className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-green-500 cursor-pointer"
                    style={{ borderColor: 'var(--border)' }} value={candForm.niveau}
                    onChange={e => setCandForm({...candForm, niveau: e.target.value as Candidature['niveau']})}
                  >
                    <option value="Licence 1">Licence 1</option>
                    <option value="Licence 3">Licence 3</option>
                    <option value="Master 1">Master 1</option>
                    <option value="Master 2">Master 2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Statut initial du dossier</label>
                <select className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-green-500 cursor-pointer"
                  style={{ borderColor: 'var(--border)' }} value={candForm.statut}
                  onChange={e => setCandForm({...candForm, statut: e.target.value as Candidature['statut']})}
                >
                  <option value="En attente">En attente</option>
                  <option value="Accepté">Validé (Accepté)</option>
                  <option value="Rejeté">Refusé (Rejeté)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button type="button" onClick={() => setIsCandidatureModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold border transition hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow hover:opacity-90 cursor-pointer" style={{ backgroundColor: 'var(--primary)' }}>
                  <Check size={14} /> {editingCandidature ? 'Sauvegarder' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL : AJOUT / MODIFICATION PÉRIODE D'INSCRIPTION ─────────────────── */}
      {isPeriodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border shadow-2xl p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black uppercase tracking-wider">
                {editingPeriode ? 'Modifier la Session' : 'Ouvrir une nouvelle campagne'}
              </h2>
              <button onClick={() => setIsPeriodeModalOpen(false)} className="p-1 opacity-50 hover:opacity-100 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePeriodeSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Titre de la session</label>
                <input type="text" required placeholder="Ex: Session d'Automne - Vague Principale"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-blue-500"
                  style={{ borderColor: 'var(--border)' }} value={periodeForm.titre}
                  onChange={e => setPeriodeForm({...periodeForm, titre: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Date d'ouverture</label>
                  <input type="date" required
                    className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-blue-500"
                    style={{ borderColor: 'var(--border)' }} value={periodeForm.dateDebut}
                    onChange={e => setPeriodeForm({...periodeForm, dateDebut: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Date de clôture</label>
                  <input type="date" required
                    className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-blue-500"
                    style={{ borderColor: 'var(--border)' }} value={periodeForm.dateFin}
                    onChange={e => setPeriodeForm({...periodeForm, dateFin: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Année Universitaire</label>
                <input type="text" required placeholder="Ex: 2026-2027"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border bg-transparent outline-none focus:border-blue-500"
                  style={{ borderColor: 'var(--border)' }} value={periodeForm.anneeUniversitaire}
                  onChange={e => setPeriodeForm({...periodeForm, anneeUniversitaire: e.target.value})}
                />
              </div>

              <div className="py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold">
                  <input type="checkbox" className="rounded accent-blue-600 scale-110"
                    checked={periodeForm.estActive}
                    onChange={e => setPeriodeForm({...periodeForm, estActive: e.target.checked})}
                  />
                  Définir comme la session active par défaut
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button type="button" onClick={() => setIsPeriodeModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold border transition hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow bg-blue-600 hover:opacity-90 cursor-pointer">
                  <Check size={14} /> Déployer la session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}