import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  User, Shield, Bell, Monitor, Save, 
  Lock, Eye, EyeOff, CheckCircle, LogOut 
} from 'lucide-react';

export default function Parametres() {
  const { darkMode, setDarkMode } = useTheme();
  
  // ─── États ──────────────────────────────────────────────
  const [isSaved, setIsSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Données du profil
  const [profile, setProfile] = useState({
    nom: 'ANDRIAMALALA',
    prenom: 'Tahina',
    email: 'tahina.andria@universite.mg',
    telephone: '+261 34 00 000 00',
    grade: 'Enseignant-Chercheur (Maître de Conférences)',
    bureau: 'Porte B-12, Bloc Scientifique'
  });

  // Données de sécurité
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Préférences
  const [preferences, setPreferences] = useState({
    notifEmailCours: true,
    notifEmailNotes: false,
    notifSystemeAdmin: true,
    language: 'fr'
  });

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const inputBg = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const borderStyle = { borderColor: 'var(--border)' };

  // ─── Handlers ───────────────────────────────────────────
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSaveNotification();
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    triggerSaveNotification();
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const triggerSaveNotification = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between border-b pb-4" style={borderStyle}>
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Monitor className="text-[var(--primary)]" size={22} />
            Paramètres du Compte
          </h1>
          <p className="text-xs opacity-50 mt-0.5">
            Gérez vos informations professionnelles, vos préférences d'affichage et la sécurité.
          </p>
        </div>
        
        {isSaved && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20 animate-fade-in">
            <CheckCircle size={14} /> Modifications enregistrées
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ─── NAVIGATION DES SECTIONS (Gauches) ─── */}
        <div className="space-y-2 col-span-1">
          <div className="p-4 rounded-2xl border text-center space-y-3" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <div className="w-16 h-16 rounded-full bg-[var(--primary)] text-white mx-auto flex items-center justify-center text-xl font-black shadow-inner">
              {profile.prenom[0]}{profile.nom[0]}
            </div>
            <div>
              <h3 className="text-xs font-black tracking-tight">{profile.prenom} {profile.nom}</h3>
              <p className="text-[10px] opacity-50 mt-0.5 font-medium">{profile.grade}</p>
            </div>
            <div className="pt-2 border-t text-[10px] opacity-40 font-mono" style={borderStyle}>
              ID: ENS-2026-8841
            </div>
          </div>

          <div className="rounded-2xl border p-2 space-y-1" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <a href="#profil" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-black/5 dark:bg-white/5 text-[var(--primary)]">
              <User size={14} /> Mon Profil Académique
            </a>
            <a href="#preferences" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold opacity-70 hover:opacity-100 transition">
              <Bell size={14} /> Préférences & Affichage
            </a>
            <a href="#securite" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold opacity-70 hover:opacity-100 transition">
              <Shield size={14} /> Sécurité & Accès
            </a>
          </div>
        </div>

        {/* ─── CONTENU DES FORMULAIRES (Droite) ─── */}
        <div className="md:col-span-2 space-y-6">
          
          {/* SECTION 1 : PROFIL ACADÉMIQUE */}
          <section id="profil" className="p-5 rounded-2xl border space-y-4" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 opacity-80">
              <User size={14} className="text-[var(--primary)]" />
              Profil Académique
            </h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">Nom</label>
                  <input 
                    type="text" required
                    className="w-full p-2.5 text-xs rounded-xl border outline-none font-bold" style={{ backgroundColor: inputBg, ...borderStyle, color: 'var(--text)' }}
                    value={profile.nom} onChange={e => setProfile({...profile, nom: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">Prénom(s)</label>
                  <input 
                    type="text" required
                    className="w-full p-2.5 text-xs rounded-xl border outline-none" style={{ backgroundColor: inputBg, ...borderStyle, color: 'var(--text)' }}
                    value={profile.prenom} onChange={e => setProfile({...profile, prenom: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-50 uppercase">Adresse Email Institutionnelle</label>
                <input 
                  type="email" required
                  className="w-full p-2.5 text-xs rounded-xl border outline-none opacity-70 cursor-not-allowed bg-black/10 dark:bg-white/10" style={borderStyle}
                  value={profile.email} readOnly
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">Téléphone</label>
                  <input 
                    type="text"
                    className="w-full p-2.5 text-xs rounded-xl border outline-none" style={{ backgroundColor: inputBg, ...borderStyle, color: 'var(--text)' }}
                    value={profile.telephone} onChange={e => setProfile({...profile, telephone: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">Bureau assigné</label>
                  <input 
                    type="text"
                    className="w-full p-2.5 text-xs rounded-xl border outline-none" style={{ backgroundColor: inputBg, ...borderStyle, color: 'var(--text)' }}
                    value={profile.bureau} onChange={e => setProfile({...profile, bureau: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:opacity-90 transition shadow-xs">
                  <Save size={13} /> Sauvegarder le profil
                </button>
              </div>
            </form>
          </section>

          {/* SECTION 2 : PRÉFÉRENCES & INTERFACE */}
          <section id="preferences" className="p-5 rounded-2xl border space-y-4" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 opacity-80">
              <Bell size={14} className="text-[var(--primary)]" />
              Préférences & Interface
            </h2>

            <div className="space-y-4 divide-y" style={borderStyle}>
              {/* Option Mode Sombre intégré avec le context Global */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-xs font-bold">Mode Sombre (Dark Mode)</h4>
                  <p className="text-[10px] opacity-50">Basculez l'apparence globale du portail enseignant.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Rappels de cours */}
              <div className="flex items-center justify-between pt-3 py-2">
                <div>
                  <h4 className="text-xs font-bold">Rappels de cours</h4>
                  <p className="text-[10px] opacity-50">Recevoir un email récapitulatif la veille de chaque cours programmé.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={preferences.notifEmailCours} 
                    onChange={() => setPreferences({...preferences, notifEmailCours: !preferences.notifEmailCours})}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Alertes de notes */}
              <div className="flex items-center justify-between pt-3 py-2">
                <div>
                  <h4 className="text-xs font-bold">Confirmations de publication</h4>
                  <p className="text-[10px] opacity-50">M'envoyer une copie par mail lors de la clôture d'un Procès-Verbal de notes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" checked={preferences.notifEmailNotes} 
                    onChange={() => setPreferences({...preferences, notifEmailNotes: !preferences.notifEmailNotes})}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 3 : SÉCURITÉ */}
          <section id="securite" className="p-5 rounded-2xl border space-y-4" style={{ backgroundColor: cardBg, ...borderStyle }}>
            <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 opacity-80">
              <Shield size={14} className="text-[var(--primary)]" />
              Sécurité & Authentification
            </h2>

            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold opacity-50 uppercase">Mot de passe actuel</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                    className="w-full p-2.5 pr-10 text-xs rounded-xl border outline-none font-mono" style={{ backgroundColor: inputBg, ...borderStyle, color: 'var(--text)' }}
                    value={security.currentPassword} onChange={e => setSecurity({...security, currentPassword: e.target.value})}
                  />
                  <button 
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 opacity-40 hover:opacity-100 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">Nouveau mot de passe</label>
                  <input 
                    type="password" required minLength={8} placeholder="Min. 8 caractères"
                    className="w-full p-2.5 text-xs rounded-xl border outline-none font-mono" style={{ backgroundColor: inputBg, ...borderStyle, color: 'var(--text)' }}
                    value={security.newPassword} onChange={e => setSecurity({...security, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold opacity-50 uppercase">Confirmer le mot de passe</label>
                  <input 
                    type="password" required placeholder="Re-saisir le mot de passe"
                    className="w-full p-2.5 text-xs rounded-xl border outline-none font-mono" style={{ backgroundColor: inputBg, ...borderStyle, color: 'var(--text)' }}
                    value={security.confirmPassword} onChange={e => setSecurity({...security, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t" style={borderStyle}>
                <button 
                  type="button" 
                  onClick={() => alert('Déconnexion en cours...')}
                  className="flex items-center gap-1.5 px-3 py-2 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <LogOut size={14} /> Déconnexion du portail
                </button>

                <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 dark:bg-white dark:text-black text-white text-xs font-bold rounded-xl cursor-pointer hover:opacity-90 transition shadow-xs">
                  <Lock size={13} /> Mettre à jour l'accès
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>

    </div>
  );
}