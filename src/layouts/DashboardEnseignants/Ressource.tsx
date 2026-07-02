import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  FolderOpen, FileText, Video, Archive, Search, 
  UploadCloud, Trash2, Download, HardDrive, 
  Filter, Plus, CheckCircle, FileUp
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface FichierRessource {
  id: string;
  nom: string;
  classe: string;
  matiere: string;
  taille: string;
  dateDepot: string;
  downloads: number;
  format: 'document' | 'video' | 'archive';
}

// ─── Données Simulées (Mock Data) ─────────────────────────
const INITIAL_FICHIERS: FichierRessource[] = [
  {
    id: 'f-1',
    nom: 'Ch01_Introduction_Algorithmique_V2.pdf',
    classe: 'L1 Info A',
    matiere: 'Algorithmique',
    taille: '2.4 MB',
    dateDepot: 'Aujourd\'hui, 09:15',
    downloads: 42,
    format: 'document'
  },
  {
    id: 'f-2',
    nom: 'Enregistrement_Cours_Architecture_VonNeumann.mp4',
    classe: 'L1 Info B',
    matiere: 'Architecture des ordinateurs',
    taille: '145 MB',
    dateDepot: 'Hier, 16:00',
    downloads: 18,
    format: 'video'
  },
  {
    id: 'f-3',
    nom: 'TP3_Correction_BaseDeDonnees_SQL.zip',
    classe: 'L3 Info',
    matiere: 'Base de Données',
    taille: '4.8 MB',
    dateDepot: '24 Juin 2026',
    downloads: 35,
    format: 'archive'
  },
  {
    id: 'f-4',
    nom: 'Syllabus_DevOps_CI_CD_2026.pdf',
    classe: 'M1 GL',
    matiere: 'DevOps',
    taille: '1.1 MB',
    dateDepot: '15 Juin 2026',
    downloads: 50,
    format: 'document'
  }
];

