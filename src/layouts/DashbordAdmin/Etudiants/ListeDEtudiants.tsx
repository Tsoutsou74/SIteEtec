import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Plus,
  Phone,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';

type Filiere = 'Informatique' | 'Administration' | 'BTP' | 'Électromécanique';
type Niveau = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';

interface Etudiant {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  dateNaissance?: string;
  numeroId?: string;
  nomPere?: string;
  professionPere?: string;
  nomMere?: string;
  professionMere?: string;
  grade?: string;
  mention?: string;
  vague?: string;
  dateInscription?: string;
  filiere: Filiere;
  niveau: Niveau;
  statut: 'Actif' | 'Inactif';
}

const NIVEAUX: Niveau[] = ['L1', 'L2', 'L3', 'M1', 'M2'];
const FILIERES: Filiere[] = ['Informatique', 'Administration', 'BTP', 'Électromécanique'];
const STUDENTS_STORAGE_KEY = 'etec_students';

const DEMO_ETUDIANTS: Etudiant[] = [
  { id: '1', matricule: 'ETU-26001', nom: 'Rakoto', prenom: 'Aina', email: 'aina.rakoto@etec.mg', telephone: '032 12 345 67', filiere: FILIERES[0], niveau: 'L3', statut: 'Actif' },
  { id: '2', matricule: 'ETU-26002', nom: 'Andrianina', prenom: 'Mickael', email: 'mickael.andrianina@etec.mg', telephone: '033 23 456 78', filiere: FILIERES[1], niveau: 'M1', statut: 'Actif' },
  { id: '3', matricule: 'ETU-26003', nom: 'Rasoanaivo', prenom: 'Tiana', email: 'tiana.rasoanaivo@etec.mg', telephone: '034 34 567 89', filiere: FILIERES[2], niveau: 'M2', statut: 'Inactif' },
  { id: '4', matricule: 'ETU-26004', nom: 'Rakotomalala', prenom: 'Fanja', email: 'fanja.rakotomalala@etec.mg', telephone: '032 45 678 90', filiere: FILIERES[3], niveau: 'L2', statut: 'Actif' },
];

const levelTone = (niveau: Niveau) => niveau.startsWith('M')
  ? 'bg-violet-500/10 text-violet-500'
  : 'bg-cyan-500/10 text-cyan-500';

