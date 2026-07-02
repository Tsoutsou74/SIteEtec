import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  BookOpen, Plus, Search, Edit2, Trash2, 
  Clock, Users, Layers, X, Save, AlertCircle 
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

// ─── Données Initiales de Démo ───────────────────────────
const INITIAL_COURS: Cours[] = [
  { id: '1', titre: 'Développement Web Avancé (React & Node.js)', code: 'DEV-401', classe: 'L3 Informatique', volumeHoraire: 45, description: 'Architecture SPA, gestion d\'état globale et API REST.' },
  { id: '2', titre: 'Architecture des Systèmes d\'Information', code: 'SI-402', classe: 'M1 Génie Logiciel', volumeHoraire: 30, description: 'Modélisation UML avancée, patterns architecturaux et microservices.' },
  { id: '3', titre: 'Bases de Données Relationnelles & NoSQL', code: 'BD-302', classe: 'L2 Informatique', volumeHoraire: 40, description: 'Optimisation de requêtes SQL et introduction à MongoDB.' },
];

export default function CoursPage() {
  const { darkMode } = useTheme();
  
  // ─── États ──────────────────────────────────────────────
  const [listeCours, setListeCours] = useState<Cours[]>(INITIAL_COURS);
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

  // ─── Actions CRUD ───────────────────────────────────────
  
  // Ouvrir le modal pour Ajout ou Edition
  const openModal = (cours: Cours | null = null) => {
    if (cours) {
      setEditingCours(cours);
      setFormData({
        titre: cours.titre,
        code: cours.code,
        classe: cours.classe,
        volumeHoraire: cours.volumeHoraire,
        description: cours.description
      });
    } else {
      setEditingCours(null);
      setFormData({ titre: '', code: '', classe: '', volumeHoraire: 30, description: '' });
    }
    setIsModalOpen(true);
  };

  // Soumission du Formulaire (Create & Update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre || !formData.code || !formData.classe) return;

    if (editingCours) {
      // Update
      setListeCours(prev => prev.map(c => c.id === editingCours.id ? { ...c, ...formData } : c));
    } else {
      // Create
      const newCours: Cours = {
        id: Date.now().toString(),
        ...formData
      };
      setListeCours(prev => [newCours, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Suppression (Delete)
  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      setListeCours(prev => prev.filter(c => c.id !== id));
    }
  };

  // Filtrage pour la recherche
  const coursFiltrés = listeCours.filter(c => 
    c.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.classe.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* ─── Liste des Cours (Cards) ─── */}
      {coursFiltrés.length === 0 ? (
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