export default function Ressource() {
  const { darkMode } = useTheme();

  // ─── États ──────────────────────────────────────────────
  const [fichiers, setFichiers] = useState<FichierRessource[]>(INITIAL_FICHIERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFormat, setActiveFormat] = useState<'tous' | 'document' | 'video' | 'archive'>('tous');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // ─── Filtrage & Recherche ───
  const filteredFichiers = useMemo(() => {
    return fichiers.filter(f => {
      const matchSearch = f.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.classe.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFormat = activeFormat === 'tous' || f.format === activeFormat;
      return matchSearch && matchFormat;
    });
  }, [fichiers, searchTerm, activeFormat]);

  // ─── Actions ───
  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce document de la plateforme ?')) {
      setFichiers(prev => prev.filter(f => f.id !== id));
    }
  };

  // Simulation d'un upload de fichier
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Ajout du fichier simulé à la liste
      const nouveauFichier: FichierRessource = {
        id: `f-${Date.now()}`,
        nom: file.name,
        classe: 'L1 Info A', // Valeur par défaut pour l'exemple
        matiere: 'Général',
        taille: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        dateDepot: 'À l\'instant',
        downloads: 0,
        format: file.type.includes('video') ? 'video' : file.name.endsWith('.zip') || file.name.endsWith('.rar') ? 'archive' : 'document'
      };

      setFichiers(prev => [nouveauFichier, ...prev]);

      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1500);
  };

  // Helper Icône de format
  const getFormatIcon = (format: 'document' | 'video' | 'archive') => {
    switch (format) {
      case 'video': return <Video size={16} className="text-purple-500" />;
      case 'archive': return <Archive size={16} className="text-amber-500" />;
      default: return <FileText size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <FolderOpen className="text-[var(--primary)]" size={22} />
            Médiathèque & Ressources Déposées
          </h1>
          <p className="text-xs opacity-50 mt-0.5">
            Téléversez et gérez les supports de cours, fichiers d'exercices et médias pour vos étudiants.
          </p>
        </div>
      </div>

      {/* ─── Layout : Zone de Dépôt & Jauge de Stockage ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Zone de Téléversement Drag & Drop */}
        <div className="md:col-span-2 p-5 rounded-2xl border border-dashed text-center flex flex-col justify-center items-center relative group" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <input 
            type="file" 
            id="file-upload-input"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
            onChange={handleSimulatedUpload}
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="space-y-2 py-4">
              <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold opacity-75">Chiffrement et téléversement du document...</p>
            </div>
          ) : uploadSuccess ? (
            <div className="space-y-2 text-emerald-500 py-4 animate-fade-in">
              <CheckCircle size={32} className="mx-auto" />
              <p className="text-xs font-black">Fichier injecté avec succès ! Disponible pour les étudiants.</p>
            </div>
          ) : (
            <div className="space-y-2 py-2">
              <UploadCloud size={32} className="mx-auto opacity-40 group-hover:text-[var(--primary)] group-hover:opacity-100 transition-all duration-200" />
              <div>
                <p className="text-xs font-black tracking-tight">Glissez un document ici ou <span className="text-[var(--primary)] underline">parcourez vos fichiers</span></p>
                <p className="text-[10px] opacity-40 mt-0.5">PDF, MP4, ZIP, PPTX jusqu'à 200 Mo</p>
              </div>
            </div>
          )}
        </div>

        {/* Espace Stockage Cloud de l'Enseignant */}
        <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black opacity-85">
              <HardDrive size={15} className="text-[var(--primary)]" />
              Espace Cloud Enseignant
            </div>
            <p className="text-[10px] opacity-50">Quota alloué par la direction des systèmes d'information.</p>
          </div>

          <div className="space-y-1.5 mt-4 md:mt-0">
            <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '15.3%' }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono opacity-65 font-bold">
              <span>153.3 MB Utilisés</span>
              <span>1 GB</span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Filtres de Recherche et de Formats ─── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Type de format (Tabs miniatures) */}
        <div className="flex p-1 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border self-start" style={borderStyle}>
          {(['tous', 'document', 'video', 'archive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFormat(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFormat === f 
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs' 
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              {f === 'tous' ? 'Tous' : f + 's'}
            </button>
          ))}
        </div>

        {/* Barre de Recherche */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 opacity-40" size={14} />
          <input
            type="text"
            placeholder="Rechercher par nom, matière..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full font-medium text-xs pl-9 pr-4 py-2 rounded-xl border bg-transparent focus:outline-hidden focus:border-[var(--primary)]"
            style={borderStyle}
          />
        </div>
      </div>

      {/* ─── Liste des Fichiers sous Forme de Tableau Réactif ─── */}
      <div className="rounded-2xl border overflow-hidden shadow-xs" style={{ backgroundColor: cardBg, ...borderStyle }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-black/[0.01] dark:bg-white/[0.01] uppercase text-[10px] tracking-wider opacity-60 font-black" style={{ borderColor: 'var(--border)' }}>
                <th className="p-4">Nom du Fichier</th>
                <th className="p-4">Affectation / Matière</th>
                <th className="p-4 w-24">Taille</th>
                <th className="p-4 w-20 text-center">Téléch.</th>
                <th className="p-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {filteredFichiers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center opacity-50 font-medium">Aucun fichier ne correspond aux filtres appliqués.</td>
                </tr>
              ) : (
                filteredFichiers.map((fichier) => (
                  <tr key={fichier.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors group">
                    {/* Nom & Format */}
                    <td className="p-4 font-bold tracking-tight max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="p-1.5 rounded-lg border bg-black/5 dark:bg-white/5 shrink-0" style={borderStyle}>
                          {getFormatIcon(fichier.format)}
                        </span>
                        <span className="truncate block" title={fichier.nom}>{fichier.nom}</span>
                      </div>
                    </td>

                    {/* Classe & Matière */}
                    <td className="p-4">
                      <div className="font-semibold text-neutral-800 dark:text-neutral-200">{fichier.matiere}</div>
                      <div className="text-[10px] opacity-40 font-bold uppercase mt-0.5">{fichier.classe}</div>
                    </td>

                    {/* Taille */}
                    <td className="p-4 font-mono opacity-70 text-[11px]">{fichier.taille}</td>

                    {/* Compteur de téléchargements */}
                    <td className="p-4 text-center font-mono font-bold opacity-60">{fichier.downloads}</td>

                    {/* Actions de ligne */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          title="Télécharger"
                          onClick={() => alert(`Téléchargement de : ${fichier.nom}`)}
                          className="p-2 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
                          style={borderStyle}
                        >
                          <Download size={13} />
                        </button>
                        <button
                          type="button"
                          title="Supprimer la ressource"
                          onClick={() => handleDelete(fichier.id)}
                          className="p-2 rounded-lg border hover:bg-rose-500/10 text-rose-500 border-transparent transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}