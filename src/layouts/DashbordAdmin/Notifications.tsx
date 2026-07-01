import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, Plus, Trash2, X, Send,
  Calendar, CheckCircle, AlertCircle, Bell, Users, GraduationCap, Info
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────
export type CibleNotification = 'Tous' | 'Étudiants' | 'Enseignants';
export type TypeNotification = 'Alerte' | 'Message' | 'Rappel' | 'Système';

interface NotificationAdmin {
  id: number;
  titre: string;
  message: string;
  cible: CibleNotification;
  type: TypeNotification;
  dateEnvoi: string;
  luPar: number; // Nombre d'utilisateurs ayant ouvert la notification
}

// Données de test réalistes
const INITIAL_NOTIFICATIONS: NotificationAdmin[] = [
  {
    id: 1,
    titre: 'Rappel : Clôture de la saisie des notes du 1er Semestre',
    message: 'Chers enseignants, merci de finaliser la saisie des notes de vos modules respectifs avant ce vendredi à 18h pour permettre les délibérations.',
    cible: 'Enseignants',
    type: 'Rappel',
    dateEnvoi: '2026-06-29 09:15',
    luPar: 42
  },
  {
    id: 2,
    titre: 'Alerte Météo : Suspension des cours en présentiel',
    message: 'En raison des fortes perturbations climatiques sur Antananarivo, les cours se feront exclusivement en ligne (e-learning) pour la journée de demain.',
    cible: 'Tous',
    type: 'Alerte',
    dateEnvoi: '2026-06-12 16:30',
    luPar: 512
  },
  {
    id: 3,
    titre: 'Mise à jour des profils étudiants requise',
    message: 'N\'oubliez pas de téléverser votre fiche de réinscription scannée dans votre espace personnel, onglet Documents.',
    cible: 'Étudiants',
    type: 'Système',
    dateEnvoi: '2026-05-02 11:00',
    luPar: 380
  }
];

const CIBLES: CibleNotification[] = ['Tous', 'Étudiants', 'Enseignants'];
const TYPES: TypeNotification[] = ['Alerte', 'Message', 'Rappel', 'Système'];

const EMPTY_FORM = {
  titre: '',
  message: '',
  cible: 'Tous' as CibleNotification,
  type: 'Message' as TypeNotification
};

