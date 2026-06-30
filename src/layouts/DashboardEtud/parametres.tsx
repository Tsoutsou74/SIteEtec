import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  User, Mail, Phone, MapPin, Calendar, GraduationCap,
  Camera, Lock, Eye, EyeOff, Save, Bell, Globe,
  Shield, CheckCircle, X,
} from 'lucide-react';

type Tab = 'profil' | 'securite' | 'preferences';

export default function ParametresEtudiant() {
  const { darkMode } = useTheme();
  const [tab, setTab] = useState<Tab>('profil');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    nom: 'RAKOTO',
    prenom: 'Andry',
    email: 'andry.rakoto@etec.mg',
    telephone: '+261 34 12 345 67',
    adresse: 'Lot II A 45, Faravohitra, Fianarantsoa',
    dateNaissance: '2003-05-14',
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });

  const [prefs, setPrefs] = useState({
    notifEmail: true,
    notifSMS: false,
    notifNotes: true,
    notifEDT: true,
    langue: 'fr',
  });

  const inputStyle = {
    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profil sauvegardé :', profile);
    showSavedToast();
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.next !== pwdForm.confirm) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    console.log('Mot de passe changé');
    setPwdForm({ current: '', next: '', confirm: '' });
    showSavedToast();
  };

  const handleSavePrefs = () => {
    console.log('Préférences sauvegardées :', prefs);
    showSavedToast();
  };

  const showSavedToast = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className="relative w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer shrink-0"
      style={{ backgroundColor: checked ? 'var(--primary)' : darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }}
    >
      <span
        className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 shadow-sm"
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  );

  return (
    <div className="max-w-4xl space-y-5">

      {/* Toast confirmation */}
      {saved && (
        <div
          className="fixed top-20 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white animate-fade-in"
          style={{ backgroundColor: '#22c55e' }}
        >
          <CheckCircle size={15} />
          Modifications enregistrées
        </div>
      )}

      {/* En-tête */}
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight">Mon profil</h1>
        <p className="text-xs opacity-45 mt-1">Gérez vos informations personnelles et vos préférences</p>
      </div>

      {/* Carte profil résumé */}
      <div
        className="rounded-2xl border p-5 md:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center font-black text-2xl md:text-3xl text-white overflow-hidden"
            style={{ backgroundColor: '#3b82f6' }}
          >
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              `${profile.prenom[0]}${profile.nom[0]}`
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 cursor-pointer transition hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--card)' }}
          >
            <Camera size={12} className="text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Infos résumées */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-black tracking-tight">{profile.prenom} {profile.nom}</h2>
          <p className="text-xs opacity-55 mt-0.5">ETU-2024-0042 · L3 Génie Logiciel</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e' }}
            >
              <CheckCircle size={11} /> Compte vérifié
            </span>
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}
            >
              <GraduationCap size={11} /> Année 2026–2027
            </span>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div
        className="flex gap-1 rounded-2xl border p-1 w-full sm:w-fit overflow-x-auto"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      >
        {([
          { key: 'profil' as Tab,      label: 'Informations',  icon: <User size={14} /> },
          { key: 'securite' as Tab,    label: 'Sécurité',      icon: <Shield size={14} /> },
          { key: 'preferences' as Tab, label: 'Préférences',   icon: <Bell size={14} /> },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap"
            style={{
              backgroundColor: tab === t.key ? 'var(--primary)' : 'transparent',
              color: tab === t.key ? 'white' : 'var(--text)',
              opacity: tab === t.key ? 1 : 0.6,
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ONGLET INFORMATIONS ── */}
      {tab === 'profil' && (
        <form
          onSubmit={handleSaveProfile}
          className="rounded-2xl border p-5 md:p-6 space-y-4"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <h3 className="text-sm font-black tracking-tight mb-1">Informations personnelles</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                <User size={10} /> Nom
              </label>
              <input
                type="text" name="nom" value={profile.nom} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
                style={inputStyle}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                <User size={10} /> Prénom
              </label>
              <input
                type="text" name="prenom" value={profile.prenom} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                <Mail size={10} /> Email
              </label>
              <input
                type="email" name="email" value={profile.email} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
                style={inputStyle}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                <Phone size={10} /> Téléphone
              </label>
              <input
                type="tel" name="telephone" value={profile.telephone} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
              <MapPin size={10} /> Adresse
            </label>
            <input
              type="text" name="adresse" value={profile.adresse} onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                <Calendar size={10} /> Date de naissance
              </label>
              <input
                type="date" name="dateNaissance" value={profile.dateNaissance} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
                style={inputStyle}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                <GraduationCap size={10} /> Filière
              </label>
              <input
                type="text" disabled value="Génie Logiciel et Administration Réseaux"
                className="w-full px-3 py-2.5 rounded-xl text-xs border opacity-60 cursor-not-allowed"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Save size={13} /> Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* ── ONGLET SÉCURITÉ ── */}
      {tab === 'securite' && (
        <form
          onSubmit={handleSavePassword}
          className="rounded-2xl border p-5 md:p-6 space-y-4"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <h3 className="text-sm font-black tracking-tight mb-1">Changer le mot de passe</h3>
          <p className="text-xs opacity-50 mb-4">Utilisez un mot de passe fort que vous n'utilisez nulle part ailleurs.</p>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
              <Lock size={10} /> Mot de passe actuel
            </label>
            <input
              type="password" name="current" required
              value={pwdForm.current} onChange={handlePwdChange}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                <Lock size={10} /> Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} name="next" required
                  value={pwdForm.next} onChange={handlePwdChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none transition-colors"
                  style={inputStyle}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 cursor-pointer transition">
                  {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                <Lock size={10} /> Confirmer
              </label>
              <div className="relative">
                <input
                  type={showPwd2 ? 'text' : 'password'} name="confirm" required
                  value={pwdForm.confirm} onChange={handlePwdChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none transition-colors"
                  style={inputStyle}
                />
                <button type="button" onClick={() => setShowPwd2(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 cursor-pointer transition">
                  {showPwd2 ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Save size={13} /> Mettre à jour
            </button>
          </div>
        </form>
      )}

      {/* ── ONGLET PRÉFÉRENCES ── */}
      {tab === 'preferences' && (
        <div
          className="rounded-2xl border p-5 md:p-6 space-y-5"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div>
            <h3 className="text-sm font-black tracking-tight mb-1">Notifications</h3>
            <p className="text-xs opacity-50 mb-4">Choisissez comment vous souhaitez être informé.</p>

            <div className="space-y-3">
              {[
                { key: 'notifEmail' as const, label: 'Notifications par email',     desc: 'Recevoir les mises à jour importantes par email' },
                { key: 'notifSMS'   as const, label: 'Notifications par SMS',       desc: 'Recevoir les rappels urgents par SMS' },
                { key: 'notifNotes' as const, label: 'Nouvelles notes publiées',     desc: 'Être alerté dès qu\'une note est publiée' },
                { key: 'notifEDT'   as const, label: 'Changements d\'emploi du temps', desc: 'Être alerté en cas de modification de l\'EDT' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-2">
                  <div>
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-[10px] opacity-50 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle
                    checked={prefs[item.key]}
                    onChange={() => setPrefs({ ...prefs, [item.key]: !prefs[item.key] })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-5" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-black tracking-tight mb-1 flex items-center gap-1.5">
              <Globe size={14} /> Langue
            </h3>
            <p className="text-xs opacity-50 mb-3">Langue d'affichage de votre espace étudiant.</p>
            <div className="grid grid-cols-3 gap-2 max-w-sm">
              {[
                { code: 'fr', label: 'Français', flag: '🇫🇷' },
                { code: 'en', label: 'English',  flag: '🇬🇧' },
                { code: 'mg', label: 'Malagasy', flag: '🇲🇬' },
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => setPrefs({ ...prefs, langue: l.code })}
                  className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer"
                  style={{
                    borderColor: prefs.langue === l.code ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: prefs.langue === l.code ? 'rgba(34,197,94,0.08)' : 'transparent',
                    color: prefs.langue === l.code ? 'var(--primary)' : 'var(--text)',
                  }}
                >
                  <span className="text-base">{l.flag}</span>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={handleSavePrefs}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90 cursor-pointer mt-4"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Save size={13} /> Enregistrer les préférences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}