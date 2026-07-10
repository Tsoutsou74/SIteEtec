import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/ApiService';
import { 
  Calendar, Clock, MapPin, 
  Layers, Grid, List, Loader2, AlertTriangle
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface SlotEDT {
  jour: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi';
  heure: string;
  classe: string;
  matiere: string;
  salle: string;
  type: 'Cours' | 'TP' | 'TD';
  indexHeure: number; // 0: 8h-10h, 1: 10h-12h, etc.
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] as const;
const CRENEAUX = [
  '08h00 – 10h00',
  '10h00 – 12h00',
  '14h00 – 16h00',
  '16h00 – 18h00'
];

export default function EmploiDuTemps() {
  const { darkMode } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // États pour les données de l'API
  const [emploiDuTemps, setEmploiDuTemps] = useState<SlotEDT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // Récupération des données au montage du composant
  useEffect(() => {
    const fetchEDT = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await ApiService.etudiant.getEmploiDuTemps();
        const raw = res?.data ?? [];
        const normalized = Array.isArray(raw) && raw.length > 0 && raw[0] && typeof raw[0] === 'object' && 'seances' in raw[0]
          ? raw.flatMap((jour: any) =>
              (jour.seances || []).map((seance: any, indexHeure: number) => ({
                jour: jour.jour,
                heure: `${seance.heureDebut} - ${seance.heureFin}`,
                classe: seance.classe || seance.matiere,
                matiere: seance.matiere,
                salle: seance.salle,
                type: seance.type,
                indexHeure,
              }))
            )
          : raw;
        setEmploiDuTemps(normalized || []);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'emploi du temps:", err);
        setError("Impossible de charger l'emploi du temps. Veuillez réessayer ultérieurement.");
      } finally {
        setLoading(false);
      }
    };

    fetchEDT();
  }, []);

  // Helper pour la couleur des badges/cartes selon le type de cours
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'TP': return { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/20' };
      case 'TD': return { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-500', border: 'border-amber-500/20' };
      default: return { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-500', border: 'border-emerald-500/20' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Calendar className="text-[var(--primary)]" size={22} />
            Mon Emploi du Temps
          </h1>
          <p className="text-xs opacity-50 mt-0.5">Planning hebdomadaire des cours, travaux pratiques et dirigés.</p>
        </div>

        {/* Toggle Mode d'affichage */}
        <div className="flex items-center gap-1 p-1 rounded-xl border self-start" style={{ ...borderStyle, backgroundColor: cardBg }}>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'text-[var(--primary)] bg-black/5 dark:bg-white/5' : 'opacity-50'}`}
            title="Vue Grille Semaine"
          >
            <Grid size={15} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'text-[var(--primary)] bg-black/5 dark:bg-white/5' : 'opacity-50'}`}
            title="Vue Liste Chronologique"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* ─── ÉTAT : CHARGEMENT ─── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-3 rounded-2xl border" style={{ ...borderStyle, backgroundColor: cardBg }}>
          <Loader2 className="animate-spin text-[var(--primary)]" size={30} />
          <p className="text-xs font-semibold opacity-60">Chargement de votre planning...</p>
        </div>
      )}

      {/* ─── ÉTAT : ERREUR ─── */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3 rounded-2xl border border-red-500/20 bg-red-500/5">
          <AlertTriangle className="text-red-500" size={32} />
          <p className="text-xs font-bold text-red-500 max-w-md">{error}</p>
        </div>
      )}

      {/* ─── AFFICHAGE DES DONNÉES ─── */}
      {!loading && !error && (
        <>
          {/* ─── VUE 1 : GRILLE CALENDRIER ─── */}
          {viewMode === 'grid' && (
            <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ ...borderStyle, backgroundColor: cardBg }}>
              <div className="overflow-x-auto">
                <div className="min-w-[800px] grid grid-cols-6 divide-x" style={{ borderColor: 'var(--border)' }}>
                  
                  {/* Colonne des Heures */}
                  <div className="flex flex-col">
                    <div className="h-12 border-b flex items-center justify-center text-[10px] font-black uppercase opacity-45 tracking-wider" style={{ borderColor: 'var(--border)' }}>
                      Horaires
                    </div>
                    {CRENEAUX.map((c, i) => (
                      <div key={i} className="h-28 border-b p-3 flex flex-col justify-center items-center text-center last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <span className="font-mono text-xs font-bold">{c.split(' – ')[0]}</span>
                        <span className="text-[10px] opacity-40 mt-0.5">{c.split(' – ')[1]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Colonnes des Jours */}
                  {JOURS.map((jour) => (
                    <div key={jour} className="flex flex-col">
                      {/* Titre Jour */}
                      <div className="h-12 border-b flex items-center justify-center text-xs font-black uppercase tracking-wide bg-black/[0.01] dark:bg-white/[0.01]" style={{ borderColor: 'var(--border)' }}>
                        {jour}
                      </div>

                      {/* Créneaux du Jour */}
                      {CRENEAUX.map((_, indexH) => {
                        const slot = emploiDuTemps.find(s => s.jour === jour && s.indexHeure === indexH);
                        return (
                          <div key={indexH} className="h-28 border-b p-2 last:border-0 relative group" style={{ borderColor: 'var(--border)' }}>
                            {slot ? (
                              <div className={`w-full h-full p-2.5 rounded-xl border flex flex-col justify-between text-left transition-all duration-200 group-hover:shadow-md ${getTypeStyles(slot.type).bg} ${getTypeStyles(slot.type).border}`}>
                                <div>
                                  <div className="flex items-center justify-between gap-1">
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase border ${getTypeStyles(slot.type).text} ${getTypeStyles(slot.type).border}`}>
                                      {slot.type}
                                    </span>
                                    <span className="text-[9px] font-mono opacity-65 flex items-center gap-0.5 font-bold">
                                      <MapPin size={9} /> {slot.salle}
                                    </span>
                                  </div>
                                  <h4 className="text-[11px] font-bold leading-tight mt-2 line-clamp-2">{slot.matiere}</h4>
                                </div>
                                <span className="text-[10px] font-medium opacity-60 flex items-center gap-1">
                                  <Layers size={10} /> {slot.classe}
                                </span>
                              </div>
                            ) : (
                              <div className="w-full h-full rounded-xl border border-dashed border-transparent transition-colors group-hover:bg-black/[0.01] dark:group-hover:bg-white/[0.01]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                </div>
              </div>
            </div>
          )}

          {/* ─── VUE 2 : LISTE CHRONOLOGIQUE ─── */}
          {viewMode === 'list' && (
            <div className="space-y-4 max-w-2xl">
              {JOURS.map((jour) => {
                const slotsDuJour = emploiDuTemps.filter(s => s.jour === jour).sort((a, b) => a.indexHeure - b.indexHeure);
                if (slotsDuJour.length === 0) return null;

                return (
                  <div key={jour} className="space-y-2">
                    <h3 className="text-xs font-black uppercase opacity-55 tracking-wider pl-1">{jour}</h3>
                    
                    <div className="space-y-2">
                      {slotsDuJour.map((slot, index) => (
                        <div 
                          key={index} 
                          className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition-transform duration-150 hover:scale-[1.005]"
                          style={{ backgroundColor: cardBg, borderColor: 'var(--border)' }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-xl border hidden sm:flex shrink-0 ${getTypeStyles(slot.type).bg} ${getTypeStyles(slot.type).border} ${getTypeStyles(slot.type).text}`}>
                              <Clock size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs font-bold opacity-75">{slot.heure}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black border uppercase ${getTypeStyles(slot.type).bg} ${getTypeStyles(slot.type).text} ${getTypeStyles(slot.type).border}`}>
                                  {slot.type}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold mt-1">{slot.matiere}</h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-[11px] opacity-60 border-t sm:border-t-0 pt-2 sm:pt-0" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-1 font-semibold">
                              <Layers size={12} />
                              <span>{slot.classe}</span>
                            </div>
                            <div className="flex items-center gap-1 font-mono">
                              <MapPin size={12} />
                              <span>Salle {slot.salle}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

    </div>
  );
}