export default function Notifications() {
  const { darkMode } = useTheme();
  const [data, setData] = useState<NotificationAdmin[]>(INITIAL_NOTIFICATIONS);
  const [search, setSearch] = useState('');
  const [filtreCible, setFiltreCible] = useState('');

  // États CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // ── Filtrage ────────────────────────────────────────────
  const filtered = data.filter(n => {
    const q = search.toLowerCase();
    const matchSearch = n.titre.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    const matchCible = filtreCible ? n.cible === filtreCible : true;
    return matchSearch && matchCible;
  });

  // ── Actions ─────────────────────────────────────────────
  const handleSend = () => {
    if (!form.titre || !form.message) {
      showToast('Veuillez remplir le titre et le contenu du message.');
      return;
    }

    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;
    const newId = data.length > 0 ? Math.max(...data.map(n => n.id)) + 1 : 1;

    const newNotification: NotificationAdmin = {
      id: newId,
      ...form,
      dateEnvoi: dateStr,
      luPar: 0
    };

    setData([newNotification, ...data]);
    setIsModalOpen(false);
    setForm(EMPTY_FORM);
    showToast('Notification push envoyée avec succès');
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      setData(data.filter(n => n.id !== deleteId));
      setDeleteId(null);
      showToast('Notification supprimée de l\'historique');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getTypeBadge = (type: TypeNotification) => {
    const styles = {
      Alerte: 'bg-red-500/10 text-red-500 border-red-500/20',
      Message: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      Rappel: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      Système: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    };
    return `px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${styles[type]}`;
  };

  const getCibleBadge = (cible: CibleNotification) => {
    switch (cible) {
      case 'Tous':
        return <span className="flex items-center gap-1 opacity-60"><Users size={12} /> Tout le campus</span>;
      case 'Étudiants':
        return <span className="flex items-center gap-1 text-blue-500 font-bold"><GraduationCap size={12} /> Espace Étudiants</span>;
      case 'Enseignants':
        return <span className="flex items-center gap-1 text-purple-500 font-bold"><Users size={12} /> Espace Profs</span>;
    }
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
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Centre de Notifications</h1>
          <p className="text-xs opacity-45 mt-1">Diffusez des alertes ou messages instantanés ciblés sur les tableaux de bord</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition hover:opacity-90 self-start sm:self-center" style={{ backgroundColor: 'var(--primary)' }}>
          <Plus size={14} /> Envoyer un flash
        </button>
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <Search size={14} className="opacity-40 shrink-0" />
          <input
            type="text" placeholder="Rechercher une ancienne notification..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
          />
        </div>
        <select value={filtreCible} onChange={e => setFiltreCible(e.target.value)}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none sm:w-52" style={inputStyle}>
          <option value="">Toutes les cibles</option>
          {CIBLES.map(c => <option key={c} value={c}>Cible : {c}</option>)}
        </select>
      </div>

      {/* Liste des notifications envoyées */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center opacity-40 text-xs border border-dashed rounded-2xl" style={{ borderColor: 'var(--border)' }}>
            Aucun historique de notification trouvé.
          </div>
        ) : (
          filtered.map(n => (
            <div key={n.id} className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition hover:bg-black/[0.01] dark:hover:bg-white/[0.01]" style={cardStyle}>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  n.type === 'Alerte' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  <Bell size={16} />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-sm tracking-tight leading-snug">{n.titre}</h3>
                    {getTypeBadge(n.type)}
                  </div>
                  <p className="text-xs opacity-70 leading-relaxed max-w-3xl">{n.message}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-[10px] opacity-45 font-medium">
                    <span className="flex items-center gap-1"><Calendar size={11} /> Envoyé le {n.dateEnvoi}</span>
                    <span>• Vu par {n.luPar} utilisateur{n.luPar > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[10px]">{getCibleBadge(n.cible)}</div>
                <button onClick={() => setDeleteId(n.id)} className="p-1.5 rounded-lg border text-red-500 transition hover:bg-red-500/5 self-end" style={{ borderColor: 'var(--border)' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal d'envoi / Création */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black">🚀 Diffuser un message push</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:opacity-70"><X size={16} /></button>
            </div>
            
            <div className="p-6 space-y-4 text-xs">
              {/* Titre */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Objet / Titre</label>
                <input name="titre" value={form.titre} onChange={handleChange} placeholder="ex: Modification exceptionnelle d'emploi du temps" className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>

              {/* Cible & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Groupe Cible</label>
                  <select name="cible" value={form.cible} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {CIBLES.map(c => <option key={c} value={c}>{c === 'Tous' ? 'Tout le monde' : c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Type d'alerte</label>
                  <select name="type" value={form.type} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Message à diffuser</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tapez votre annonce urgente ici..." className="w-full px-3 py-2.5 rounded-xl border focus:outline-none resize-none leading-relaxed" style={inputStyle} />
              </div>

              <div className="p-3 bg-blue-500/5 text-blue-500 rounded-xl flex items-start gap-2 text-[11px] border border-blue-500/10">
                <Info size={14} className="shrink-0 mt-0.5" />
                <p>En validant, ce message apparaîtra immédiatement sur les tableaux de bord de la cible sélectionnée.</p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl font-bold border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleSend} className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}><Send size={13} /> Envoyer maintenant</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={cardStyle}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <AlertCircle size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black">Supprimer la notification ?</h2>
              <p className="text-xs opacity-55">L'alerte n'apparaîtra plus dans les archives de l'administrateur, mais restera comptabilisée dans les flux déjà reçus.</p>
            </div>
            <div className="flex gap-3 justify-center text-xs">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl text-white bg-red-500 font-bold">Retirer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}