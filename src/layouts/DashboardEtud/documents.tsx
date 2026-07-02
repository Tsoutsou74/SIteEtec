import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  FileText, Search, Download, FileSpreadsheet, 
  FileCheck, ShieldAlert, Layers, ExternalLink 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface DocumentAdministratif {
  id: string;
  titre: string;
  description: string;
  categorie: 'Scolarité' | 'Stages / Pro' | 'Examens' | 'Règlements';
  datePublication: string;
  taille: string;
  format: 'pdf' | 'docx' | 'xlsx';
}

// ─── Données Simulées (Documents Généraux Étudiants) ──────
const INITIAL_DOCUMENTS: DocumentAdministratif[] = [
  {
    id: 'doc-1',
    titre: 'Formulaire de demande de relevé de notes',
    description: 'À remplir et à déposer auprès de la scolarité pour toute demande officielle.',
    categorie: 'Scolarité',
    datePublication: '12 Janv 2026',
    taille: '320 KB',
    format: 'pdf'
  },
  {
    id: 'doc-2',
    titre: 'Guide et convention de stage Master 1 & L3',
    description: 'Contient les modalités de stage, d\'évaluation ainsi que le modèle de convention.',
    categorie: 'Stages / Pro',
    datePublication: '04 Mars 2026',
    taille: '1.4 MB',
    format: 'pdf'
  },
  {
    id: 'doc-3',
    titre: 'Calendrier général des examens – Session 1',
    description: 'Planning complet des épreuves écrites et pratiques du premier semestre.',
    categorie: 'Examens',
    datePublication: '15 Mai 2026',
    taille: '450 KB',
    format: 'xlsx'
  },
  {
    id: 'doc-4',
    titre: 'Règlement intérieur & Charte informatique',
    description: 'Droits, devoirs des étudiants et règles d\'utilisation des laboratoires de code.',
    categorie: 'Règlements',
    datePublication: '01 Oct 2025',
    taille: '890 KB',
    format: 'pdf'
  },
  {
    id: 'doc-5',
    titre: 'Fiche d\'inscription aux activités pédagogiques',
    description: 'Choix des options et des ateliers de spécialisation pour l\'année universitaire.',
    categorie: 'Scolarité',
    datePublication: '18 Fév 2026',
    taille: '120 KB',
    format: 'docx'
  }
];

export default function Documents() {
  const { darkMode } = useTheme();
  
  // ─── États ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // Liste unique des catégories pour les onglets
  const categories = ['Tous', 'Scolarité', 'Stages / Pro', 'Examens', 'Règlements'];

  // ─── Filtrage Combiné ───────────────────────────────────
  const filteredDocuments = useMemo(() => {
    return INITIAL_DOCUMENTS.filter(doc => {
      const matchSearch = doc.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'Tous' || doc.categorie === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, selectedCategory]);

  // Helper pour attribuer une icône selon la catégorie
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Stages / Pro': return <FileCheck size={16} className="text-purple-500" />;
      case 'Examens': return <FileSpreadsheet size={16} className="text-amber-500" />;
      case 'Règlements': return <ShieldAlert size={16} className="text-rose-500" />;
      default: return <FileText size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <Layers className="text-[var(--primary)]" size={24} />
            Documents & Formulaires Utiles
          </h1>
          <p className="text-xs opacity-45 mt-0.5">
            Accédez aux documents officiels de l'établissement et téléchargez les fichiers administratifs nécessaires.
          </p>
        </div>

        {/* Recherche */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 opacity-40" size={14} />
          <input
            type="text"
            placeholder="Rechercher un formulaire, guide..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full font-medium text-xs pl-9 pr-4 py-2 rounded-xl border bg-transparent focus:outline-hidden focus:border-[var(--primary)]"
            style={borderStyle}
          />
        </div>
      </div>

      {/* ─── Filtres par Catégorie (Onglets Pilules) ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                  : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
              }`}
              style={!isActive ? borderStyle : {}}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ─── Liste des Documents / Bento Grid Compact ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocuments.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center border border-dashed rounded-2xl opacity-40 text-xs font-medium" style={borderStyle}>
            Aucun document ne correspond à vos critères.
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:shadow-xs"
              style={{ backgroundColor: cardBg, ...borderStyle }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Icône enveloppée */}
                  <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border shrink-0" style={borderStyle}>
                    {getCategoryIcon(doc.categorie)}
                  </div>
                  <div>
                    <h3 className="text-xs font-black tracking-tight leading-tight mb-1">
                      {doc.titre}
                    </h3>
                    <p className="text-[11px] opacity-50 font-medium line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barre Technique du bas */}
              <div className="flex items-center justify-between pt-3 border-t border-dashed" style={borderStyle}>
                <div className="flex items-center gap-2 text-[10px] font-medium opacity-45">
                  <span className="uppercase font-mono font-bold bg-black/5 dark:bg-white/5 px-1 py-0.5 rounded">
                    {doc.format}
                  </span>
                  <span>•</span>
                  <span>{doc.taille}</span>
                  <span>•</span>
                  <span>Publié le {doc.datePublication}</span>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Téléchargement de : ${doc.titre}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10px] font-black hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
                  style={borderStyle}
                >
                  <Download size={12} />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Note informative de pied de page */}
      <div className="p-4 rounded-xl border bg-black/[0.01] dark:bg-white/[0.01] flex items-center gap-2 text-[10px] opacity-45 font-medium" style={borderStyle}>
        <ExternalLink size={12} className="shrink-0" />
        <span>Si vous ne trouvez pas un document officiel particulier, veuillez formuler une demande physique auprès du guichet unique de votre mention.</span>
      </div>

    </div>
  );
}