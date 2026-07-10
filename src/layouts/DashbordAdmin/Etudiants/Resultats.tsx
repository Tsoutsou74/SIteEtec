import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import ApiService from '../../../services/ApiService'; // Ajuste le chemin selon ton projet
import { 
  Search, Award, BookOpen, ChevronLeft, ChevronRight, 
  FileText, Download, CheckCircle2, XCircle, AlertTriangle 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
type Semestre = 'Semestre 1' | 'Semestre 2';

interface NoteMatiere {
  code: string;
  libelle: string;
  note: number;
  credit: number;
}

interface ResultatEtudiant {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  filiere: string;
  niveau: string;
  semestre: Semestre;
  matieres: NoteMatiere[];
}

const SEMESTRES: Semestre[] = ['Semestre 1', 'Semestre 2'];
const PAGE_SIZE = 5;

// ─── Logic Helpers ────────────────────────────────────────
const calculerMoyenne = (matieres: NoteMatiere[]): number => {
  const totalNotes = matieres.reduce((acc, m) => acc + (m.note * m.credit), 0);
  const totalCredits = matieres.reduce((acc, m) => acc + m.credit, 0);
  return totalCredits > 0 ? parseFloat((totalNotes / totalCredits).toFixed(2)) : 0;
};

export default function Resultats() {
  const { darkMode } = useTheme();

  // On initialise avec un tableau vide
  const [data, setData] = useState<ResultatEtudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtreSemestre, setFiltreSemestre] = useState<Semestre | ''>('');
  const [page, setPage] = useState(1);
  
  // État pour afficher le bulletin complet dans une modale
  const [selectedResult, setSelectedResult] = useState<ResultatEtudiant | null>(null);

  const inputStyle = {
    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  const cardStyle = {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  // ─── Chargement des données de l'API ──────────────────────
  const fetchResultats = async () => {
    setLoading(true);
    try {
      // Endpoint canonique: apiService.notes
      const response = await ApiService.notes.getAll();
      if (response && response.data) {
        // Uniformisation et mapping des données reçues du backend
        const mappedData = response.data.map((item: any) => ({
          id: String(item.id),
          matricule: item.matricule || item.etudiant?.matricule || '',
          nom: item.nom || item.etudiant?.nom || '',
          prenom: item.prenom || item.etudiant?.prenom || '',
          filiere: item.filiere || 'Génie Logiciel',
          niveau: item.niveau || 'L3',
          semestre: item.semestre || 'Semestre 1',
          // Récupération des matières reliées
          matieres: (item.matieres || item.notes || []).map((m: any) => ({
            code: m.code || m.matiere?.code || '',
            libelle: m.libelle || m.matiere?.libelle || m.matiere?.nom || '',
            note: m.note !== undefined ? m.note : 0,
            credit: m.credit || m.matiere?.credit || m.coefficient || 1
          }))
        }));
        setData(mappedData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des résultats :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultats();
  }, []);

  // ─── Filtrage ───────────────────────────────────────────
  const filtered = data.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = 
      r.nom.toLowerCase().includes(q) || 
      r.prenom.toLowerCase().includes(q) || 
      r.matricule.toLowerCase().includes(q);
    const matchSemestre = filtreSemestre ? r.semestre === filtreSemestre : true;
    return matchSearch && matchSemestre;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Résultats & Notes</h1>
          <p className="text-xs opacity-45 mt-1">Consultez les moyennes générales et relevés par semestre</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl border"
          style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <Search size={14} className="opacity-40 shrink-0" />
          <input
            type="text" placeholder="Rechercher par étudiant ou matricule..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent outline-none text-xs" style={{ color: 'var(--text)' }}
          />
        </div>
        <select value={filtreSemestre} onChange={e => { setFiltreSemestre(e.target.value as Semestre | ''); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border text-xs cursor-pointer appearance-none sm:w-48" style={inputStyle}>
          <option value="">Tous les semestres</option>
          {SEMESTRES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tableau des Résultats */}
      <div className="rounded-2xl border overflow-hidden" style={cardStyle}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Étudiant', 'Cursus', 'Période', 'Moyenne Générale', 'Décision', 'Détails'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold uppercase tracking-wider opacity-45">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center opacity-40">Chargement des notes depuis le serveur...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center opacity-40">Aucun résultat trouvé</td>
                </tr>
              ) : paginated.map(r => {
                const moyenne = calculerMoyenne(r.matieres);
                const estAdmis = moyenne >= 10;

                return (
                  <tr key={r.id} className="border-b transition hover:opacity-90" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3.5">
                      <p className="font-bold">{r.prenom} {r.nom}</p>
                      <p className="opacity-45 text-[11px] font-mono">{r.matricule}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/10 text-blue-500">{r.niveau}</span>
                        <span className="opacity-75">{r.filiere}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 opacity-75">{r.semestre}</td>
                    <td className="px-4 py-3.5 font-black text-sm" style={{ color: estAdmis ? '#22c55e' : '#ef4444' }}>
                      {moyenne} / 20
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black w-fit"
                        style={{ 
                          backgroundColor: estAdmis ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', 
                          color: estAdmis ? '#22c55e' : '#ef4444' 
                        }}>
                        {estAdmis ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {estAdmis ? 'Validé' : 'Rattrapage'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setSelectedResult(r)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-bold text-[11px] transition hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
                        <FileText size={12} /> Voir Notes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[11px] opacity-45">Page {page} / {totalPages}</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border transition disabled:opacity-30" style={{ borderColor: 'var(--border)' }}><ChevronLeft size={14} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border transition disabled:opacity-30" style={{ borderColor: 'var(--border)' }}><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* ─── MODALE BULLETIN DE NOTES DETAILLÉ ─────────── */}
      {selectedResult && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150" style={cardStyle}>
            
            {/* Header Modale */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-blue-500" />
                <h2 className="text-sm font-black tracking-tight">Relevé de Notes Détaillé</h2>
              </div>
              <button onClick={() => setSelectedResult(null)} className="p-1 text-xs opacity-50 hover:opacity-100 font-bold">Fermer</button>
            </div>

            {/* Contenu Relevé */}
            <div className="p-6 space-y-4 text-xs">
              <div className="flex justify-between items-start border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <h3 className="text-base font-black">{selectedResult.prenom} {selectedResult.nom}</h3>
                  <p className="opacity-50 mt-0.5">Matricule: {selectedResult.matricule} — {selectedResult.niveau} {selectedResult.filiere}</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border" style={{ borderColor: 'var(--border)' }}>
                  {selectedResult.semestre}
                </span>
              </div>

              {/* Liste des matières */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">Unités d'Enseignements</p>
                <div className="rounded-xl border divide-y overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: darkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' }}>
                  {selectedResult.matieres.map(m => (
                    <div key={m.code} className="flex justify-between items-center p-3 text-[11px]" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <p className="font-bold">{m.libelle}</p>
                        <p className="opacity-45 text-[10px]">Code: {m.code} • Crédits: {m.credit}</p>
                      </div>
                      <span className={`font-black text-xs px-2 py-0.5 rounded ${m.note >= 10 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {m.note} / 20
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Synthèse */}
              <div className="p-4 rounded-2xl flex justify-between items-center bg-blue-500/5 border border-blue-500/10 mt-2">
                <div>
                  <p className="font-black text-sm" style={{ color: calculerMoyenne(selectedResult.matieres) >= 10 ? '#22c55e' : '#ef4444' }}>
                    Moyenne : {calculerMoyenne(selectedResult.matieres)} / 20
                  </p>
                  <p className="text-[10px] opacity-50 mt-0.5">Calcul basé sur les coefficients (crédits ECTS)</p>
                </div>
                <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold text-[11px] transition shadow-md">
                  <Download size={12} /> PDF
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
