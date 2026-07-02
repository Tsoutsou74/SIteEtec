import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Settings, Key, Bell, Save, Eye, EyeOff, 
  UserCheck, FilePlus, FileText, Clock, CheckCircle2 
} from 'lucide-react';

interface DemandeDocument {
  id: string;
  typeDoc: string;
  dateDemande: string;
  statut: 'En attente' | 'Prêt' | 'Rejeté';
}

export default function Parametres() {
  const { darkMode } = useTheme();
  
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifNotes, setNotifNotes] = useState(true);
  const [saved, setSaved] = useState(false);

  const [typeDocumentSelectionne, setTypeDocumentSelectionne] = useState('Certificat de scolarité');
  const [listeDemandes, setListeDemandes] = useState<DemandeDocument[]>([
    { id: 'req-1', typeDoc: 'Certificat de scolarité', dateDemande: '15 Juin 2026', statut: 'Prêt' },
    { id: 'req-2', typeDoc: 'Relevé de notes officiel - Semestre 1', dateDemande: '30 Juin 2026', statut: 'En attente' }
  ]);

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };
  const inputStyle = "w-full font-medium text-xs px-3.5 py-2.5 rounded-xl border bg-transparent focus:outline-hidden focus:border-[var(--primary)] transition-all";

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSoumettreDemande = (e: React.FormEvent) => {
    e.preventDefault();
    const nouvelleDemande: DemandeDocument = {
      id: `req-${Date.now()}`,
      typeDoc: typeDocumentSelectionne,
      dateDemande: 'Aujourd\'hui',
      statut: 'En attente'
    };
    setListeDemandes([nouvelleDemande, ...listeDemandes]);
  };

  return (
    <div className="space-y-6 w-full pb-12 animate-fade-in">
      
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between gap-4 border-b pb-4" style={borderStyle}>
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <Settings className="text-[var(--primary)]" size={24} />
            Paramètres du Compte
          </h1>
          <p className="text-xs opacity-45 mt-0.5">
            Gerez vos informations, securisez votre compte et suivez vos demandes administratives.
          </p>
        </div>
      </div>

      {/* ─── Bento Grid Réorganisé (Sécurité et Mails montés tout en haut) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full items-start">
        
        {/* ================= CÔTÉ GAUCHE (Profil + Documents) ================= */}
        <div className="md:col-span-2 space-y-5 w-full">
          
          {/* 1. Carte Profil */}
          <div className="p-5 rounded-2xl border space-y-4 shadow-2xs" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <h3 className="text-xs font-black uppercase tracking-wider opacity-60 flex items-center gap-1.5">
              <UserCheck size={14} className="text-[var(--primary)]" />
              Profil Officiel Étudiant
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold opacity-45">Nom & Prénoms</label>
                <input type="text" value="Miaritsoa" disabled className={`${inputStyle} opacity-60 cursor-not-allowed`} style={borderStyle} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold opacity-45">Adresse Email</label>
                <input type="email" value="miaritsoa@etec.university.edu" disabled className={`${inputStyle} opacity-60 cursor-not-allowed`} style={borderStyle} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold opacity-45">Numéro Matricule</label>
                <div className="px-3.5 py-2.5 border rounded-xl font-mono text-xs font-black bg-black/5 dark:bg-white/5" style={borderStyle}>
                  ETU-2026-0943
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold opacity-45">Niveau d'Études actuel</label>
                <div className="px-3.5 py-2.5 border rounded-xl text-xs font-bold bg-black/5 dark:bg-white/5" style={borderStyle}>
                  Master 1 (M1) · Génie Logiciel
                </div>
              </div>
            </div>
          </div>

          {/* 2. Carte Guichet de Documents */}
          <div className="p-5 rounded-2xl border space-y-4 shadow-2xs" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <h3 className="text-xs font-black uppercase tracking-wider opacity-60 flex items-center gap-1.5">
              <FilePlus size={14} className="text-[var(--primary)]" />
              Demande de Pièces Administratives
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3 items-end bg-black/[0.01] dark:bg-white/[0.01] p-3.5 rounded-xl border border-dashed" style={borderStyle}>
              <div className="space-y-1 flex-1 w-full">
                <label className="text-[10px] uppercase font-bold opacity-45">Sélectionner le document requis</label>
                <select
                  value={typeDocumentSelectionne}
                  onChange={(e) => setTypeDocumentSelectionne(e.target.value)}
                  className="w-full font-medium text-xs px-3.5 py-2.5 rounded-xl border h-10 cursor-pointer focus:outline-hidden focus:border-[var(--primary)] transition-all bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                  style={borderStyle}
                >
                  <option value="Certificat de scolarité" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">Certificat de scolarité</option>
                  <option value="Relevé de notes officiel - Semestre 1" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">Relevé de notes officiel - Semestre 1</option>
                  <option value="Lettre de recommandation académique" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">Lettre de recommandation académique</option>
                  <option value="Attestation de réussite provisoire" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">Attestation de réussite provisoire</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleSoumettreDemande}
                className="w-full sm:w-auto h-10 px-4 rounded-xl text-xs font-black text-white bg-[var(--primary)] hover:opacity-90 transition whitespace-nowrap cursor-pointer"
              >
                Commander la pièce
              </button>
            </div>

            <div className="space-y-2">
              <div className="divide-y border rounded-xl overflow-hidden bg-black/[0.01] dark:bg-white/[0.01]" style={borderStyle}>
                {listeDemandes.map((demande) => (
                  <div key={demande.id} className="p-3 flex items-center justify-between text-xs gap-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText size={14} className="opacity-40 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold tracking-tight truncate">{demande.typeDoc}</p>
                        <p className="text-[10px] opacity-40 font-medium">Demandé le {demande.dateDemande}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {demande.statut === 'Prêt' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
                          <CheckCircle2 size={10} /> À RÉCUPÉRER
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/10">
                          <Clock size={10} /> EN TRAITEMENT
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ================= CÔTÉ DROIT (Sécurité + Mails montés en haut) ================= */}
        <div className="md:col-span-1 space-y-5 w-full">
          
          {/* 3. Bloc Sécurité (Directement en haut désormais) */}
          <div className="p-5 rounded-2xl border space-y-4 shadow-2xs" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <h3 className="text-xs font-black uppercase tracking-wider opacity-60 flex items-center gap-1.5">
              <Key size={14} className="text-[var(--primary)]" />
              Sécurité du compte
            </h3>
            <div className="space-y-3">
              <div className="space-y-1 relative">
                <label className="text-[10px] uppercase font-bold opacity-45">Mot de passe actuel</label>
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputStyle}
                  style={borderStyle}
                />
                <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-7 opacity-40 hover:opacity-100 transition">
                  {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="space-y-1 relative">
                <label className="text-[10px] uppercase font-bold opacity-45">Nouveau mot de passe</label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className={inputStyle}
                  style={borderStyle}
                />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-7 opacity-40 hover:opacity-100 transition">
                  {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* 4. Bloc Configuration Mails */}
          <div className="p-5 rounded-2xl border space-y-4 shadow-2xs" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <h3 className="text-xs font-black uppercase tracking-wider opacity-60 flex items-center gap-1.5">
              <Bell size={14} className="text-[var(--primary)]" />
              Alertes Courriels
            </h3>
            <div className="space-y-3.5 divide-y" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold opacity-80">Absences & Retards</span>
                <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} className="w-4 h-4 accent-[var(--primary)] cursor-pointer" />
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-xs font-bold opacity-80">Notes publiées</span>
                <input type="checkbox" checked={notifNotes} onChange={(e) => setNotifNotes(e.target.checked)} className="w-4 h-4 accent-[var(--primary)] cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Bouton global de Sauvegarde */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {saved ? (
              <span className="text-[11px] font-bold text-emerald-500 animate-pulse">✓ Enregistré !</span>
            ) : <span />}
            <button
              type="button"
              onClick={handleSavePreferences}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black text-white bg-[var(--primary)] hover:opacity-95 transition cursor-pointer shadow-xs"
            >
              <Save size={14} />
              <span>Sauvegarder</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}