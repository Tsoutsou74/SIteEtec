import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Search, MoreVertical, Edit2, 
  Trash2, X, Check, Shield, Mail, Phone, 
  ChevronDown, ChevronUp, Layers
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ─── Interfaces ─────────────────────────────────────────────────────
interface Member {
  id: number;
  name: string;
  role: string;
  category: 'Direction' | 'Mentions' | 'Administration' | 'Enseignants';
  email: string;
  phone: string;
  imageUrl?: string;
  order: number; // Pour gérer la priorité d'affichage
}

// ─── Données Initiales ──────────────────────────────────────────────
const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: 'Dr. Fanilo Rakoto', role: 'Directeur Général', category: 'Direction', email: 'direction@etec.mg', phone: '+261 34 00 123 45', order: 1 },
  { id: 2, name: 'Mme Miora Andriana', role: 'Directrice des Études', category: 'Direction', email: 'm.andriana@etec.mg', phone: '+261 32 00 123 46', order: 2 },
  { id: 3, name: 'M. Niavo Ranaivo', role: 'Chef de Mention Informatique', category: 'Mentions', email: 'n.ranaivo@etec.mg', phone: '+261 33 00 555 01', order: 3 },
  { id: 4, name: 'Dr. Randria Sylvain', role: 'Chef de Mention BTP', category: 'Mentions', email: 's.randria@etec.mg', phone: '+261 34 00 555 02', order: 4 },
  { id: 5, name: 'Mme Rabe Justine', role: 'Responsable Scolarité', category: 'Administration', email: 'scolarite@etec.mg', phone: '+261 32 00 777 88', order: 5 },
  { id: 6, name: 'M. Solo Herilanto', role: 'Enseignant Réseaux & Systèmes', category: 'Enseignants', email: 's.herilanto@etec.mg', phone: '+261 33 00 999 11', order: 6 },
];

const CATEGORIES = ['Direction', 'Mentions', 'Administration', 'Enseignants'] as const;

