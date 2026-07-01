import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Save, CheckCircle, Building, Calendar, ShieldCheck, 
  RefreshCw, Database, Eye, EyeOff, Key
} from 'lucide-react';

// ── Types pour les paramètres de l'application ─────────────────
interface ConfigurationSysteme {
  nomUniversite: string;
  codeEtablissement: string;
  emailContact: string;
  telephone: string;
  anneeUniversitaire: string;
  dateDebutRentrée: string;
  statutInscriptions: boolean;
  seuilValidationModule: number; // ex: 10/20 ou 12/20
  doubleFacteurAuth: boolean;
  sauvegardeAutomatique: boolean;
}

const CONFIG_INITIALE: ConfigurationSysteme = {
  nomUniversite: 'ETEC University',
  codeEtablissement: 'ETEC-TANA',
  emailContact: 'contact@etec.mg',
  telephone: '+261 20 22 345 67',
  anneeUniversitaire: '2026-2027',
  dateDebutRentrée: '2026-10-15',
  statutInscriptions: true,
  seuilValidationModule: 10,
  doubleFacteurAuth: false,
  sauvegardeAutomatique: true
};

export default function AdminParametres() {
  const { darkMode } = useTheme();
  const [config, setConfig] = useState<ConfigurationSysteme>(CONFIG_INITIALE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // États pour la section changement de mot de passe admin
  const [showPwd, setShowPwd] = useState({ actuel: false, nouveau: false });
  const [pwdForm, setPwdForm] = useState({ actuel: '', nouveau: '', confirmation: '' });

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

  // ── Handlers ────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setConfig({ ...config, [name]: checked });
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulation d'un enregistrement API
    setTimeout(() => {
      setIsSaving(false);
      showToast('Configurations système enregistrées avec succès');
    }, 800);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdForm.actuel || !pwdForm.nouveau || !pwdForm.confirmation) {
      showToast('Veuillez remplir tous les champs de sécurité.');
      return;
    }
    if (pwdForm.nouveau !== pwdForm.confirmation) {
      showToast('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
      return;
    }
    
    showToast('Mot de passe administrateur mis à jour');
    setPwdForm({ actuel: '', nouveau: '', confirmation: '' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white bg-green-500">
          <CheckCircle size={15} /> {toastMessage}
        </div>
      )}

      {/* En-tête de section */}
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight">Paramètres du Système</h1>
        <p className="text-xs opacity-45 mt-1">Configurez les règles de gestion académique, les dates clés de l'établissement et la sécurité globale</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne Principale : Configurations Générales & Académiques */}
        <form onSubmit={handleSaveConfig} className="lg:col-span-2 space-y-5">
          
          {/* Section 1 : Informations Institutionnelles */}
          <div className="p-5 rounded-2xl border space-y-4" style={cardStyle}>
            <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <Building size={16} className="text-blue-500" />
              <h2 className="text-xs font-black uppercase tracking-wider">Identité de l'Établissement</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Nom officiel de l'Université</label>
                <input name="nomUniversite" value={config.nomUniversite} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Code Identifiant</label>
                <input name="codeEtablissement" value={config.codeEtablissement} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none font-mono text-[11px]" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Adresse Email de contact</label>
                <input type="email" name="emailContact" value={config.emailContact} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Ligne Téléphonique</label>
                <input name="telephone" value={config.telephone} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Section 2 : Calendrier & Règlements Académiques */}
          <div className="p-5 rounded-2xl border space-y-4" style={cardStyle}>
            <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <Calendar size={16} className="text-purple-500" />
              <h2 className="text-xs font-black uppercase tracking-wider">Périodes & Règles Universitaires</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Année Académique Active</label>
                <select name="anneeUniversitaire" value={config.anneeUniversitaire} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none cursor-pointer appearance-none" style={inputStyle}>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                  <option value="2027-2028">2027-2028</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Date prévisionnelle de la rentrée</label>
                <input type="date" name="dateDebutRentrée" value={config.dateDebutRentrée} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Note minimale de validation de module (/20)</label>
                <input type="number" name="seuilValidationModule" min={10} max={16} value={config.seuilValidationModule} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none font-bold text-sm" style={inputStyle} />
              </div>

              {/* Toggles Interrupteurs */}
              <div className="space-y-3 pt-4 sm:pt-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" name="statutInscriptions" checked={config.statutInscriptions} onChange={handleCheckboxChange} className="w-4 h-4 accent-blue-500 cursor-pointer" />
                  <div>
                    <p className="font-bold text-[11px]">Inscriptions Publiques Ouvertes</p>
                    <p className="text-[9px] opacity-45">Permettre l'accès au formulaire de candidature extérieur</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Bouton de sauvegarde global */}
          <div className="flex justify-end">
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-white transition hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: 'var(--primary)' }}>
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              Enregistrer les modifications
            </button>
          </div>

        </form>

        {/* Colonne Latérale : Sécurité & Actions Système */}
        <div className="space-y-5">
          
          {/* Bloc Changement de Mot de Passe */}
          <div className="p-5 rounded-2xl border space-y-4" style={cardStyle}>
            <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <ShieldCheck size={16} className="text-red-500" />
              <h2 className="text-xs font-black uppercase tracking-wider">Sécurité Administrateur</h2>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-3 text-xs">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold uppercase opacity-60">Mot de passe actuel</label>
                <input type={showPwd.actuel ? 'text' : 'password'} value={pwdForm.actuel} onChange={e => setPwdForm({...pwdForm, actuel: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none pr-10" style={inputStyle} />
                <button type="button" onClick={() => setShowPwd({...showPwd, actuel: !showPwd.actuel})} className="absolute right-3 bottom-3 opacity-40 hover:opacity-100">
                  {showPwd.actuel ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold uppercase opacity-60">Nouveau mot de passe</label>
                <input type={showPwd.nouveau ? 'text' : 'password'} value={pwdForm.nouveau} onChange={e => setPwdForm({...pwdForm, nouveau: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none pr-10" style={inputStyle} />
                <button type="button" onClick={() => setShowPwd({...showPwd, nouveau: !showPwd.nouveau})} className="absolute right-3 bottom-3 opacity-40 hover:opacity-100">
                  {showPwd.nouveau ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase opacity-60">Confirmer le mot de passe</label>
                <input type="password" value={pwdForm.confirmation} onChange={e => setPwdForm({...pwdForm, confirmation: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border focus:outline-none" style={inputStyle} />
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-1.5 mt-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-500 font-bold transition hover:bg-red-500/5">
                <Key size={13} /> Mettre à jour la clé
              </button>
            </form>
          </div>

          {/* Bloc Maintenance & Base de Données */}
          <div className="p-5 rounded-2xl border space-y-4" style={cardStyle}>
            <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <Database size={16} className="text-amber-500" />
              <h2 className="text-xs font-black uppercase tracking-wider">Maintenance & Données</h2>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" name="sauvegardeAutomatique" checked={config.sauvegardeAutomatique} onChange={handleCheckboxChange} className="w-4 h-4 accent-amber-500 cursor-pointer" />
                <div>
                  <p className="font-bold text-[11px]">Sauvegarde automatique Cloud</p>
                  <p className="text-[9px] opacity-45">Archiver les bases SQL toutes les 24 heures</p>
                </div>
              </label>

              <div className="pt-2 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] opacity-50">Dernière sauvegarde système effectuée : **Aujourd'hui à 04:00 AM**</p>
                <button type="button" onClick={() => showToast('Génération instantanée du fichier SQL exporté lancée...')} className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 font-bold transition hover:opacity-80">
                  <Database size={13} /> Forcer un backup complet (.sql)
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}