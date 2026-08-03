import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  FileText, Search, Download, FileSpreadsheet, 
  FileCheck, ShieldAlert, Layers, ExternalLink, Loader2 
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

export default function Documents() {
  const { darkMode } = useTheme();
  
  // ─── États Dynamiques ───────────────────────────────────
  const [documents, setDocuments] = useState<DocumentAdministratif[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // Liste unique des catégories pour les onglets
  const categories = ['Tous', 'Scolarité', 'Stages / Pro', 'Examens', 'Règlements'];

  // ─── Récupération des Documents ─────────────
  useEffect(() => {
    const fetchDocumentsData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setDocuments([
          { id: '1', titre: 'Règlement Intérieur 2026', description: "Le règlement intérieur de l'établissement pour l'année universitaire.", categorie: 'Règlements', datePublication: '01/09/2026', taille: '2.5 MB', format: 'pdf' },
          { id: '2', titre: 'Convention de Stage', description: 'Formulaire standard pour la convention de stage obligatoire.', categorie: 'Stages / Pro', datePublication: '15/09/2026', taille: '1.2 MB', format: 'pdf' },
          { id: '3', titre: 'Certificat de Scolarité', description: 'Modèle de demande pour le certificat de scolarité.', categorie: 'Scolarité', datePublication: '10/09/2026', taille: '500 KB', format: 'docx' },
          { id: '4', titre: 'Calendrier des Examens S1', description: 'Planning officiel des examens du premier semestre.', categorie: 'Examens', datePublication: '20/11/2026', taille: '800 KB', format: 'pdf' }
        ]);
      } catch (err) {
        console.error("Erreur lors du chargement des documents administratifs :", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentsData();
  }, []);

  // ─── Filtrage Combiné ───────────────────────────────────
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchSearch = doc.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'Tous' || doc.categorie === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [documents, searchTerm, selectedCategory]);

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

      {/* ─── Contenu Principal / Zone de Chargement ─── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3 opacity-60 text-xs">
          <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
          <p className="font-bold">Chargement du répertoire de documents administratifs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocuments.length === 0 ? (
            <div className="md:col-span-2 p-12 text-center border border-dashed rounded-2xl opacity-40 text-xs font-medium" style={borderStyle}>
              Aucun document ne correspond à vos critères.
            </div>
          ) : (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocuments.map((doc) => (
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
              ))}
            </div>
          )}
        </div>
      )}

      {/* Note informative de pied de page */}
      <div className="p-4 rounded-xl border bg-black/[0.01] dark:bg-white/[0.01] flex items-center gap-2 text-[10px] opacity-45 font-medium" style={borderStyle}>
        <ExternalLink size={12} className="shrink-0" />
        <span>Si vous ne trouvez pas un document officiel particulier, veuillez formuler une demande physique auprès du guichet unique de votre mention.</span>
      </div>

    </div>
  );
}