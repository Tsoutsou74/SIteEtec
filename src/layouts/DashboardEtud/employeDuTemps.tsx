import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Calendar, Clock, MapPin, User, 
  Layers, Grid, List, ChevronRight 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface SeanceCours {
  id: string;
  matiere: string;
  enseignant: string;
  salle: string;
  heureDebut: string;
  heureFin: string;
  type: 'Cours' | 'TD' | 'TP';
  color: string;
}

interface JourEmploi {
  jour: string;
  seances: SeanceCours[];
}

// ─── Données Simulées (Semestre L3 / L1) ──────────────────
const SEMAINE_EDT: JourEmploi[] = [
  {
    jour: 'Lundi',
    seances: [
      { id: 's-1', matiere: 'Algorithmique Avancée', enseignant: 'M. ANDRIAMALALA Tahina', salle: 'A101', heureDebut: '08:00', heureFin: '10:00', type: 'Cours', color: '#22c55e' },
      { id: 's-2', matiere: 'Bases de Données Rel.', enseignant: 'Mme. RAKOTOMALALA Feno', salle: 'Labo1', heureDebut: '10:15', heureFin: '12:15', type: 'TP', color: '#3b82f6' }
    ]
  },
  {
    jour: 'Mardi',
    seances: [
      { id: 's-3', matiere: 'Architecture & Réseaux', enseignant: 'Dr. RAZAFIMAHATRATRA A.', salle: 'B204', heureDebut: '08:00', heureFin: '10:00', type: 'Cours', color: '#22c55e' },
      { id: 's-4', matiere: 'Architecture & Réseaux', enseignant: 'Dr. RAZAFIMAHATRATRA A.', salle: 'Labo1', heureDebut: '10:15', heureFin: '12:15', type: 'TD', color: '#f59e0b' }
    ]
  },
  {
    jour: 'Mercredi',
    seances: [
      { id: 's-5', matiere: 'Développement Web Full-Stack', enseignant: 'M. RANDRIANARISOA Mamy', salle: 'Labo2', heureDebut: '14:00', heureFin: '17:00', type: 'TP', color: '#3b82f6' }
    ]
  },
  {
    jour: 'Jeudi',
    seances: [
      { id: 's-6', matiere: 'Mathématiques de l\'Ingénieur', enseignant: 'Mme. RAKOTOMALALA Feno', salle: 'A203', heureDebut: '08:00', heureFin: '11:00', type: 'Cours', color: '#22c55e' }
    ]
  },
  {
    jour: 'Vendredi',
    seances: [
      { id: 's-7', matiere: 'Anglais Technique', enseignant: 'Mme. RASOAMALALA Lova', salle: 'B102', heureDebut: '10:15', heureFin: '12:15', type: 'TD', color: '#f59e0b' }
    ]
  }
];

export default function EmploiDuTemps() {
  const { darkMode } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      
      {/* ─── Header de la page ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <Calendar className="text-[var(--primary)]" size={24} />
            Mon Emploi du Temps
          </h1>
          <p className="text-xs opacity-45 mt-0.5">
            Planification hebdomadaire des salles, horaires et modules du semestre.
          </p>
        </div>

        {/* Boutons bascule d'affichage (Grille / Liste) */}
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02]" style={borderStyle}>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'opacity-50 hover:opacity-100'}`}
          >
            <Grid size={14} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'opacity-50 hover:opacity-100'}`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* ─── VUE 1 : GRILLE HEBDOMADAIRE (Bento Grid) ─── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          {SEMAINE_EDT.map((semaine, index) => (
            <div 
              key={index} 
              className="rounded-2xl border flex flex-col overflow-hidden min-h-[320px]" 
              style={{ backgroundColor: cardBg, ...borderStyle }}
            >
              {/* En-tête du Jour */}
              <div className="px-4 py-3 border-b font-black tracking-tight text-xs bg-black/[0.01] dark:bg-white/[0.01]" style={borderStyle}>
                {semaine.jour}
              </div>

              {/* Séances du jour */}
              <div className="p-3 flex-1 flex flex-col gap-2.5">
                {semaine.seances.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-[10px] font-medium opacity-30 border border-dashed rounded-xl p-4">
                    Aucun cours
                  </div>
                ) : (
                  semaine.seances.map((seance) => (
                    <div
                      key={seance.id}
                      className="p-3 rounded-xl border flex flex-col justify-between gap-3 transition-all hover:shadow-xs"
                      style={{ 
                        borderColor: 'var(--border)',
                        background: darkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' 
                      }}
                    >
                      <div className="space-y-1.5">
                        {/* Type + Horaire */}
                        <div className="flex items-center justify-between gap-1">
                          <span 
                            className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider"
                            style={{ backgroundColor: seance.color + '15', color: seance.color }}
                          >
                            {seance.type}
                          </span>
                          <span className="text-[10px] font-mono font-bold opacity-50 flex items-center gap-1">
                            <Clock size={10} />
                            {seance.heureDebut}
                          </span>
                        </div>

                        {/* Intitulé */}
                        <h4 className="text-[11px] font-black leading-tight tracking-tight">
                          {seance.matiere}
                        </h4>
                      </div>

                      {/* Professeur & Localisation */}
                      <div className="space-y-1 pt-1 border-t border-dashed" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-1 text-[9px] opacity-40 font-medium truncate">
                          <User size={10} />
                          <span>{seance.enseignant.split(' ').pop()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-[var(--primary)]">
                          <MapPin size={10} />
                          <span>Salle {seance.salle}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── VUE 2 : LISTE COMPACTE FILTRÉE ─── */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {SEMAINE_EDT.map((semaine, index) => (
            <div 
              key={index} 
              className="rounded-2xl border overflow-hidden" 
              style={{ backgroundColor: cardBg, ...borderStyle }}
            >
              <div className="px-5 py-3 border-b bg-black/[0.01] dark:bg-white/[0.01] font-black text-xs" style={borderStyle}>
                {semaine.jour}
              </div>

              <div className="divide-y" style={borderStyle}>
                {semaine.seances.length === 0 ? (
                  <div className="p-4 text-center text-xs opacity-40 font-medium">Aucun cours planifié pour ce jour.</div>
                ) : (
                  semaine.seances.map((seance) => (
                    <div key={seance.id} className="p-4 sm:flex sm:items-center sm:justify-between gap-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Bloc Heure */}
                        <div className="flex items-center gap-1.5 font-mono text-xs font-black opacity-70 shrink-0 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                          <Clock size={12} />
                          <span>{seance.heureDebut} – {seance.heureFin}</span>
                        </div>

                        {/* Infos de la séance */}
                        <div className="min-w-0">
                          <p className="text-xs font-black tracking-tight truncate">{seance.matiere}</p>
                          <p className="text-[10px] opacity-45 font-medium mt-0.5 flex items-center gap-1">
                            <User size={11} /> {seance.enseignant}
                          </p>
                        </div>
                      </div>

                      {/* Badges d'accompagnement */}
                      <div className="flex items-center gap-3 mt-3 sm:mt-0 shrink-0 justify-end">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--primary)] border px-2 py-1 rounded-lg" style={borderStyle}>
                          <MapPin size={12} />
                          <span>Salle {seance.salle}</span>
                        </div>
                        <span 
                          className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                          style={{ backgroundColor: seance.color + '15', color: seance.color }}
                        >
                          {seance.type}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}