export default function ListEtudiants() {
  const { darkMode } = useTheme();
  const [etudiants, setEtudiants] = useState<Etudiant[]>(() => {
    try {
      const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) as Etudiant[] : DEMO_ETUDIANTS;
    } catch {
      return DEMO_ETUDIANTS;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState<Niveau>('L2');
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | null>(null);
  const [selectedEtudiant, setSelectedEtudiant] = useState<Etudiant | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [newStudent, setNewStudent] = useState({
    nom: '', prenom: '', matricule: '', dateNaissance: '', adresse: '',
    nomPere: '', professionPere: '', nomMere: '', professionMere: '',
    numeroId: '', grade: '', mention: '', vague: '', telephone: '', email: '',
    dateInscription: '', filiere: FILIERES[0] as Filiere, niveau: 'L1' as Niveau,
  });

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

  useEffect(() => {
    const fetchEtudiants = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        // Remplacer ce tableau par l'appel API lorsque la route sera disponible.
        const response = { data: [] as Etudiant[] };
        if (response.data.length > 0) setEtudiants(response.data);
      } catch (error) {
        console.error(error);
        setLoadError("Impossible de charger l'annuaire des étudiants.");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchEtudiants();
  }, []);

  useEffect(() => {
    const refreshFromStorage = () => {
      try {
        const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
        if (saved) setEtudiants(JSON.parse(saved) as Etudiant[]);
      } catch {
        // Les données locales invalides ne doivent pas bloquer l'annuaire.
      }
    };
    window.addEventListener('storage', refreshFromStorage);
    return () => window.removeEventListener('storage', refreshFromStorage);
  }, []);

  const niveaux = useMemo(() => NIVEAUX.map((niveau) => ({
    niveau,
    total: etudiants.filter((etudiant) => etudiant.niveau === niveau).length,
  })), [etudiants]);

  const filieresDuNiveau = useMemo(() => FILIERES.map((filiere) => ({
    filiere,
    etudiants: etudiants.filter((etudiant) => etudiant.niveau === selectedNiveau && etudiant.filiere === filiere),
  })).filter(({ etudiants: inscrits }) => inscrits.length > 0), [etudiants, selectedNiveau]);

  const etudiantsVisibles = useMemo(() => {
    if (!selectedFiliere) return [];
    const query = search.toLowerCase().trim();
    return etudiants.filter((etudiant) => {
      const matchesPath = etudiant.niveau === selectedNiveau && etudiant.filiere === selectedFiliere;
      const matchesSearch = !query || [etudiant.nom, etudiant.prenom, etudiant.matricule]
        .some((value) => value.toLowerCase().includes(query));
      return matchesPath && matchesSearch;
    });
  }, [etudiants, search, selectedFiliere, selectedNiveau]);

  const selectNiveau = (niveau: Niveau) => {
    setSelectedNiveau(niveau);
    setSelectedFiliere(null);
    setSearch('');
  };

  const exportEtudiants = () => {
    const csv = etudiants.map((etudiant) => [etudiant.matricule, etudiant.nom, etudiant.prenom, etudiant.email, etudiant.filiere, etudiant.niveau].join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'etudiants.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const addStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const student: Etudiant = {
      ...newStudent,
      id: String(Date.now()),
      matricule: newStudent.matricule || `ETU-${Date.now()}`,
      statut: 'Actif',
    };
    const updatedStudents = [...etudiants, student];
    setEtudiants(updatedStudents);
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(updatedStudents));
    setNewStudent({ nom: '', prenom: '', matricule: '', dateNaissance: '', adresse: '', nomPere: '', professionPere: '', nomMere: '', professionMere: '', numeroId: '', grade: '', mention: '', vague: '', telephone: '', email: '', dateInscription: '', filiere: FILIERES[0], niveau: 'L1' });
    setIsAddOpen(false);
    setModalStep(1);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center gap-2 py-24 opacity-60"><Loader2 size={18} className="animate-spin" /><span className="text-xs font-bold">Chargement de l'annuaire...</span></div>;
  }

  if (loadError) {
    return <div className="rounded-2xl border border-dashed py-12 text-center opacity-70" style={{ borderColor: 'var(--border)' }}><AlertTriangle size={32} className="mx-auto mb-2 opacity-50" /><p className="mb-3 text-xs font-bold">{loadError}</p></div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border p-5 shadow-sm md:flex-row md:items-center" style={{ ...cardStyle, background: darkMode ? 'linear-gradient(135deg, rgba(255,255,255,0.07), transparent 58%), var(--card)' : 'linear-gradient(135deg, rgba(59,130,246,0.10), transparent 58%), var(--card)' }}>
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--primary)]">Annuaire académique</p>
          <h1 className="text-2xl font-black tracking-tight md:text-3xl">Gestion des étudiants</h1>
          <p className="hidden">Choisissez un grade, puis une filière pour voir ses étudiants.</p>
        </div>
        <div className="relative flex flex-wrap items-center gap-2">
          <div className="hidden w-fit items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold sm:flex" style={{ borderColor: 'var(--border)' }}>
            <Users size={14} className="text-[var(--primary)]" /> {etudiants.length} étudiants inscrits
          </div>
          <button onClick={exportEtudiants} className="rounded-xl border px-3.5 py-2.5 text-xs font-bold transition hover:-translate-y-px hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
            Exportation
          </button>
          <button onClick={() => { setModalStep(1); setIsAddOpen(true); }} className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-px hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30" style={{ backgroundColor: 'var(--primary)' }}>
            <Plus size={15} /> Ajouter un étudiant
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
        <aside className="flex-1 rounded-2xl border p-2 shadow-sm" style={cardStyle}>
          <div className="hidden"><p className="text-[10px] font-black uppercase tracking-widest opacity-40">Grades</p><p className="mt-1 text-xs opacity-55">Parcours disponibles</p></div>
          <div className="flex flex-wrap gap-1.5">
            {niveaux.map(({ niveau, total }) => (
              <button key={niveau} onClick={() => selectNiveau(niveau)} className={`min-w-12 rounded-md border px-3 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 ${selectedNiveau === niveau ? 'border-[var(--primary)] bg-[var(--primary)]/10 font-black text-[var(--primary)]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`} style={selectedNiveau === niveau ? undefined : { borderColor: 'var(--border)' }}>
                {niveau}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex items-center justify-end rounded-2xl border p-2 shadow-sm" style={cardStyle}>
          <label className="flex w-full items-center rounded-xl border px-3 py-2 sm:w-56" style={{ borderColor: 'var(--border)' }}>
            <Search size={13} className="mr-1.5 opacity-50" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Bar de recherche" className="w-full bg-transparent text-xs uppercase outline-none" style={{ color: 'var(--text)' }} />
          </label>
        </div>
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-2xl border p-2 shadow-sm" style={cardStyle}>
          {FILIERES.map((filiere) => (
            <button key={filiere} onClick={() => setSelectedFiliere(selectedFiliere === filiere ? null : filiere)} className={`rounded-md px-3 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 ${selectedFiliere === filiere ? 'bg-[var(--primary)]/10 font-black text-[var(--primary)]' : 'hover:bg-black/5 hover:text-[var(--primary)] dark:hover:bg-white/5'}`}>{filiere}</button>
          ))}
        </div>

        <section className="min-h-[320px] min-w-0 space-y-3 rounded-3xl border p-4 shadow-sm md:p-5" style={{ ...cardStyle, background: darkMode ? 'linear-gradient(180deg, rgba(255,255,255,0.035), transparent 45%), var(--card)' : 'linear-gradient(180deg, rgba(59,130,246,0.035), transparent 45%), var(--card)' }}>
          {!selectedFiliere && <p className="text-xs leading-6">Cliquez sur {selectedNiveau} et choisissez une mention pour afficher tous les étudiants. Vous pouvez voir toutes les informations des étudiants dans la fiche.</p>}
          <div className={selectedFiliere ? "flex flex-col justify-between gap-3 sm:flex-row sm:items-center" : "hidden"}>
            <div><p className="text-[10px] font-black uppercase tracking-widest opacity-40">Grade sélectionné</p><h2 className="text-lg font-black">{selectedNiveau} <span className="font-normal opacity-35">/ Mentions</span></h2></div>
            {selectedFiliere && <div className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs" style={{ borderColor: 'var(--border)' }}><BookOpen size={14} className="text-[var(--primary)]" /> {selectedFiliere}<button type="button" onClick={() => setSelectedFiliere(null)} aria-label="Fermer la filière" className="rounded-md p-1 opacity-60 transition hover:bg-black/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"><X size={14} /></button></div>}
          </div>

          {!selectedFiliere ? (
            filieresDuNiveau.length > 0 ? <div className="hidden">
              {filieresDuNiveau.map(({ filiere, etudiants: inscrits }) => (
                <button key={filiere} onClick={() => setSelectedFiliere(filiere)} className="group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30" style={cardStyle}>
                  <div className="mb-4 flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]"><BookOpen size={19} /></span><ChevronRight size={17} className="opacity-25 transition group-hover:translate-x-1 group-hover:text-[var(--primary)] group-hover:opacity-100" /></div>
                  <h3 className="text-sm font-black">{filiere}</h3><p className="mt-1 text-xs opacity-45">{inscrits.length} étudiant{inscrits.length > 1 ? 's' : ''} dans ce grade</p>
                </button>
              ))}
            </div> : <EmptyState title="Aucune filière dans ce grade" text="Les étudiants ajoutés à ce grade apparaîtront ici." />
          ) : (
            <div className="space-y-3">
              <div className="hidden"><Search size={15} className="opacity-40" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un étudiant..." className="w-full bg-transparent text-xs outline-none" style={{ color: 'var(--text)' }} /></div>
              {etudiantsVisibles.length > 0 ? <div className="grid gap-3 md:grid-cols-2">
                {etudiantsVisibles.map((etudiant) => <button key={etudiant.id} onClick={() => setSelectedEtudiant(etudiant)} className="rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30" style={cardStyle}><div className="flex items-start justify-between gap-3"><div><span className="font-mono text-[10px] opacity-45">{etudiant.matricule}</span><h3 className="mt-1 text-sm font-black">{etudiant.prenom} {etudiant.nom}</h3></div><span className={`rounded-full px-2 py-1 text-[10px] font-black ${levelTone(etudiant.niveau)}`}>{etudiant.niveau}</span></div><div className="mt-4 flex items-center gap-1 truncate border-t pt-3 text-[11px] opacity-60" style={{ borderColor: 'var(--border)' }}><Mail size={12} /> {etudiant.email}</div></button>)}
              </div> : <EmptyState title="Aucun étudiant trouvé" text="Cette filière ne contient aucun étudiant correspondant à votre recherche." />}
            </div>
          )}
        </section>
      </div>

      {isAddOpen && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        <form onSubmit={addStudent} className="styled-scrollbar max-h-[calc(100vh-2rem)] w-full max-w-3xl space-y-5 overflow-y-auto rounded-3xl border p-6 shadow-2xl md:p-8" style={cardStyle}>
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-base font-black">Ajouter un étudiant</h2>
            <button type="button" onClick={() => setIsAddOpen(false)} aria-label="Fermer" className="rounded-lg p-1.5 opacity-60 transition hover:bg-black/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-2xl border p-2" style={{ borderColor: 'var(--border)' }}>
            {[['1', 'Identité'], ['2', 'Famille & contact'], ['3', 'Cursus']].map(([step, label]) => <button key={step} type="button" onClick={() => setModalStep(Number(step))} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${modalStep === Number(step) ? 'bg-[var(--primary)] text-white shadow-md' : 'opacity-55 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/5'}`}>{step}. {label}</button>)}
          </div>
          {modalStep === 1 && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {([['prenom', 'Prénom'], ['nom', 'Nom'], ['matricule', 'Numéro matricule'], ['dateNaissance', 'Date de naissance'], ['adresse', 'Lieu de naissance'], ['numeroId', 'Numéro ID (RFID)']] as const).map(([name, label]) => <label key={name} className="space-y-1.5 text-xs font-bold"><span>{label}</span><input required={['prenom', 'nom'].includes(name)} name={name} type={name.includes('date') ? 'date' : 'text'} value={newStudent[name]} onChange={(event) => setNewStudent((current) => ({ ...current, [name]: event.target.value }))} className="w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-[var(--primary)]/30" style={inputStyle} /></label>)}
          </div>}
          {modalStep === 2 && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {([['nomPere', 'Nom du père'], ['professionPere', 'Profession du père'], ['nomMere', 'Nom de la mère'], ['professionMere', 'Profession de la mère'], ['telephone', 'Numéro téléphone'], ['email', 'Email']] as const).map(([name, label]) => <label key={name} className="space-y-1.5 text-xs font-bold"><span>{label}</span><input required={['telephone', 'email'].includes(name)} name={name} type={name === 'email' ? 'email' : 'text'} value={newStudent[name]} onChange={(event) => setNewStudent((current) => ({ ...current, [name]: event.target.value }))} className="w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-[var(--primary)]/30" style={inputStyle} /></label>)}
          </div>}
          {modalStep === 3 && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {([['vague', 'Vague'], ['dateInscription', "Date d'inscription"]] as const).map(([name, label]) => <label key={name} className="space-y-1.5 text-xs font-bold"><span>{label}</span><input name={name} type={name.includes('date') ? 'date' : 'text'} value={newStudent[name]} onChange={(event) => setNewStudent((current) => ({ ...current, [name]: event.target.value }))} className="w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-[var(--primary)]/30" style={inputStyle} /></label>)}
            <label className="space-y-1.5 text-xs font-bold"><span>Mention</span><select name="filiere" value={newStudent.filiere} onChange={(event) => setNewStudent((current) => ({ ...current, filiere: event.target.value as Filiere }))} className="w-full rounded-xl border px-3 py-2.5 font-normal outline-none" style={inputStyle}>{FILIERES.map((filiere) => <option key={filiere}>{filiere}</option>)}</select></label>
            <label className="space-y-1.5 text-xs font-bold"><span>Grade</span><select name="niveau" value={newStudent.niveau} onChange={(event) => setNewStudent((current) => ({ ...current, niveau: event.target.value as Niveau }))} className="w-full rounded-xl border px-3 py-2.5 font-normal outline-none" style={inputStyle}>{NIVEAUX.map((niveau) => <option key={niveau}>{niveau}</option>)}</select></label>
          </div>}
          <div className="hidden grid-cols-2 gap-3">
            {([['prenom', 'Prénom'], ['nom', 'Nom'], ['email', 'Email'], ['telephone', 'Téléphone']] as const).map(([name, label]) => (
              <label key={name} className="space-y-1 text-xs font-bold"><span>{label}</span><input required name={name} value={newStudent[name]} onChange={(event) => setNewStudent((current) => ({ ...current, [name]: event.target.value }))} className="w-full border px-2.5 py-2 font-normal outline-none" style={inputStyle} /></label>
            ))}
            <label className="space-y-1 text-xs font-bold"><span>Filière</span><select name="filiere" value={newStudent.filiere} onChange={(event) => setNewStudent((current) => ({ ...current, filiere: event.target.value as Filiere }))} className="w-full border px-2.5 py-2 font-normal outline-none" style={inputStyle}>{FILIERES.map((filiere) => <option key={filiere}>{filiere}</option>)}</select></label>
            <label className="space-y-1 text-xs font-bold"><span>Grade</span><select name="niveau" value={newStudent.niveau} onChange={(event) => setNewStudent((current) => ({ ...current, niveau: event.target.value as Niveau }))} className="w-full border px-2.5 py-2 font-normal outline-none" style={inputStyle}>{NIVEAUX.map((niveau) => <option key={niveau}>{niveau}</option>)}</select></label>
          </div>
          <div className="hidden" />
          <div className="hidden">
            {([['matricule', 'Numéro matricule'], ['dateNaissance', 'Date de naissance'], ['adresse', 'Lieu de naissance'], ['nomPere', 'Nom du père'], ['professionPere', 'Profession du père'], ['nomMere', 'Nom de la mère'], ['professionMere', 'Profession de la mère'], ['numeroId', 'Numéro ID (RFID)'], ['grade', 'Grade'], ['mention', 'Mention'], ['vague', 'Vague'], ['dateInscription', "Date d'inscription"]] as const).map(([name, label]) => (
              <label key={name} className="space-y-1 text-xs font-bold"><span>{label}</span><input name={name} type={name.toLowerCase().includes('date') ? 'date' : 'text'} value={newStudent[name]} onChange={(event) => setNewStudent((current) => ({ ...current, [name]: event.target.value }))} className="w-full rounded-lg border px-2.5 py-2 font-normal outline-none transition focus:ring-2 focus:ring-[var(--primary)]/30" style={inputStyle} /></label>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            <button type="button" onClick={() => modalStep > 1 ? setModalStep((step) => step - 1) : setIsAddOpen(false)} className="rounded-xl border px-4 py-2.5 text-xs font-bold transition hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>{modalStep > 1 ? 'Précédent' : 'Annuler'}</button>
            {modalStep < 3 ? <button type="button" onClick={() => setModalStep((step) => step + 1)} className="rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition hover:-translate-y-px hover:brightness-110" style={{ backgroundColor: 'var(--primary)' }}>Suivant</button> : <button type="submit" className="rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition hover:-translate-y-px hover:brightness-110" style={{ backgroundColor: 'var(--primary)' }}>Enregistrer</button>}
          </div>
        </form>
      </div>}

      {selectedEtudiant && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"><div className="relative w-full max-w-sm rounded-3xl border p-6 shadow-2xl" style={cardStyle}><button type="button" onClick={() => setSelectedEtudiant(null)} className="absolute right-4 top-4 rounded-lg p-1.5 opacity-60 transition hover:bg-black/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30" aria-label="Fermer"><X size={18} /></button><div className="border-b pb-4 text-center" style={{ borderColor: 'var(--border)' }}><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)]/10 text-lg font-black text-[var(--primary)]">{selectedEtudiant.prenom[0]}{selectedEtudiant.nom[0]}</div><h2 className="mt-3 text-base font-black">{selectedEtudiant.prenom} {selectedEtudiant.nom}</h2><p className="mt-1 font-mono text-[10px] opacity-45">{selectedEtudiant.matricule}</p><div className="mt-3 flex justify-center gap-2"><span className="rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-[10px] font-bold text-[var(--primary)]">{selectedEtudiant.filiere}</span><span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500"><ShieldCheck size={11} />{selectedEtudiant.statut}</span></div></div><div className="space-y-3 py-4 text-xs"><p className="flex items-center gap-2"><Mail size={13} className="opacity-50" />{selectedEtudiant.email}</p><p className="flex items-center gap-2"><Phone size={13} className="opacity-50" />{selectedEtudiant.telephone}</p><p className="flex items-center gap-2"><GraduationCap size={13} className="opacity-50" />Grade {selectedEtudiant.niveau}</p><p className="flex items-center gap-2"><MapPin size={13} className="opacity-50" />Campus ETEC Antananarivo</p></div><button type="button" onClick={() => setSelectedEtudiant(null)} className="w-full rounded-xl border py-2.5 text-xs font-bold transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>Fermer la fiche</button></div></div>}
      {selectedEtudiant && <StudentDetails student={selectedEtudiant} cardStyle={cardStyle} onClose={() => setSelectedEtudiant(null)} />}
    </div>
  );
}

function StudentDetails({ student, cardStyle, onClose }: { student: Etudiant; cardStyle: React.CSSProperties; onClose: () => void }) {
  const rows = [
    ['Nom', student.nom], ['Prénom', student.prenom], ['Matricule', student.matricule],
    ['Date de naissance', student.dateNaissance], ['Lieu de naissance', student.adresse],
    ['Téléphone', student.telephone], ['Email', student.email], ['ID RFID', student.numeroId],
    ['Père', student.nomPere], ['Profession du père', student.professionPere],
    ['Mère', student.nomMere], ['Profession de la mère', student.professionMere],
    ['Grade', student.grade || student.niveau], ['Mention', student.mention || student.filiere],
    ['Vague', student.vague], ["Date d'inscription", student.dateInscription],
  ];

  return <div className="fixed inset-0 z-[300] flex items-stretch justify-end bg-slate-950/65 backdrop-blur-md">
    <div className="student-slide-panel styled-scrollbar h-full max-h-full w-full max-w-2xl overflow-y-auto rounded-l-[2rem] border-y border-l shadow-2xl" style={{ ...cardStyle, background: 'linear-gradient(145deg, var(--card), rgba(59,130,246,0.07))' }}>
      <div className="relative overflow-hidden border-b p-6 md:p-8" style={{ borderColor: 'var(--border)' }}>
        <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[var(--primary)]/15 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-xl font-black text-white shadow-lg shadow-blue-500/25">{student.prenom[0]}{student.nom[0]}</div>
          <div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">Fiche complète</p><h2 className="mt-1 truncate text-xl font-black md:text-2xl">{student.prenom} {student.nom}</h2><p className="mt-1 font-mono text-xs opacity-50">{student.matricule}</p></div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 opacity-60 transition hover:bg-black/10 hover:opacity-100" aria-label="Fermer"><X size={18} /></button>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-[var(--primary)]/10 px-3 py-1.5 text-[11px] font-bold text-[var(--primary)]">{student.filiere}</span><span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-500">{student.statut}</span><span className="rounded-full bg-violet-500/10 px-3 py-1.5 text-[11px] font-bold text-violet-500">Grade {student.grade || student.niveau}</span></div>
      </div>
      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 md:p-8">
        <div><p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--primary)]">Informations personnelles</p><div className="grid gap-2 sm:grid-cols-2">{rows.slice(0, 5).map(([label, value]) => <InfoRow key={label} label={label} value={value} />)}</div></div>
        <div><p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--primary)]">Contact et famille</p><div className="grid gap-2 sm:grid-cols-2">{rows.slice(5, 12).map(([label, value]) => <InfoRow key={label} label={label} value={value} />)}</div></div>
        <div className="md:col-span-2"><p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--primary)]">Parcours académique</p><div className="grid gap-2 sm:grid-cols-3">{rows.slice(12).map(([label, value]) => <InfoRow key={label} label={label} value={value} />)}<InfoRow label="Statut" value={student.statut} /></div></div>
      </div>
      <div className="border-t px-6 py-4 md:px-8" style={{ borderColor: 'var(--border)' }}><button type="button" onClick={onClose} className="w-full rounded-xl border py-3 text-xs font-bold transition hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>Fermer la fiche</button></div>
    </div>
  </div>;
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return <div className="rounded-xl border bg-black/[0.02] p-3 transition hover:border-[var(--primary)]/40 dark:bg-white/[0.03]" style={{ borderColor: 'var(--border)' }}><p className="text-[10px] font-bold uppercase tracking-wider opacity-45">{label}</p><p className="mt-1 break-words text-sm font-semibold">{value || '—'}</p></div>;
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl border border-dashed py-14 text-center" style={{ borderColor: 'var(--border)' }}><GraduationCap size={28} className="mx-auto mb-3 opacity-25" /><p className="text-sm font-black">{title}</p><p className="mt-1 text-xs opacity-45">{text}</p></div>;
}
