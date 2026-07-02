import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, Filter, GraduationCap, 
  Clock, User, BookMarked, Plus, MoreVertical, 
  Edit2, Trash2, X, Check
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

// ─── Interfaces ─────────────────────────────────────────────────────
interface Course {
  id: number;
  code: string;
  name: string;
  filiere: string;
  niveau: string;
  enseignant: string;
  heures: number;
  etudiants: number;
}

// ─── Données Initiales ──────────────────────────────────────────────
const INITIAL_COURSES: Course[] = [
  { id: 1, code: 'INF-301', name: 'Architecture Microservices & Cloud', filiere: 'Informatique', niveau: 'Master 1', enseignant: 'Dr. Fanilo', heures: 45, etudiants: 28 },
  { id: 2, code: 'INF-302', name: 'Intelligence Artificielle & NLP', filiere: 'Informatique', niveau: 'Master 1', enseignant: 'Mme Rabe', heures: 60, etudiants: 25 },
  { id: 3, code: 'INF-201', name: 'Développement Full-Stack (React & Spring)', filiere: 'Informatique', niveau: 'Licence 3', enseignant: 'M. Niavo', heures: 50, etudiants: 42 },
  { id: 4, code: 'MGT-101', name: 'Management Stratégique', filiere: 'Management', niveau: 'Licence 1', enseignant: 'Mme Miora', heures: 30, etudiants: 55 },
  { id: 5, code: 'MGT-204', name: 'Gestion de Projet Agile (Scrum)', filiere: 'Management', niveau: 'Licence 3', enseignant: 'M. Rakoto', heures: 36, etudiants: 38 },
  { id: 6, code: 'BTP-301', name: 'Calcul des Structures & Béton', filiere: 'BTP', niveau: 'Master 1', enseignant: 'Dr. Randria', heures: 55, etudiants: 19 },
];

const FILIERES = ['Toutes', 'Informatique', 'Management', 'BTP'];
const NIVEAUX = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'];

