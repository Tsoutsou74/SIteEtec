import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, 
  FileText, ShieldCheck, ArrowRight, ArrowLeft, Check, Upload, AlertCircle
} from 'lucide-react';

export default function InscriptionEtudiants() {
  const { darkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1 : Infos Personnelles
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresse: '',
    // Étape 2 : Choix Académique
    filiere: '',
    niveau: '',
    anneeUniversitaire: '2026-2027',
    // Étape 3 : Pièces Jointes
    photo: null as File | null,
    diplome: null as File | null,
  });

  const contentBg = darkMode ? '#0d0d0d' : '#f4f6f8';
  const cardBg = 'var(--card)';
  const borderCol = 'var(--border)';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'diplome') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep(); // Passe à l'écran de succès (Étape 4)
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 pt-30" style={{ backgroundColor: contentBg, color: 'var(--text)' }}>
      <div className="w-full max-w-2xl rounded-2xl border p-6 md:p-8 shadow-xl transition-all duration-300"
        style={{ backgroundColor: cardBg, borderColor: borderCol }}>
        
        {/* En-tête de la carte */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center border mb-3"
            style={{ backgroundColor: 'rgba(0,128,0,0.1)', borderColor: 'rgba(0,128,0,0.2)' }}>
            <GraduationCap size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Portail d'Inscription E-TEC</h1>
          <p className="text-xs opacity-50 mt-1">Rejoignez l'Université pour l'année 2026–2027</p>
        </div>

        {/* Barre de progression des Étapes */}
        {step <= 3 && (
          <div className="flex items-center justify-center gap-2 mb-10 text-xs font-bold">
            {[
              { num: 1, label: 'Personnel', icon: <User size={12} /> },
              { num: 2, label: 'Académie', icon: <GraduationCap size={12} /> },
              { num: 3, label: 'Documents', icon: <FileText size={12} /> }
            ].map((s) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center font-black transition-all"
                    style={{
                      backgroundColor: step >= s.num ? 'var(--primary)' : (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                      color: step >= s.num ? '#fff' : 'var(--text)',
                      opacity: step === s.num ? 1 : 0.6
                    }}>
                    {step > s.num ? <Check size={12} /> : s.num}
                  </div>
                  <span className="hidden sm:inline opacity-70" style={{ color: step === s.num ? 'var(--primary)' : 'inherit' }}>{s.label}</span>
                </div>
                {s.num < 3 && <div className="w-8 md:w-16 h-[2px] opacity-20" style={{ backgroundColor: step > s.num ? 'var(--primary)' : 'var(--text)' }} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Formulaire Principal */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ── ÉTAPE 1 : Informations Personnelles ── */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Nom</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-black/5" style={{ borderColor: borderCol }}>
                    <User size={14} className="opacity-40" />
                    <input required type="text" name="nom" value={formData.nom} onChange={handleInputChange} placeholder="Ex: RAKOTO" className="bg-transparent outline-none w-full text-xs" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Prénom(s)</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-black/5" style={{ borderColor: borderCol }}>
                    <User size={14} className="opacity-40" />
                    <input required type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} placeholder="Ex: Andry" className="bg-transparent outline-none w-full text-xs" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Email</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-black/5" style={{ borderColor: borderCol }}>
                    <Mail size={14} className="opacity-40" />
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="andry@example.com" className="bg-transparent outline-none w-full text-xs" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Téléphone</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-black/5" style={{ borderColor: borderCol }}>
                    <Phone size={14} className="opacity-40" />
                    <input required type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} placeholder="Ex: +261 34 00 000 00" className="bg-transparent outline-none w-full text-xs" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Date de Naissance</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-black/5" style={{ borderColor: borderCol }}>
                  <Calendar size={14} className="opacity-40" />
                  <input required type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleInputChange} className="bg-transparent outline-none w-full text-xs cursor-pointer" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Adresse de résidence</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-black/5" style={{ borderColor: borderCol }}>
                  <MapPin size={14} className="opacity-40" />
                  <input required type="text" name="adresse" value={formData.adresse} onChange={handleInputChange} placeholder="Ex: Lot IVG Antananarivo" className="bg-transparent outline-none w-full text-xs" />
                </div>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 2 : Choix Académique ── */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Filière demandée</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-black/5" style={{ borderColor: borderCol }}>
                  <GraduationCap size={14} className="opacity-40" />
                  <select required name="filiere" value={formData.filiere} onChange={handleInputChange} className="bg-transparent outline-none w-full text-xs cursor-pointer" style={{ color: 'var(--text)' }}>
                    <option value="" disabled className={darkMode ? 'bg-[#141414]' : 'bg-white'}>Sélectionnez une filière</option>
                    <option value="GL" className={darkMode ? 'bg-[#141414]' : 'bg-white'}>Génie Logiciel & Base de Données</option>
                    <option value="ASR" className={darkMode ? 'bg-[#141414]' : 'bg-white'}>Administration Systèmes & Réseaux</option>
                    <option value="电子" className={darkMode ? 'bg-[#141414]' : 'bg-white'}>Électronique & Domotique</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Niveau d'admission</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-black/5" style={{ borderColor: borderCol }}>
                  <GraduationCap size={14} className="opacity-40" />
                  <select required name="niveau" value={formData.niveau} onChange={handleInputChange} className="bg-transparent outline-none w-full text-xs cursor-pointer" style={{ color: 'var(--text)' }}>
                    <option value="" disabled className={darkMode ? 'bg-[#141414]' : 'bg-white'}>Sélectionnez le niveau</option>
                    <option value="L1" className={darkMode ? 'bg-[#141414]' : 'bg-white'}>Licence 1 (Bac requis)</option>
                    <option value="L2" className={darkMode ? 'bg-[#141414]' : 'bg-white'}>Licence 2 (Bac+1 requis)</option>
                    <option value="L3" className={darkMode ? 'bg-[#141414]' : 'bg-white'}>Licence 3 (Bac+2 requis)</option>
                    <option value="M1" className={darkMode ? 'bg-[#141414]' : 'bg-white'}>Master 1 (Licence requise)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Année Universitaire</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-black/5 opacity-60" style={{ borderColor: borderCol }}>
                  <Calendar size={14} className="opacity-40" />
                  <input type="text" name="anneeUniversitaire" value={formData.anneeUniversitaire} disabled className="bg-transparent outline-none w-full text-xs" />
                </div>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 3 : Pièces Jointes ── */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="rounded-xl border p-4 bg-amber-500/5 border-amber-500/20 flex gap-3 text-xs">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="opacity-80">Veuillez fournir des documents scannés clairs au format PDF ou Image (Max 2 Mo).</p>
              </div>

              {/* Upload Photo d'identité */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Photo d'identité</label>
                <label className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition hover:bg-black/5" style={{ borderColor: borderCol }}>
                  <Upload size={18} className="opacity-50" />
                  <span className="text-xs font-medium opacity-70">
                    {formData.photo ? formData.photo.name : "Cliquez pour téléverser votre photo"}
                  </span>
                  <input required type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} className="hidden" />
                </label>
              </div>

              {/* Upload Dernier Diplôme obtenu */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-60">Dernier diplôme ou Relevé de note</label>
                <label className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition hover:bg-black/5" style={{ borderColor: borderCol }}>
                  <Upload size={18} className="opacity-50" />
                  <span className="text-xs font-medium opacity-70">
                    {formData.diplome ? formData.diplome.name : "Cliquez pour téléverser le diplôme (PDF/Image)"}
                  </span>
                  <input required type="file" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, 'diplome')} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 4 : Écran de Succès Final ── */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4 animate-scaleUp">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck size={28} />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black tracking-tight">Inscription Envoyée avec Succès !</h2>
                <p className="text-xs opacity-50 max-w-sm mx-auto">
                  Merci <strong>{formData.prenom} {formData.nom}</strong>. Votre dossier pour l'admission en <strong>{formData.niveau} {formData.filiere}</strong> a été transmis à l'administration.
                </p>
              </div>
              <div className="text-[11px] opacity-40 bg-black/5 p-3 rounded-xl max-w-xs mx-auto border" style={{ borderColor: borderCol }}>
                Un e-mail de confirmation contenant votre numéro de suivi temporaire a été envoyé à : {formData.email}
              </div>
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2 border rounded-xl text-xs font-bold transition hover:opacity-70 cursor-pointer" style={{ borderColor: borderCol }}>
                Revenir à l'accueil
              </button>
            </div>
          )}

          {/* Boutons de Navigation (Masqués à l'étape finale) */}
          {step <= 3 && (
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: borderCol }}>
              <button type="button" onClick={prevStep} disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                style={{ borderColor: borderCol }}>
                <ArrowLeft size={14} />
                Précédent
              </button>

              {step < 3 ? (
                <button type="button" onClick={nextStep}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: 'var(--primary)' }}>
                  Suivant
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black text-white transition hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: '#22c55e' }}>
                  Valider mon inscription
                  <Check size={14} />
                </button>
              )}
            </div>
          )}

        </form>
      </div>
    </div>
  );
}