import React, { useState, useMemo, useEffect } from 'react';
import { 
  Presentation, Plus, Search, MoreVertical, Edit2, 
  Trash2, X, Check, Link, Image as ImageIcon, 
  Power, FileText, Loader2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/ApiService';

// ─── Interfaces ─────────────────────────────────────────────────────
interface Slide {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  order: number;
}

export default function AdminSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  // ─── State pour le Formulaire (Ajout / Édition) ────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaText: 'En savoir plus',
    ctaLink: '/',
    isActive: true,
    order: 1
  });

  // ─── Chargement initial depuis l'API ────────────────────────────────
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ApiService.slides.getAll();
      setSlides(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les slides. Vérifie que le service est bien démarré.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Filtrage en temps réel ────────────────────────────────────────
  const filteredSlides = useMemo(() => {
    return slides
      .filter(slide => slide.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.order - b.order);
  }, [slides, searchTerm]);

  // ─── Statistiques Bento ─────────────────────────────────────────────
  const stats = useMemo(() => {
    return {
      total: slides.length,
      active: slides.filter(s => s.isActive).length,
    };
  }, [slides]);

  // ─── Actions CRUD ───────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      ctaText: 'En savoir plus',
      ctaLink: '/',
      isActive: true,
      order: slides.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (slide: Slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      imageUrl: slide.imageUrl,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
      isActive: slide.isActive,
      order: slide.order
    });
    setActiveMenu(null);
    setIsModalOpen(true);
  };

  const toggleStatus = async (slide: Slide) => {
    const updated = { ...slide, isActive: !slide.isActive };
    // mise à jour optimiste
    setSlides(prev => prev.map(s => s.id === slide.id ? updated : s));
    try {
      await ApiService.slides.update(slide.id, updated);
    } catch (err) {
      console.error(err);
      // rollback en cas d'échec
      setSlides(prev => prev.map(s => s.id === slide.id ? slide : s));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous supprimer ce slide de l’écran d’accueil vitrine ?')) return;

    const previous = slides;
    setSlides(prev => prev.filter(s => s.id !== id));
    setActiveMenu(null);

    try {
      await ApiService.slides.delete(id);
    } catch (err) {
      console.error(err);
      setSlides(previous); // rollback
      alert("La suppression a échoué, réessaie.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) return;

    setIsSaving(true);
    try {
      if (editingSlide) {
        const res = await ApiService.slides.update(editingSlide.id, formData);
        const updatedSlide: Slide = res.data ?? { ...editingSlide, ...formData };
        setSlides(prev => prev.map(s => s.id === editingSlide.id ? updatedSlide : s));
      } else {
        const res = await ApiService.slides.create(formData);
        const newSlide: Slide = res.data;
        setSlides(prev => [...prev, newSlide]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("L'enregistrement a échoué, vérifie les champs et réessaie.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── États de chargement / erreur ────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 gap-2 opacity-60">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-xs font-bold">Chargement des slides...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center border border-dashed rounded-2xl opacity-70" style={{ borderColor: 'var(--border)' }}>
        <FileText size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-xs font-bold mb-3">{error}</p>
        <button
          onClick={fetchSlides}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── En-tête ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wide">Gestion des Slides (Vitrine)</h1>
          <p className="text-xs opacity-50">Configurez et ordonnez le carrousel principal de la page d'accueil.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition hover:opacity-90 cursor-pointer shrink-0"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Plus size={16} />
          Ajouter un Slide
        </button>
      </div>

      {/* ── Statistiques Bento ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
          <div className="p-3 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,128,0,0.1)', color: 'var(--primary)' }}>
            <Presentation size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider opacity-50">Total Bannières</p>
            <p className="text-lg font-black">{stats.total}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
          <div className="p-3 rounded-xl flex items-center justify-center text-blue-500"
            style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}>
            <Power size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider opacity-50">Slides Actifs en Ligne</p>
            <p className="text-lg font-black">{stats.active} visibles</p>
          </div>
        </div>
      </div>

      {/* ── Outils de recherche ── */}
      <div className="p-4 rounded-2xl border flex items-center gap-2 text-xs max-w-md"
        style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <Search size={15} className="opacity-40" />
        <input 
          type="text" 
          placeholder="Rechercher par titre de slide..."
          className="bg-transparent outline-none w-full text-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ── Liste des Slides sous forme de grille ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSlides.length > 0 ? (
          filteredSlides.map(slide => (
            <div 
              key={slide.id}
              className="rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                borderColor: 'var(--border)',
              }}
            >
              {/* Image de fond simulée avec overlay de contenu */}
              <div className="relative h-44 bg-neutral-800 bg-cover bg-center flex flex-col justify-end p-4"
                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url(${slide.imageUrl})` }}>
                
                {/* Actions et Status du haut */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md bg-black/60 border text-white"
                    style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
                    ORDRE : {slide.order}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Toggle Switch d'activation rapide */}
                    <button 
                      onClick={() => toggleStatus(slide)}
                      className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border flex items-center gap-1 text-white"
                      style={{ 
                        backgroundColor: slide.isActive ? 'rgba(0,180,0,0.7)' : 'rgba(220,38,38,0.7)',
                        borderColor: 'transparent'
                      }}
                    >
                      <Power size={10} /> {slide.isActive ? 'Actif' : 'Masqué'}
                    </button>

                    {/* Menu contextuel */}
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === slide.id ? null : slide.id)}
                        className="p-1 rounded-lg bg-black/50 text-white hover:bg-black/80 transition cursor-pointer">
                        <MoreVertical size={14} />
                      </button>
                      {activeMenu === slide.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                          <div className="absolute right-0 mt-1 w-32 rounded-xl border shadow-xl z-20 overflow-hidden"
                            style={{ backgroundColor: 'rgba(20,20,20,0.95)', borderColor: 'var(--border)', backdropFilter: 'blur(10px)' }}>
                            <button 
                              onClick={() => openEditModal(slide)}
                              className="w-full text-left px-3 py-2 text-[11px] font-bold flex items-center gap-2 hover:bg-white/10 transition text-blue-400">
                              <Edit2 size={12} /> Modifier
                            </button>
                            <button 
                              onClick={() => handleDelete(slide.id)}
                              className="w-full text-left px-3 py-2 text-[11px] font-bold flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition border-t" style={{ borderColor: 'var(--border)' }}>
                              <Trash2 size={12} /> Supprimer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contenu textuel sur l'image */}
                <div className="text-white space-y-1">
                  <h3 className="text-sm font-black tracking-wide line-clamp-1">{slide.title}</h3>
                  <p className="text-[11px] opacity-70 line-clamp-2 leading-tight font-medium">{slide.subtitle}</p>
                </div>
              </div>

              {/* Barre d'info d'action en bas (Lien et bouton vitrine) */}
              <div className="p-3 border-t flex items-center justify-between text-[11px] opacity-75"
                style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <Link size={12} className="opacity-50" />
                  <span className="truncate font-semibold opacity-60">Lien : {slide.ctaLink}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border bg-white/5"
                  style={{ borderColor: 'var(--border)' }}>
                  Bouton : {slide.ctaText}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border border-dashed rounded-2xl opacity-40"
            style={{ borderColor: 'var(--border)' }}>
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold">Aucun slide ne correspond aux filtres.</p>
          </div>
        )}
      </div>

      {/* ── MODAL CRUD (AJOUT & ÉDITION) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden p-6 animate-fade-in"
            style={{ backgroundColor: 'rgba(20,20,20,0.98)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black uppercase tracking-wider">
                {editingSlide ? 'Modifier le Slide' : 'Créer un nouveau Slide'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg opacity-50 hover:opacity-100 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Titre Principal</label>
                <input type="text" required placeholder="Ex: Inscriptions Ouvertes 2026"
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                  style={{ borderColor: 'var(--border)' }}
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Sous-titre / Description</label>
                <textarea required placeholder="Courte description percutante pour l'audience..." rows={2}
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500 resize-none"
                  style={{ borderColor: 'var(--border)' }}
                  value={formData.subtitle}
                  onChange={e => setFormData({...formData, subtitle: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">URL de l'image de fond</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs flex-1"
                    style={{ borderColor: 'var(--border)' }}>
                    <ImageIcon size={14} className="opacity-40" />
                    <input type="url" required placeholder="https://images.unsplash.com/..."
                      className="bg-transparent outline-none w-full text-xs"
                      value={formData.imageUrl}
                      onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Section d'alignement CTA (Bouton d'action) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Texte du Bouton (CTA)</label>
                  <input type="text" required placeholder="Ex: En savoir plus"
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.ctaText}
                    onChange={e => setFormData({...formData, ctaText: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Lien de redirection</label>
                  <input type="text" required placeholder="Ex: /formations ou URL externe"
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.ctaLink}
                    onChange={e => setFormData({...formData, ctaLink: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Ordre d'affichage</label>
                  <input type="number" required min={1}
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.order}
                    onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold py-2">
                    <input type="checkbox"
                      className="rounded accent-green-600 scale-110"
                      checked={formData.isActive}
                      onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    />
                    Rendre ce slide actif immédiatement
                  </label>
                </div>
              </div>

              {/* Actions du Modal */}
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
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {editingSlide ? 'Enregistrer' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}