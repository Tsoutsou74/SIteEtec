import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

import { 
  BookOpen, Plus, Search, Edit2, Trash2, 
  Clock, Layers, X, Save, AlertCircle, Loader2 
} from 'lucide-react';

// ─── Interfaces ───────────────────────────────────────────
interface Cours {
  id: string;
  titre: string;
  code: string;
  classe: string;
  volumeHoraire: number;
  description: string;
}

export default function CoursPage() {
  const { darkMode } = useTheme();
  
  // ─── États Dynamiques ───────────────────────────────────
  const [listeCours, setListeCours] = useState<Cours[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCours, setEditingCours] = useState<Cours | null>(null);
  
  // États du formulaire
  const [formData, setFormData] = useState({
    titre: '',
    code: '',
    classe: '',
    volumeHoraire: 30,
    description: ''
  });

  const cardBg  = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';

  // ─── Charger les cours ──────────────────────
  const fetchCours = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setListeCours([
        { id: '1', titre: 'Algorithmique', code: 'ALG101', classe: 'L2 Info G1', volumeHoraire: 40, description: 'Bases de l\'algorithmique' },
        { id: '2', titre: 'Base de données', code: 'BDD201', classe: 'L3 Info G2', volumeHoraire: 30, description: 'Modèle relationnel et SQL' },
        { id: '3', titre: 'Génie logiciel', code: 'GL301', classe: 'M1 GL G1', volumeHoraire: 50, description: 'Méthodes agiles et gestion de projet' },
      ]);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchCours();
  }, []);

  // ─── Actions CRUD ───────────────────────────────────────
  
  // Ouvrir le modal (Ajout ou Édition)
  const openModal = (cours: Cours | null = null) => {
    if (cours) {
      setEditingCours(cours);
      setFormData({
        titre: cours.titre,
        code: cours.code,
        classe: cours.classe,
        volumeHoraire: cours.volumeHoraire,
        description: cours.description || ''
      });
    } else {
      setEditingCours(null);
      setFormData({ titre: '', code: '', classe: '', volumeHoraire: 30, description: '' });
    }
    setIsModalOpen(true);
  };

  // Soumission du Formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre || !formData.code || !formData.classe) return;

    if (editingCours) {
      setListeCours(prev => prev.map(c => c.id === editingCours.id ? { ...c, ...formData } : c));
    } else {
      const newCours = { id: Math.random().toString(36).substr(2, 9), ...formData };
      setListeCours(prev => [...prev, newCours]);
    }
    setIsModalOpen(false);
  };

  // Suppression
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      setListeCours(prev => prev.filter(c => c.id !== id));
    }
  };

  // Filtrage local pour la barre de recherche
  const coursFiltrés = listeCours.filter(c => 
    c.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.classe?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* ─── En-tête de la page ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <BookOpen className="text-[var(--primary)]" size={22} />
            Gestion des Cours
          </h1>
          <p className="text-xs opacity-50 mt-0.5">Créez, modifiez et organisez vos matières d'enseignement.</p>
        </div>

        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90 shadow-sm cursor-pointer"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Plus size={16} />
          Ajouter un cours
        </button>
      </div>

      {/* ─── Barre de Recherche / Filtre ─── */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs max-w-md"
        style={{ borderColor: 'var(--border)', backgroundColor: cardBg }}>
        <Search size={14} className="opacity-40" />
        <input 
          type="text" 
          placeholder="Rechercher par titre, code ou classe..." 
          className="bg-transparent outline-none w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ color: 'var(--text)' }} 
        />
      </div>

      {/* ─── Zone de contenu principal (Chargement vs Liste) ─── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2 opacity-50 text-xs">
          <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
          <p className="font-semibold">Chargement de vos modules de cours...</p>
        </div>
      ) : coursFiltrés.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-2xl opacity-40 space-y-2"
          style={{ borderColor: 'var(--border)' }}>
          <AlertCircle size={32} />
          <p className="text-xs font-semibold">Aucun cours trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coursFiltrés.map((cours) => (
            <div 
              key={cours.id}
              className="flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: cardBg, borderColor: 'var(--border)' }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md text-white tracking-wider"
                    style={{ backgroundColor: 'var(--primary)' }}>
                    {cours.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => openModal(cours)}
                      className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition cursor-pointer"
                      title="Modifier"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => handleDelete(cours.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xs font-bold leading-snug line-clamp-2 min-h-[2rem]">{cours.titre}</h3>
                <p className="text-[11px] opacity-60 mt-1 line-clamp-2 h-8">{cours.description || 'Aucune description fournie.'}</p>
              </div>

              {/* Métadonnées de la carte */}
              <div className="flex items-center justify-between border-t mt-4 pt-3 text-[10px] opacity-50 font-semibold"
                style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-1.5">
                  <Layers size={12} />
                  <span>{cours.classe}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>{cours.volumeHoraire}h en tout</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Modal d'Ajout / Modification ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all scale-100"
            style={{ backgroundColor: darkMode ? '#121212' : '#ffffff', borderColor: 'var(--border)' }}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-xs font-black uppercase tracking-wider">
                {editingCours ? 'Modifier le cours' : 'Créer un nouveau cours'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl border hover:opacity-70 transition cursor-pointer"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">Code</label>
                  <input 
                    type="text" required placeholder="Ex: INF-301"
                    className="w-full p-2.5 text-xs rounded-xl border outline-none font-bold"
                    style={{ backgroundColor: inputBg, borderColor: 'var(--border)', color: 'var(--text)' }}
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">Classe / Niveau</label>
                  <input 
                    type="text" required placeholder="Ex: L3 Informatique"
                    className="w-full p-2.5 text-xs rounded-xl border outline-none"
                    style={{ backgroundColor: inputBg, borderColor: 'var(--border)', color: 'var(--text)' }}
                    value={formData.classe}
                    onChange={(e) => setFormData({...formData, classe: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-50 uppercase">Titre du cours</label>
                <input 
                  type="text" required placeholder="Ex: Programmation orientée objet"
                  className="w-full p-2.5 text-xs rounded-xl border outline-none"
                  style={{ backgroundColor: inputBg, borderColor: 'var(--border)', color: 'var(--text)' }}
                  value={formData.titre}
                  onChange={(e) => setFormData({...formData, titre: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-50 uppercase">Volume Horaire (heures)</label>
                <input 
                  type="number" required min={1}
                  className="w-full p-2.5 text-xs rounded-xl border outline-none"
                  style={{ backgroundColor: inputBg, borderColor: 'var(--border)', color: 'var(--text)' }}
                  value={formData.volumeHoraire}
                  onChange={(e) => setFormData({...formData, volumeHoraire: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-50 uppercase">Description succincte (optionnel)</label>
                <textarea 
                  rows={3} placeholder="Objectifs pédagogiques, prérequis..."
                  className="w-full p-2.5 text-xs rounded-xl border outline-none resize-none"
                  style={{ backgroundColor: inputBg, borderColor: 'var(--border)', color: 'var(--text)' }}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Actions du Modal */}
              <div className="flex items-center justify-end gap-2 border-t pt-4 mt-2" style={{ borderColor: 'var(--border)' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border hover:opacity-70 transition cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 shadow-sm cursor-pointer"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <Save size={14} />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}