export default function AdminCours() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('Toutes');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  // ─── State pour le Formulaire (Ajout / Édition) ────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    filiere: 'Informatique',
    niveau: 'Licence 1',
    enseignant: '',
    heures: 30,
    etudiants: 0
  });

  // ─── Filtrage intelligent des cours ─────────────────────────────────
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.enseignant.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFiliere = selectedFiliere === 'Toutes' || course.filiere === selectedFiliere;

      return matchesSearch && matchesFiliere;
    });
  }, [courses, searchTerm, selectedFiliere]);

  // ─── Calculs Statistiques (Bento) ───────────────────────────────────
  const stats = useMemo(() => {
    return {
      total: filteredCourses.length,
      totalHours: filteredCourses.reduce((acc, c) => acc + c.heures, 0),
      totalStudents: filteredCourses.reduce((acc, c) => acc + c.etudiants, 0),
    };
  }, [filteredCourses]);

  // ─── Logique CRUD Actions ──────────────────────────────────────────
  const openAddModal = () => {
    setEditingCourse(null);
    setFormData({
      code: '',
      name: '',
      filiere: selectedFiliere === 'Toutes' ? 'Informatique' : selectedFiliere,
      niveau: 'Licence 1',
      enseignant: '',
      heures: 30,
      etudiants: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      filiere: course.filiere,
      niveau: course.niveau,
      enseignant: course.enseignant,
      heures: course.heures,
      etudiants: course.etudiants
    });
    setActiveMenu(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Voulez-vous vraiment supprimer ce cours ?')) {
      setCourses(prev => prev.filter(c => c.id !== id));
      setActiveMenu(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.enseignant) return;

    if (editingCourse) {
      // Action: UPDATE
      setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c));
    } else {
      // Action: CREATE
      const newCourse: Course = {
        id: Date.now(),
        ...formData
      };
      setCourses(prev => [newCourse, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* ── En-tête ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wide">Gestion des Programmes & Cours</h1>
          <p className="text-xs opacity-50">Visualisez, créez, modifiez ou supprimez les cours par filière académique.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition hover:opacity-90 cursor-pointer shrink-0"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Plus size={16} />
          Ajouter un cours
        </button>
      </div>

      {/* ── Bento Grid de Statistiques rapides ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
          <div className="p-3 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,128,0,0.1)', color: 'var(--primary)' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider opacity-50">Cours Affichés</p>
            <p className="text-lg font-black">{stats.total}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
          <div className="p-3 rounded-xl flex items-center justify-center text-blue-500"
            style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}>
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider opacity-50">Volume Horaire Global</p>
            <p className="text-lg font-black">{stats.totalHours} heures</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
          <div className="p-3 rounded-xl flex items-center justify-center text-amber-500"
            style={{ backgroundColor: 'rgba(245,158,11,0.1)' }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider opacity-50">Étudiants Engagés</p>
            <p className="text-lg font-black">{stats.totalStudents} inscrits</p>
          </div>
        </div>
      </div>

      {/* ── Barre d'outils (Recherche & Filtres) ── */}
      <div className="p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: 'rgba(255,255,255,0.01)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs flex-1 max-w-md"
          style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <Search size={15} className="opacity-40" />
          <input 
            type="text" 
            placeholder="Rechercher par titre, code ou enseignant..."
            className="bg-transparent outline-none w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <Filter size={14} className="opacity-40 mr-1 shrink-0" />
          {FILIERES.map(filiere => (
            <button
              key={filiere}
              onClick={() => setSelectedFiliere(filiere)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border"
              style={{
                borderColor: selectedFiliere === filiere ? 'var(--primary)' : 'var(--border)',
                backgroundColor: selectedFiliere === filiere ? 'rgba(0,180,0,0.12)' : 'transparent',
                color: selectedFiliere === filiere ? 'var(--primary)' : 'var(--text)',
                opacity: selectedFiliere === filiere ? 1 : 0.6
              }}
            >
              {filiere}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grille Bento des Cours ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div 
              key={course.id}
              className="p-5 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between h-[190px]"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                borderColor: 'var(--border)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: 'var(--primary)' }}>
                    {course.filiere}
                  </span>
                  <span className="text-[9px] font-bold opacity-60 px-2 py-0.5 rounded-md border"
                    style={{ borderColor: 'var(--border)' }}>
                    {course.niveau}
                  </span>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === course.id ? null : course.id)}
                    className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer text-xs">
                    <MoreVertical size={14} className="opacity-50" />
                  </button>
                  {activeMenu === course.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                      <div className="absolute right-0 mt-1 w-32 rounded-xl border shadow-xl z-20 overflow-hidden"
                        style={{ backgroundColor: 'rgba(20,20,20,0.95)', borderColor: 'var(--border)', backdropFilter: 'blur(10px)' }}>
                        <button 
                          onClick={() => openEditModal(course)}
                          className="w-full text-left px-3 py-2 text-[11px] font-bold flex items-center gap-2 hover:bg-white/10 transition text-blue-400">
                          <Edit2 size={12} /> Modifier
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="w-full text-left px-3 py-2 text-[11px] font-bold flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition border-t" style={{ borderColor: 'var(--border)' }}>
                          <Trash2 size={12} /> Supprimer
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="my-3 flex-1">
                <p className="text-[10px] font-black opacity-40 uppercase tracking-wider">{course.code}</p>
                <h3 className="text-sm font-black tracking-wide leading-snug line-clamp-2 mt-0.5">
                  {course.name}
                </h3>
              </div>

              <div className="pt-3 border-t flex items-center justify-between text-[11px] opacity-75"
                style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                  <User size={13} className="shrink-0 opacity-50" />
                  <span className="truncate font-semibold">{course.enseignant}</span>
                </div>
                <div className="flex items-center gap-3 font-bold shrink-0">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="opacity-50" /> {course.heures}h
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap size={13} className="opacity-50" /> {course.etudiants}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border border-dashed rounded-2xl opacity-40"
            style={{ borderColor: 'var(--border)' }}>
            <BookMarked size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold">Aucun cours ne correspond à vos critères.</p>
          </div>
        )}
      </div>

      {/* ── MODAL DE DIALOGUE (CRUD : AJOUT & ÉDITION) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden p-6 animate-fade-in"
            style={{ backgroundColor: 'rgba(20,20,20,0.98)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black uppercase tracking-wider">
                {editingCourse ? 'Modifier le Cours' : 'Ajouter un nouveau cours'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg opacity-50 hover:opacity-100 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Code</label>
                  <input type="text" required placeholder="INF-301"
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Intitulé du Cours</label>
                  <input type="text" required placeholder="Nom de la matière"
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Filière</label>
                  <select 
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-neutral-900 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.filiere}
                    onChange={e => setFormData({...formData, filiere: e.target.value})}
                  >
                    {FILIERES.filter(f => f !== 'Toutes').map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Niveau</label>
                  <select 
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-neutral-900 outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.niveau}
                    onChange={e => setFormData({...formData, niveau: e.target.value})}
                  >
                    {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Enseignant Responsable</label>
                <input type="text" required placeholder="Ex: Dr. Fanilo"
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                  style={{ borderColor: 'var(--border)' }}
                  value={formData.enseignant}
                  onChange={e => setFormData({...formData, enseignant: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Volume Horaire (h)</label>
                  <input type="number" required min={1}
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.heures}
                    onChange={e => setFormData({...formData, heures: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Étudiants inscrits</label>
                  <input type="number" min={0}
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.etudiants}
                    onChange={e => setFormData({...formData, etudiants: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

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
                  {editingCourse ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}