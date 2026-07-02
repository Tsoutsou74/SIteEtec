import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Calendar, Clock, MapPin, GraduationCap, 
  Layers, Grid, List, ChevronLeft, ChevronRight 
} from 'lucide-react';

// ─── Types & Données ──────────────────────────────────────
interface SlotEDT {
  jour: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi';
  heure: string;
  classe: string;
  matiere: string;
  salle: string;
  type: 'Cours' | 'TP' | 'TD';
  indexHeure: number; // Pour le positionnement dans la grille (0: 8h-10h, 1: 10h-12h, etc.)
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] as const;
const CRENEAUX = [
  '08h00 – 10h00',
  '10h00 – 12h00',
  '14h00 – 16h00',
  '16h00 – 18h00'
];

const EMPLOI_DU_TEMPS: SlotEDT[] = [
  { jour: 'Lundi',    heure: '08h00 – 10h00', classe: 'L1 Info A', matiere: 'Algorithmique',      salle: 'A101',  type: 'Cours', indexHeure: 0 },
  { jour: 'Lundi',    heure: '10h00 – 12h00', classe: 'L3 Info',   matiere: 'Base de Données',    salle: 'Labo1', type: 'TP',    indexHeure: 1 },
  { jour: 'Mardi',    heure: '08h00 – 10h00', classe: 'L2 Info B', matiere: 'Réseaux',             salle: 'B204',  type: 'Cours', indexHeure: 0 },
  { jour: 'Mercredi', heure: '14h00 – 16h00', classe: 'L3 Info',   matiere: 'Développement Web', salle: 'Labo2', type: 'TP',    indexHeure: 2 },
  { jour: 'Jeudi',    heure: '08h00 – 10h00', classe: 'L1 Info B', matiere: 'Algorithmique',      salle: 'A203',  type: 'Cours', indexHeure: 0 },
  { jour: 'Vendredi', heure: '10h00 – 12h00', classe: 'M1 GL',      matiere: 'Architecture SI',   salle: 'B110',  type: 'TD',    indexHeure: 1 },
];

export default function EmploiDuTemps() {
  const { darkMode } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

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

      {/* ─── VUE 1 : GRILLE CALENDRIER (Desktop de préférence) ─── */}
      {viewMode === 'grid' && (
        <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ ...borderStyle, backgroundColor: cardBg }}>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] grid grid-cols-6 divide-x" style={{ borderColor: 'var(--border)' }}>
              
              {/* Colonne des Heures (Header vide) */}
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
                    const slot = EMPLOI_DU_TEMPS.find(s => s.jour === jour && s.indexHeure === indexH);
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

      {/* ─── VUE 2 : LISTE CHRONOLOGIQUE (Idéal Mobile) ─── */}
      {viewMode === 'list' && (
        <div className="space-y-4 max-w-2xl">
          {JOURS.map((jour) => {
            const slotsDuJour = EMPLOI_DU_TEMPS.filter(s => s.jour === jour).sort((a, b) => a.indexHeure - b.indexHeure);
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

    </div>
  );
}