import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, CheckCircle, XCircle, Clock, Filter, 
  FileCheck, UserPlus, Mail, Phone, Calendar, GraduationCap
} from 'lucide-react';

// ── Types pour les dossiers d'inscription ──────────────────────
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
  const [candidatures, setCandidatures] = useState<Candidature[]>(INITIAL_CANDIDATURES);
  const [search, setSearch] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
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
  const filtered = candidatures.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = 
      c.nom.toLowerCase().includes(q) || 
      c.prenom.toLowerCase().includes(q) || 
      c.mentionDemandee.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q);
    
    const matchStatut = filtreStatut ? c.statut === filtreStatut : true;
    return matchSearch && matchStatut;
  });

  // ── Actions ─────────────────────────────────────────────
  const handleChangerStatut = (id: string, nouveauStatut: 'Accepté' | 'Rejeté') => {
    setCandidatures(candidatures.map(c => {
      if (c.id === id) {
        showToast(`Dossier ${c.id} marqué comme : ${nouveauStatut}`);
        return { ...c, statut: nouveauStatut };
      }
      return c;
    }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
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
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-500">
          <FileCheck size={15} /> {toastMessage}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Inscriptions & Candidatures</h1>
          <p className="text-xs opacity-45 mt-1">Gérez et examinez les nouveaux dossiers d'admission soumis sur le portail public</p>
        </div>
      </div>

      {/* Barre de Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
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
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center opacity-40 text-xs border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
            Aucun dossier d'inscription en cours de traitement.
          </div>
        ) : (
          filtered.map(c => (
            <div key={c.id} className="p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition hover:bg-black/[0.01] dark:hover:bg-white/[0.01]" style={cardStyle}>
              
              {/* Infos Candidat */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 opacity-70 font-bold">{c.id}</span>
                  <h3 className="font-black text-sm tracking-tight leading-tight">{c.nom} {c.prenom}</h3>
                  {getStatutBadge(c.statut)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs opacity-75 pt-1">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={13} className="opacity-50 text-blue-500" />
                    <span>{c.mentionDemandee} • <strong className="opacity-100">{c.niveau}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] opacity-60">
                    <Mail size={12} /> {c.email}
                  </div>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <Phone size={12} /> {c.telephone}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] opacity-45">
                    <Calendar size={12} /> Reçu le {c.dateSoumission}
                  </div>
                </div>
              </div>

              {/* Boutons d'action pour la décision admin */}
              <div className="flex items-center lg:justify-end gap-2 border-t lg:border-t-0 pt-3 lg:pt-0" style={{ borderColor: 'var(--border)' }}>
                {c.statut === 'En attente' ? (
                  <>
                    <button onClick={() => handleChangerStatut(c.id, 'Rejeté')} className="px-3 py-2 rounded-xl text-[11px] font-bold border border-red-500/20 text-red-500 transition hover:bg-red-500/5 flex items-center gap-1">
                      Refuser
                    </button>
                    <button onClick={() => handleChangerStatut(c.id, 'Accepté')} className="px-3 py-2 rounded-xl text-[11px] font-bold text-white transition hover:opacity-90 flex items-center gap-1" style={{ backgroundColor: 'var(--primary)' }}>
                      <UserPlus size={13} /> Valider l'inscription
                    </button>
                  </>
                ) : (
                  <button onClick={() => showToast(`Réouverture de l'historique d'audit pour ${c.id}`)} className="px-3 py-2 rounded-xl text-[11px] font-bold border opacity-60 hover:opacity-100 transition" style={{ borderColor: 'var(--border)' }}>
                    Consulter les pièces jointes
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}