export default function AdminOrganigramme() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  
  // Section toggle pour replier/déplier les catégories dans l'UI
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // ─── State pour le Formulaire (Ajout / Édition) ────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: 'Direction' as Member['category'],
    email: '',
    phone: '',
    order: 1
  });

  // ─── Filtrage en temps réel ────────────────────────────────────────
  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  // ─── Regroupement par catégorie hiérarchique ───────────────────────
  const groupedMembers = useMemo(() => {
    const groups: Record<Member['category'], Member[]> = {
      Direction: [],
      Mentions: [],
      Administration: [],
      Enseignants: []
    };
    
    filteredMembers.forEach(m => {
      groups[m.category].push(m);
    });

    // Trier chaque groupe par son ordre de priorité
    Object.keys(groups).forEach(key => {
      groups[key as Member['category']].sort((a, b) => a.order - b.order);
    });

    return groups;
  }, [filteredMembers]);

  // ─── Actions CRUD ───────────────────────────────────────────────────
  const openAddModal = (category?: Member['category']) => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      category: category || 'Direction',
      email: '',
      phone: '',
      order: members.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      category: member.category,
      email: member.email,
      phone: member.phone,
      order: member.order
    });
    setActiveMenu(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Voulez-vous vraiment retirer ce membre de l’organigramme officiel ?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
      setActiveMenu(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.email) return;

    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...formData } : m));
    } else {
      const newMember: Member = {
        id: Date.now(),
        ...formData
      };
      setMembers(prev => [...prev, newMember]);
    }
    setIsModalOpen(false);
  };

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── En-tête ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wide">Organigramme de l'Université</h1>
          <p className="text-xs opacity-50">Gérez la structure hiérarchique, administrative et pédagogique de l'E-TEC.</p>
        </div>
        <button 
          onClick={() => openAddModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition hover:opacity-90 cursor-pointer shrink-0"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <Plus size={16} />
          Ajouter un Responsable
        </button>
      </div>

      {/* ── Outils de Recherche ── */}
      <div className="p-4 rounded-2xl border flex items-center gap-2 text-xs max-w-md"
        style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <Search size={15} className="opacity-40" />
        <input 
          type="text" 
          placeholder="Rechercher par nom, rôle ou email..."
          className="bg-transparent outline-none w-full text-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ── Liste Hiérarchique ── */}
      <div className="space-y-8">
        {CATEGORIES.map(category => {
          const categoryMembers = groupedMembers[category];
          const isCollapsed = collapsedCategories[category];

          if (categoryMembers.length === 0 && searchTerm) return null;

          return (
            <div key={category} className="space-y-3">
              {/* Entête de Catégorie interchangeable */}
              <div 
                onClick={() => toggleCategoryCollapse(category)}
                className="flex items-center justify-between border-b pb-2 cursor-pointer group"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-2">
                  <Layers size={14} className="opacity-50" style={{ color: category === 'Direction' ? 'var(--primary)' : 'inherit' }} />
                  <h2 className="text-xs font-black tracking-widest uppercase">
                    {category} <span className="text-[10px] opacity-40 ml-1 font-normal">({categoryMembers.length})</span>
                  </h2>
                </div>
                <button className="opacity-50 group-hover:opacity-100 transition">
                  {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
              </div>

              {/* Grille des membres sous la catégorie */}
              {!isCollapsed && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryMembers.length > 0 ? (
                    categoryMembers.map(member => (
                      <div 
                        key={member.id}
                        className="p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative group"
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.01)', 
                          borderColor: 'var(--border)',
                        }}
                      >
                        {/* Haut du badge de membre */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar Virtuel circulaire stylisé */}
                            <div className="w-10 h-10 rounded-full font-black text-xs flex items-center justify-center shrink-0 border uppercase"
                              style={{ 
                                backgroundColor: member.category === 'Direction' ? 'rgba(0,180,0,0.1)' : 'rgba(255,255,255,0.03)',
                                borderColor: member.category === 'Direction' ? 'var(--primary)' : 'var(--border)',
                                color: member.category === 'Direction' ? 'var(--primary)' : 'var(--text)'
                              }}>
                              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-xs font-black tracking-wide truncate">{member.name}</h3>
                              <p className="text-[11px] font-bold opacity-60 truncate" style={{ color: member.category === 'Direction' ? 'var(--primary)' : 'var(--text)' }}>
                                {member.role}
                              </p>
                            </div>
                          </div>

                          {/* Menu d'action contextuel */}
                          <div className="relative shrink-0">
                            <button 
                              onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                              className="p-1 rounded-lg hover:bg-white/5 transition cursor-pointer">
                              <MoreVertical size={13} className="opacity-40" />
                            </button>
                            {activeMenu === member.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                <div className="absolute right-0 mt-1 w-32 rounded-xl border shadow-xl z-20 overflow-hidden"
                                  style={{ backgroundColor: 'rgba(20,20,20,0.95)', borderColor: 'var(--border)', backdropFilter: 'blur(10px)' }}>
                                  <button 
                                    onClick={() => openEditModal(member)}
                                    className="w-full text-left px-3 py-2 text-[11px] font-bold flex items-center gap-2 hover:bg-white/10 transition text-blue-400">
                                    <Edit2 size={12} /> Modifier
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(member.id)}
                                    className="w-full text-left px-3 py-2 text-[11px] font-bold flex items-center gap-2 text-red-500 hover:bg-red-500/10 transition border-t" style={{ borderColor: 'var(--border)' }}>
                                    <Trash2 size={12} /> Retirer
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Liens de contact en bas */}
                        <div className="mt-4 pt-3 border-t space-y-1 text-[10px] opacity-50" style={{ borderColor: 'var(--border)' }}>
                          <div className="flex items-center gap-2 truncate">
                            <Mail size={11} className="shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={11} className="shrink-0" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-4 px-4 text-center border border-dashed rounded-2xl opacity-30 text-[11px] font-medium"
                      style={{ borderColor: 'var(--border)' }}>
                      Aucun membre enregistré dans cette catégorie.{' '}
                      <span className="text-green-500 underline cursor-pointer font-bold" onClick={() => openAddModal(category)}>
                        Ajouter maintenant
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── MODAL DE MODIFICATION ET CRÉATION (CRUD) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden p-6 animate-fade-in"
            style={{ backgroundColor: 'rgba(20,20,20,0.98)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-black uppercase tracking-wider">
                {editingMember ? 'Modifier le Responsable' : 'Ajouter à l’Organigramme'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg opacity-50 hover:opacity-100 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Nom Complet</label>
                <input type="text" required placeholder="Ex: Dr. Fanilo Rakoto"
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                  style={{ borderColor: 'var(--border)' }}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Poste / Rôle</label>
                  <input type="text" required placeholder="Ex: Directeur Général"
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Catégorie Niveau</label>
                  <select 
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-neutral-900 outline-none text-white"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Member['category']})}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Adresse Email Pro</label>
                <input type="email" required placeholder="nom@etec.mg"
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                  style={{ borderColor: 'var(--border)' }}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Téléphone</label>
                  <input type="text" required placeholder="+261 34 00 123 45"
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none focus:border-green-500"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-wider opacity-50 block mb-1">Ordre Tri</label>
                  <input type="number" required min={1}
                    className="w-full text-xs px-3 py-2 rounded-xl border bg-transparent outline-none"
                    style={{ borderColor: 'var(--border)' }}
                    value={formData.order}
                    onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                  />
                </div>
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
                  {editingMember ? 'Sauvegarder' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}