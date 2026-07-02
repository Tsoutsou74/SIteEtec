import React, { useState, useMemo } from 'react';
import { 
  FileText, Plus, Search, MoreVertical, Edit2, 
  Trash2, X, Check, User, Quote, Image as ImageIcon, 
  Calendar, Eye, CheckCircle, AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ─── Interfaces ─────────────────────────────────────────────────────
interface PresidentMessage {
  id: number;
  authorName: string;
  authorTitle: string; // Ex: Président Fondateur, Directeur Général
  quote: string;      // La phrase d'accroche mise en valeur
  content: string;    // Le corps du message complet
  imageUrl: string;   // Image encodée en Base64 ou URL locale
  dateUpdated: string;
  isActive: boolean;  // Un seul message peut être actif à la fois sur la vitrine
}

// ─── Données Initiales ──────────────────────────────────────────────
const INITIAL_MESSAGES: PresidentMessage[] = [
  {
    id: 1,
    authorName: 'Dr. Fanilo Rakoto',
    authorTitle: 'Président Directeur Général de l’E-TEC',
    quote: 'L’excellence académique au cœur du développement technologique de Madagascar.',
    content: 'Bienvenue à tous sur la plateforme officielle de l’E-TEC. Depuis notre création à Antananarivo, notre mission reste inchangée : former des cadres et des ingénieurs visionnaires, pragmatiques et immédiatement opérationnels sur le marché mondial. À travers nos parcours innovants en Informatique, IA et BTP, nous bâtissons l’avenir de notre nation.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400',
    dateUpdated: '2026-07-02',
    isActive: true
  },
  {
    id: 2,
    authorName: 'Dr. Fanilo Rakoto',
    authorTitle: 'Président Fondateur',
    quote: 'Rejoindre l’E-TEC, c’est choisir de devenir un actor majeur du monde de demain.',
    content: 'Message d’archive pour la rentrée solennelle précédente. Nous mettons l’accent sur l’apprentissage pratique et l’intégration professionnelle directe.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400',
    dateUpdated: '2025-10-15',
    isActive: false
  }
];

export default function AdminMotsduPresidents() {
  const [messages, setMessages] = useState<PresidentMessage[]>(INITIAL_MESSAGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<PresidentMessage | null>(null);

  // ─── State pour le Formulaire (Ajout / Édition) ────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<PresidentMessage | null>(null);
  const [formData, setFormData] = useState({
    authorName: '',
    authorTitle: '',
    quote: '',
    content: '',
    imageUrl: '',
    isActive: false
  });

  // ─── Gestion de l'image locale (Ordinateur) ───────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── Filtrage ──────────────────────────────────────────────────────
  const filteredMessages = useMemo(() => {
    return messages.filter(m => 
      m.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

  // ─── Actions CRUD ───────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingMessage(null);
    setFormData({
      authorName: 'Dr. Fanilo Rakoto',
      authorTitle: 'Président Directeur Général',
      quote: '',
      content: '',
      imageUrl: '',
      isActive: messages.length === 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (msg: PresidentMessage) => {
    setEditingMessage(msg);
    setFormData({
      authorName: msg.authorName,
      authorTitle: msg.authorTitle,
      quote: msg.quote,
      content: msg.content,
      imageUrl: msg.imageUrl,
      isActive: msg.isActive
    });
    setActiveMenu(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: number) => {
    setMessages(prev => prev.map(m => ({
      ...m,
      isActive: m.id === id ? true : false
    })));
  };

  const handleDelete = (id: number) => {
    const target = messages.find(m => m.id === id);
    if (target?.isActive) {
      alert("Impossible de supprimer le message actuellement actif en vitrine. Activez-en un autre d'abord.");
      return;
    }
    if (confirm('Voulez-vous vraiment supprimer cet éditorial de vos archives ?')) {
      setMessages(prev => prev.filter(m => m.id !== id));
      setActiveMenu(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName || !formData.quote || !formData.content || !formData.imageUrl) {
      alert("Veuillez remplir tous les champs et choisir une photo officielle.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (editingMessage) {
      setMessages(prev => {
        const updated = prev.map(m => m.id === editingMessage.id ? { ...m, ...formData, dateUpdated: today } : m);
        if (formData.isActive) {
          return updated.map(m => m.id === editingMessage.id ? m : { ...m, isActive: false });
        }
        return updated;
      });
    } else {
      const newMsg: PresidentMessage = {
        id: Date.now(),
        ...formData,
        dateUpdated: today
      };
      setMessages(prev => {
        const nextList = [...prev, newMsg];
        if (formData.isActive) {
          return nextList.map(m => m.id === newMsg.id ? m : { ...m, isActive: false });
        }
        return nextList;
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── En-tête ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wide">Le Mot du Président</h1>
          <p className="text-xs opacity-50">Éditez et gérez le message éditorial d'accueil affiché sur la vitrine publique.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition hover:opacity-90 cursor-pointer shrink-0"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Plus size={16} />
          Nouvel Éditorial
        </button>
      </div>

      {/* ── Barre d'outils / Recherche ── */}
      <div className="p-4 rounded-2xl border flex items-center gap-2 text-xs max-w-md"
        style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <Search size={15} className="opacity-40" />
        <input 
          type="text" 
          placeholder="Rechercher dans les messages..."
          className="bg-transparent outline-none w-full text-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ── Liste des Messages sous forme de Grille Bento ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredMessages.length > 0 ? (
          filteredMessages.map(msg => (
            <div 
              key={msg.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                msg.isActive ? 'shadow-md border-green-500/30' : ''
              }`}
              style={{ 
                backgroundColor: msg.isActive ? 'rgba(0,180,0,0.02)' : 'rgba(255,255,255,0.01)', 
                borderColor: msg.isActive ? 'rgba(0,180,0,0.3)' : 'var(--border)'
              }}
            >
              {/* Indicateur de statut en ligne */}
              {msg.isActive && (
                <div className="absolute top-0 right-0 bg-green-600 text-white font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow flex items-center gap-1">
                  <CheckCircle size={10} /> En Ligne (Vitrine)
                </div>
              )}

              <div className="space-y-4">
                {/* Profil Header */}
                <div className="flex items-center gap-3 pr-16">
                  <img 
                    src={msg.imageUrl} 
                    alt={msg.authorName} 
                    className="w-12 h-12 rounded-xl object-cover border"
                    style={{ borderColor: 'var(--border)' }}
                  />
                  <div>
                    <h3 className="text-xs font-black tracking-wide">{msg.authorName}</h3>
                    <p className="text-[11px] opacity-50 font-bold">{msg.authorTitle}</p>
                  </div>
                </div>

                {/* Accroche / Citation */}
                <div className="p-3 rounded-xl border italic text-xs font-medium relative opacity-90 bg-black/5"
                  style={{ borderColor: 'var(--border)' }}>
                  <Quote size={12} className="absolute -top-1.5 left-2 opacity-20 text-green-500" />
                  "{msg.quote}"
                </div>

                {/* Corps de texte abrégé */}
                <p className="text-xs opacity-70 line-clamp-3 leading-relaxed">
                  {msg.content}
                </p>
              </div>

              {/* Pied de carte : Actions et dates */}
              <div className="mt-5 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[10px] opacity-40 flex items-center gap-1 font-semibold">
                  <Calendar size={11} /> Mis à jour : {msg.dateUpdated}
                </span>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPreviewOpen(msg)}
                    className="p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 hover:bg-white/5 opacity-75 hover:opacity-100 transition cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Eye size={12} /> Aperçu
                  </button>

                  {!msg.isActive && (
                    <button 
                      onClick={() => handleToggleActive(msg.id)}
                      className="px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-green-500 bg-green-500/5 hover:bg-green-500/10 border border-green-500/20 transition cursor-pointer"
                    >
                      Mettre en ligne
                    </button>
                  )}

                  {/* Bouton d'action standard */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === msg.id ? null : msg.id)}
                      className="p-1.5 rounded-lg border hover:bg-white/5 transition cursor-pointer"
                      style={{ borderColor: 'var(--border)' }}>
                      <MoreVertical size={13} className="opacity-50" />
                    </button>
                    {activeMenu === msg.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                        <div className="absolute right-0 bottom-full mb-1 w-32 rounded-xl border shadow-xl z-20 overflow-hidden"
                          style={{ backgroundColor: 'rgba(20,20,20,0.95)', borderColor: 'var(--border)', backdropFilter: 'blur(10px)' }}>
                          <button 
                            onClick={() => openEditModal(msg)}
                            className="w-full text-left px-3 py-2 text-[11px] font-bold flex items-center gap-2 hover:bg-white/10 transition text-blue-400">
                            <Edit2 size={12} /> Modifier
                          </button>
                          <button 
                            onClick={() => handleDelete(msg.id)}
                            className="w-full text-left px-3 py-2 text-[11px] font-bold flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition border-t" style={{ borderColor: 'var(--border)' }}>
                            <Trash2 size={12} /> Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border border-dashed rounded-2xl opacity-40"
            style={{ borderColor: 'var(--border)' }}>
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold">Aucun message éditorial enregistré.</p>
          </div>
        )}
      </div>

      {/* ── MODAL DE REACTION ET CRÉATION (CRUD) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden p-6 animate-fade-in"
            style={{ backgroundColor: 'rgba(20,20,20,0.98)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black uppercase tracking-wider">
                {editingMessage ? 'Modifier l’Éditorial' : 'Créer un nouvel Éditorial'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg opacity-50 hover:opacity-100 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Nom du Signataire</label>
                  <input type="text" required placeholder="Ex: Dr. Fanilo Rakoto"
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.authorName}
                    onChange={e => setFormData({...formData, authorName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Titre / Fonction officielle</label>
                  <input type="text" required placeholder="Ex: Président Directeur Général"
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.authorTitle}
                    onChange={e => setFormData({...formData, authorTitle: e.target.value})}
                  />
                </div>
              </div>

              {/* ── Champ Importation Image d'ordinateur ── */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">
                  Photo Officielle du Président
                </label>
                
                <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <div className="w-16 h-16 rounded-xl border overflow-hidden shrink-0 flex items-center justify-center bg-black/20" style={{ borderColor: 'var(--border)' }}>
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Aperçu président" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="opacity-30" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="president-photo-upload"
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                    <label 
                      htmlFor="president-photo-upload"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition hover:bg-white/5 bg-white/[0.01] active:scale-95"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <Plus size={14} />
                      Choisir une image depuis l'ordinateur
                    </label>
                    <p className="text-[10px] opacity-40">Format recommandé : Carré ou 4:3 (PNG, JPG, WebP)</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Accroche / Citation phare</label>
                <input type="text" required placeholder="Une phrase marquante mise en relief..."
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                  style={{ borderColor: 'var(--border)' }}
                  value={formData.quote}
                  onChange={e => setFormData({...formData, quote: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Corps de l'Éditorial</label>
                <textarea required placeholder="Saisissez l'intégralité du message ici..." rows={5}
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500 resize-none leading-relaxed"
                  style={{ borderColor: 'var(--border)' }}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>

              <div className="py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold">
                  <input type="checkbox"
                    className="rounded accent-green-600 scale-110"
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  />
                  Activer immédiatement et remplacer l'ancien message vitrine
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border transition hover:bg-white/5 cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <Check size={14} />
                  {editingMessage ? 'Enregistrer' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL APERÇU LIVE (PREVIEW VITRINE SIMULÉE) ── */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden p-6 text-white bg-neutral-900"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-green-400 flex items-center gap-1">
                <Eye size={12} /> Rendu d'intégration sur la Page Vitrine
              </span>
              <button onClick={() => setIsPreviewOpen(null)} className="p-1 rounded-lg opacity-50 hover:opacity-100 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Layout type Section Vitrine d'accueil */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start py-2">
              <div className="md:col-span-1 flex flex-col items-center text-center space-y-2">
                <img 
                  src={isPreviewOpen.imageUrl} 
                  alt={isPreviewOpen.authorName} 
                  className="w-32 h-32 rounded-2xl object-cover shadow-xl border-2 border-green-500"
                />
                <div>
                  <h4 className="text-sm font-black">{isPreviewOpen.authorName}</h4>
                  <p className="text-[11px] opacity-40">{isPreviewOpen.authorTitle}</p>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div className="text-emerald-400 font-serif italic text-sm md:text-base border-l-2 border-emerald-500 pl-3 leading-snug">
                  "{isPreviewOpen.quote}"
                </div>
                <p className="text-xs opacity-80 leading-relaxed whitespace-pre-line font-medium">
                  {isPreviewOpen.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}