import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import {
  Search, Eye, Check, X, Trash2, Calendar, 
  User, Mail, Phone, GraduationCap, CheckCircle, 
  AlertCircle, Clock, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
type StatutInscription = 'En attente' | 'Approuvé' | 'Rejeté';
type Filiere = 'Génie Logiciel' | 'Administration' | 'BTP' | 'Électromécanique';

interface Inscription {
  id: number;
  dateDemande: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  filiere: Filiere;
  niveauDemande: string;
  statut: StatutInscription;
  remarque?: string;
}

// ─── Données initiales ────────────────────────────────────
const INITIAL_INSCRIPTIONS: Inscription[] = [
  { id: 1, dateDemande: '2026-06-15', nom: 'RAZAFY', prenom: 'Toky', email: 'toky.razafy@gmail.com', telephone: '+261 34 22 111 22', filiere: 'Génie Logiciel', niveauDemande: 'L1', statut: 'En attente' },
  { id: 2, dateDemande: '2026-06-14', nom: 'HERINIOTY', prenom: 'Sitraka', email: 'sitraka.her@gmail.com', telephone: '+261 33 44 555 66', filiere: 'Administration', niveauDemande: 'L1', statut: 'Approuvé' },
  { id: 3, dateDemande: '2026-06-12', nom: 'ANDRIANINA', prenom: 'Rova', email: 'rova.andri@gmail.com', telephone: '+261 32 88 999 00', filiere: 'BTP', niveauDemande: 'L1', statut: 'Rejeté', remarque: 'Dossier incomplet (bulletins manquants)' },
];

const FILIERES: Filiere[] = ['Génie Logiciel', 'Administration', 'BTP', 'Électromécanique'];
const STATUTS: StatutInscription[] = ['En attente', 'Approuvé', 'Rejeté'];
const PAGE_SIZE = 5;

// ─── Helpers Styles ───────────────────────────────────────
const statutColor = (s: StatutInscription) =>
  s === 'Approuvé' ? '#22c55e' : s === 'Rejeté' ? '#ef4444' : '#f59e0b';

const statutIcon = (s: StatutInscription) =>
  s === 'Approuvé' ? <CheckCircle size={12} /> : s === 'Rejeté' ? <AlertCircle size={12} /> : <Clock size={12} />;

export default function AdminInscription() {
  const { darkMode } = useTheme();

  const [data, setData] = useState<Inscription[]>(INITIAL_INSCRIPTIONS);
  const [search, setSearch] = useState('');
  const [filtreFiliere, setFiltreFiliere] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [page, setPage] = useState(1);

  // Modals et Toast
  const [selected, setSelected] = useState<Inscription | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
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

  // ── Filtrage + Pagination ───────────────────────────────
  const filtered = data.filter(i => {
    const q = search.toLowerCase();
    const matchSearch =
      i.nom.toLowerCase().includes(q) ||
      i.prenom.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q);
    const matchFiliere = filtreFiliere ? i.filiere === filtreFiliere : true;
    const matchStatut = filtreStatut ? i.statut === filtreStatut : true;
    return matchSearch && matchFiliere && matchStatut;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Actions Backend Simulé ──────────────────────────────
  const updateStatut = (id: number, nouveauStatut: StatutInscription) => {
    setData(data.map(item => item.id === id ? { ...item, statut: nouveauStatut } : item));
    if (selected && selected.id === id) {
      setSelected({ ...selected, statut: nouveauStatut });
    }
    showToast(`Demande ${nouveauStatut.toLowerCase()}e avec succès`);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setData(data.filter(item => item.id !== deleteId));
      setDeleteId(null);
      showToast('Demande d\'inscription supprimée');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
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
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Gestion des Inscriptions</h1>
          <p className="text-xs opacity-45 mt-1">Traiter et valider les nouvelles candidatures (ETEC)</p>
        </div>
      </div>

      {/* Barre de recherche + Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <Search size={14} className="opacity-40 shrink-0" />
          <input
            type="text" placeholder="Rechercher un candidat..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
          />
        </div>
        <select value={filtreFiliere} onChange={e => { setFiltreFiliere(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none" style={inputStyle}>
          <option value="">Toutes les filières</option>
          {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={filtreStatut} onChange={e => { setFiltreStatut(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none" style={inputStyle}>
          <option value="">Tous les statuts</option>
          {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tableau des Inscriptions */}
      <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Candidat', 'Date de demande', 'Filière Souhaitée', 'Niveau', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-xs opacity-40">Aucune inscription en attente</td>
                </tr>
              ) : paginated.map(i => (
                <tr key={i.id} className="border-b transition hover:opacity-80" style={{ borderColor: 'var(--border)' }}>
                  
                  {/* Candidat */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold">{i.prenom} {i.nom}</p>
                      <p className="opacity-50 text-[11px]">{i.email}</p>
                    </div>
                  </td>

                  <td className="px-4 py-3 opacity-70 flex items-center gap-1 mt-1">
                    <Calendar size={12} className="opacity-50" /> {i.dateDemande}
                  </td>
                  
                  <td className="px-4 py-3 opacity-75">{i.filiere}</td>
                  
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-500">
                      {i.niveauDemande}
                    </span>
                  </td>

                  {/* Statut Badge */}
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black w-fit"
                      style={{ backgroundColor: statutColor(i.statut) + '18', color: statutColor(i.statut) }}>
                      {statutIcon(i.statut)} {i.statut}
                    </span>
                  </td>

                  {/* Actions Rapides */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setSelected(i)} className="p-1.5 rounded-lg border text-blue-500 transition hover:bg-blue-500/5" style={{ borderColor: 'var(--border)' }} title="Voir le dossier">
                        <Eye size={13} />
                      </button>
                      {i.statut === 'En attente' && (
                        <>
                          <button onClick={() => updateStatut(i.id, 'Approuvé')} className="p-1.5 rounded-lg border text-green-500 transition hover:bg-green-500/5" style={{ borderColor: 'var(--border)' }} title="Accepter">
                            <Check size={13} />
                          </button>
                          <button onClick={() => updateStatut(i.id, 'Rejeté')} className="p-1.5 rounded-lg border text-red-500 transition hover:bg-red-500/5" style={{ borderColor: 'var(--border)' }} title="Refuser">
                            <X size={13} />
                          </button>
                        </>
                      )}
                      <button onClick={() => setDeleteId(i.id)} className="p-1.5 rounded-lg border text-gray-400 transition hover:text-red-500" style={{ borderColor: 'var(--border)' }} title="Supprimer">
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
        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[11px] opacity-45">Page {page} / {totalPages}</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border transition disabled:opacity-30" style={{ borderColor: 'var(--border)' }}><ChevronLeft size={14} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border transition disabled:opacity-30" style={{ borderColor: 'var(--border)' }}><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* ── MODAL FICHE / TRAITEMENT CANDIDATURE ─────────── */}
      {selected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black flex items-center gap-1.5"><FileText size={14} /> Détails de la Demande</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:opacity-70"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              
              <div className="border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <p className="font-black text-base">{selected.prenom} {selected.nom}</p>
                <p className="text-[11px] opacity-50">Soumis le {selected.dateDemande}</p>
                <span className="flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-black w-fit"
                  style={{ backgroundColor: statutColor(selected.statut) + '18', color: statutColor(selected.statut) }}>
                  {statutIcon(selected.statut)} {selected.statut}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-45 flex items-center gap-1"><Mail size={11} /> Email</p>
                  <p className="font-semibold break-all">{selected.email}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-45 flex items-center gap-1"><Phone size={11} /> Téléphone</p>
                  <p className="font-semibold">{selected.telephone}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-45 flex items-center gap-1"><GraduationCap size={11} /> Filière</p>
                  <p className="font-semibold">{selected.filiere}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-45 flex items-center gap-1"><User size={11} /> Niveau ciblé</p>
                  <p className="font-semibold">{selected.niveauDemande}</p>
                </div>
              </div>

              {selected.remarque && (
                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-[11px]">
                  <strong>Motif / Note :</strong> {selected.remarque}
                </div>
              )}
            </div>

            {/* Décision dans la modale */}
            <div className="px-6 py-4 border-t flex justify-between gap-2" style={{ borderColor: 'var(--border)' }}>
              {selected.statut === 'En attente' ? (
                <div className="flex gap-2 w-full justify-start">
                  <button onClick={() => updateStatut(selected.id, 'Approuvé')} className="flex items-center gap-1 px-3 py-2 rounded-xl text-white bg-green-500 font-bold">
                    <Check size={12} /> Accepter
                  </button>
                  <button onClick={() => updateStatut(selected.id, 'Rejeté')} className="flex items-center gap-1 px-3 py-2 rounded-xl text-white bg-red-500 font-bold">
                    <X size={12} /> Refuser
                  </button>
                </div>
              ) : <div />}
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl font-bold border" style={{ borderColor: 'var(--border)' }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL SUPPRESSION ─────────────────────────────── */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black mb-1">Supprimer la demande ?</h2>
              <p className="text-xs opacity-55">Le dossier de ce candidat sera retiré définitivement de la liste.</p>
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