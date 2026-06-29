import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mail, User, Phone, MapPin, Share2, Info, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const { darkMode } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputStyle = {
    backgroundColor: 'var(--bg)',
    borderColor: 'var(--border)',
    color: 'var(--text)'
  };

  const cardStyle = {
    borderColor: 'var(--border)'
  };

  return (
    <div className="w-full px-0 sm:px-4 md:px-8 lg:px-12 py-10 md:py-16 animate-fade-in">

      {/* En-tête */}
      <div className="max-w-2xl mb-10 md:mb-16 space-y-3 md:space-y-4 px-1">
        <span
          className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
          style={{ color: 'var(--primary)' }}
        >
          <Info size={14} /> Une équipe à votre écoute
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Nous <span className="text-gradient">contacter</span>
        </h1>
        <p className="text-sm opacity-70 leading-relaxed">
          Une question sur les formations, les modalités ou nos campus ? Laissez-nous un message et notre équipe vous répondra dans les plus brefs délais.
        </p>
      </div>

      {/* Grille principale
          - mobile  : colonne unique
          - lg      : 5 col infos + 7 col formulaire */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">

        {/* GAUCHE : Infos + carte */}
        <div className="lg:col-span-5 space-y-5 md:space-y-6">
          <h2 className="text-lg md:text-xl font-black tracking-tight">Nos coordonnées</h2>

          {/* Google Maps — Faravohitra, Fianarantsoa */}
          <div
            className="w-full h-52 sm:h-60 md:h-64 rounded-2xl overflow-hidden border shadow-sm"
            style={cardStyle}
          >
            <iframe
              title="E-TEC University — Faravohitra"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.1234567890!2d47.08500!3d-21.45300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1fa3ab1234567890%3A0xabcdef1234567890!2sFaravohitra%2C%20Fianarantsoa%2C%20Madagascar!5e0!3m2!1sfr!2smg!4v1687212345678!5m2!1sfr!2smg"
              className={`w-full h-full border-0 opacity-90 ${darkMode ? 'invert-[0.9] hue-rotate-180' : ''}`}
              allowFullScreen={false}
              loading="lazy"
            />
          </div>

          {/* Grille bento infos de contact
              - mobile : 2 colonnes
              - tous les écrans : 2 colonnes (les cartes sont compactes) */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">

            {/* Location */}
            <div className="space-y-1.5 p-3 md:p-4 rounded-xl border" style={cardStyle}>
              <div
                className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--primary)' }}
              >
                <MapPin size={12} /> Location
              </div>
              <p className="text-xs font-bold leading-snug">Faravohitra, Fianarantsoa</p>
              <p className="text-[10px] opacity-60">Lun–Ven : 09h00 – 18h00</p>
            </div>

            {/* Téléphone */}
            <div className="space-y-1.5 p-3 md:p-4 rounded-xl border" style={cardStyle}>
              <div
                className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--primary)' }}
              >
                <Phone size={12} /> Téléphone
              </div>
              <p className="text-xs font-bold tracking-wide">+261 34 36 678</p>
              <p className="text-[10px] opacity-60">Format international</p>
            </div>

            {/* Email */}
            <div className="space-y-1.5 p-3 md:p-4 rounded-xl border" style={cardStyle}>
              <div
                className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--primary)' }}
              >
                <Mail size={12} /> Email
              </div>
              <p className="text-xs font-medium break-all">contact@etec.mg</p>
              <p className="text-xs font-medium break-all opacity-60">info@etec.mg</p>
            </div>

            {/* Réseaux sociaux */}
            <div className="space-y-1.5 p-3 md:p-4 rounded-xl border" style={cardStyle}>
              <div
                className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--primary)' }}
              >
                <Share2 size={12} /> Réseaux
              </div>
              <div className="flex flex-col gap-1 text-xs font-medium">
                <a href="#" className="text-blue-500 hover:underline flex items-center gap-1">📘 Facebook</a>
                <a href="#" className="text-red-500 hover:underline flex items-center gap-1">🔴 YouTube</a>
              </div>
            </div>

          </div>
        </div>

        {/* DROITE : Formulaire de contact */}
        <div className="lg:col-span-7">
          <div
            className="p-5 md:p-8 rounded-3xl border shadow-lg backdrop-blur-md transition-all duration-300"
            style={{
              backgroundColor: darkMode ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.45)",
              borderColor: 'var(--border)',
              color: 'var(--text)'
            }}
          >
            {submitted ? (
              /* Succès */
              <div className="text-center py-10 md:py-12 space-y-4 animate-scale-up">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight">Message envoyé !</h3>
                <p className="text-xs opacity-75 max-w-sm mx-auto leading-relaxed">
                  Merci {formData.prenom}, votre message a bien été transmis. Notre équipe vous recontactera très rapidement.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold uppercase tracking-wider underline cursor-pointer hover:opacity-80"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              /* Formulaire */
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <h2 className="text-lg md:text-xl font-black tracking-tight mb-1">
                    Formulaire de contact
                  </h2>
                  <p className="text-xs opacity-60">
                    Tous les champs sont obligatoires pour le traitement rapide de votre message.
                  </p>
                </div>

                {/* Nom + Prénom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                      <User size={10} /> Nom
                    </label>
                    <input
                      type="text" required name="nom"
                      value={formData.nom} onChange={handleChange}
                      placeholder="Ex: RAKOTO"
                      className="w-full p-3 rounded-xl text-xs focus:outline-none border transition-colors"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                      <User size={10} /> Prénom
                    </label>
                    <input
                      type="text" required name="prenom"
                      value={formData.prenom} onChange={handleChange}
                      placeholder="Ex: Andry"
                      className="w-full p-3 rounded-xl text-xs focus:outline-none border transition-colors"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Email + Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                      <Mail size={10} /> Email
                    </label>
                    <input
                      type="email" required name="email"
                      value={formData.email} onChange={handleChange}
                      placeholder="exemple@gmail.com"
                      className="w-full p-3 rounded-xl text-xs focus:outline-none border transition-colors"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                      <Phone size={10} /> Téléphone
                    </label>
                    <input
                      type="text" required name="telephone"
                      value={formData.telephone} onChange={handleChange}
                      placeholder="+261 34 ..."
                      className="w-full p-3 rounded-xl text-xs focus:outline-none border transition-colors"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Sujet */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                    <Mail size={10} /> Sujet
                  </label>
                  <input
                    type="text" required name="sujet"
                    value={formData.sujet} onChange={handleChange}
                    placeholder="Ex: Renseignements sur les admissions"
                    className="w-full p-3 rounded-xl text-xs focus:outline-none border transition-colors"
                    style={inputStyle}
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                    <Mail size={10} /> Message
                  </label>
                  <textarea
                    required name="message" rows={4}
                    value={formData.message} onChange={handleChange}
                    placeholder="Votre message..."
                    className="w-full p-3 rounded-xl text-xs focus:outline-none border transition-colors resize-none"
                    style={inputStyle}
                  />
                </div>

                {/* Bouton envoi */}
                <button
                  type="submit"
                  className="w-full text-white font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition hover:opacity-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Envoyer le message <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}