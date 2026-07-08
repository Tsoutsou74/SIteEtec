import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  FolderOpen, FileText, Video, Archive, Search, 
  UploadCloud, Trash2, Download, HardDrive, 
  CheckCircle, Loader2, AlertCircle
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

export default function Ressource() {
  const { darkMode } = useTheme();

  // ─── États ──────────────────────────────────────────────
  const [fichiers, setFichiers] = useState<FichierRessource[]>([]);
  const [quota, setQuota] = useState<{ utilise: string; max: string; pourcentage: number }>({ utilise: '0 MB', max: '1 GB', pourcentage: 0 });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFormat, setActiveFormat] = useState<'tous' | 'document' | 'video' | 'archive'>('tous');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // ─── Charger les ressources et l'espace de stockage ───
  const fetchRessources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [fichiersData, quotaData] = await Promise.all([
        apiService.getRessources(),
        apiService.getQuotaStockage()
      ]);
      
      setFichiers(fichiersData || []);
      if (quotaData) setQuota(quotaData);
    } catch (err) {
      console.error("Erreur lors de la récupération des ressources:", err);
      setError("Impossible de charger la médiathèque. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRessources();
  }, []);

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

  // ─── Actions via l'API ───
  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce document de la plateforme ?')) return;
    
    try {
      setError(null);
      await apiService.deleteRessource(id);
      setFichiers(prev => prev.filter(f => f.id !== id));
      
      // Optionnel : Recharger le quota après suppression
      const quotaData = await apiService.getQuotaStockage();
      if (quotaData) setQuota(quotaData);
    } catch (err) {
      console.error("Erreur lors de la suppression de la ressource:", err);
      setError("Erreur lors de la suppression du fichier. Veuillez réessayer.");
    }
  };

  const handleUploadReal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    // Ajoutez ici d'autres données requises par votre API (ex: classe, matiere) si besoin
    formData.append('classe', 'L1 Info A'); 
    formData.append('matiere', 'Général');

    try {
      setIsUploading(true);
      setError(null);
      
      const nouveauFichier = await apiService.uploadRessource(formData);
      
      setUploadSuccess(true);
      if (nouveauFichier) {
        setFichiers(prev => [nouveauFichier, ...prev]);
      } else {
        // Fallback sécurisé ou rechargement complet
        fetchRessources();
      }
      
      // Actualiser l'état du quota après l'ajout
      const quotaData = await apiService.getQuotaStockage();
      if (quotaData) setQuota(quotaData);

      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Erreur lors du téléversement du fichier:", err);
      setError("Le téléversement a échoué. Vérifiez la taille ou le format du fichier.");
    } finally {
      setIsUploading(false);
    }
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

      {/* ─── Global Error Feedback ─── */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Layout : Zone de Dépôt & Jauge de Stockage ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Zone de Téléversement Real / Drag & Drop */}
        <div className="md:col-span-2 p-5 rounded-2xl border border-dashed text-center flex flex-col justify-center items-center relative group" style={{ backgroundColor: cardBg, ...borderStyle }}>
          <input 
            type="file" 
            id="file-upload-input"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
            onChange={handleUploadReal}
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="space-y-2 py-4">
              <Loader2 className="animate-spin text-[var(--primary)] mx-auto" size={24} />
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
              <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-300" style={{ width: `${quota.pourcentage}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono opacity-65 font-bold">
              <span>{quota.utilise} Utilisés</span>
              <span>{quota.max}</span>
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center opacity-60 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-[var(--primary)]" size={16} />
                      Chargement de la médiathèque...
                    </div>
                  </td>
                </tr>
              ) : filteredFichiers.length === 0 ? (
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