import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ClipboardCheck, User, Mail, Phone, BookOpen, Send, CheckCircle } from 'lucide-react';

export default function AdmissionPage() {
  const { darkMode } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    filiere: 'Administration et Gestion'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const ETAPES = [
    { num: "01", title: "Candidature en ligne",    desc: "Remplissez le formulaire de pré-inscription avec vos informations personnelles." },
    { num: "02", title: "Étude de dossier",        desc: "Notre équipe pédagogique examine vos relevés de notes et votre parcours." },
    { num: "03", title: "Entretien de motivation", desc: "Un échange pour comprendre vos ambitions et valider votre orientation." },
    { num: "04", title: "Inscription finale",      desc: "Validation de votre place après dépôt des pièces physiques et écolage." }
  ];

  const inputStyle = {
    backgroundColor: 'var(--bg)',
    borderColor: 'var(--border)',
    color: 'var(--text)'
  };

  return (
    <div className="w-full px-0 sm:px-4 md:px-8 lg:px-12 py-10 md:py-16 animate-fade-in">

      {/* En-tête */}
      <div className="max-w-2xl mb-10 md:mb-16 space-y-3 md:space-y-4 px-1">
        <span
          className="text-xs font-bold tracking-widest uppercase flex items-center gap-2"
          style={{ color: 'var(--primary)' }}
        >
          <ClipboardCheck size={14} /> Inscriptions ouvertes
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Rejoignez <span className="text-gradient">E-TEC University</span>
        </h1>
        <p className="text-sm opacity-70 leading-relaxed">
          Prenez en main votre avenir professionnel. Remplissez votre demande d'admission en quelques clics pour nos campus de Faravohitra.
        </p>
      </div>

      {/* Grille principale
          - mobile  : colonne unique (processus puis formulaire)
          - lg      : côte à côte (5 + 7 colonnes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">

        {/* GAUCHE : Processus d'admission */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8">
          <h2 className="text-lg md:text-xl font-black tracking-tight">Le processus d'admission</h2>

          <div className="space-y-5 md:space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-400/20">
            {ETAPES.map((etape, idx) => (
              <div key={idx} className="flex gap-3 md:gap-4 relative">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 z-10"
                  style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                >
                  {etape.num}
                </div>
                <div className="space-y-1 pt-0.5">
                  <h3 className="text-sm font-bold tracking-tight">{etape.title}</h3>
                  <p className="text-xs opacity-70 leading-relaxed">{etape.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DROITE : Formulaire */}
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
                <h3 className="text-xl md:text-2xl font-black tracking-tight">Demande reçue !</h3>
                <p className="text-xs opacity-75 max-w-sm mx-auto leading-relaxed">
                  Merci {formData.prenom}, votre pré-inscription a bien été enregistrée. Notre service de scolarité vous contactera par email sous 48 heures.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold uppercase tracking-wider underline cursor-pointer hover:opacity-80"
                >
                  Faire une nouvelle demande
                </button>
              </div>
            ) : (
              /* Formulaire */
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <h2 className="text-lg md:text-xl font-black tracking-tight mb-1">
                    Formulaire de pré-inscription
                  </h2>
                  <p className="text-xs opacity-60">
                    Tous les champs sont obligatoires pour l'étude de votre dossier initial.
                  </p>
                </div>

                {/* Nom + Prénom — côte à côte dès sm */}
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

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                    <Mail size={10} /> Adresse Email
                  </label>
                  <input
                    type="email" required name="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="exemple@gmail.com"
                    className="w-full p-3 rounded-xl text-xs focus:outline-none border transition-colors"
                    style={inputStyle}
                  />
                </div>

                {/* Téléphone + Filière — côte à côte sur md+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                      <Phone size={10} /> Téléphone
                    </label>
                    <input
                      type="tel" required name="telephone"
                      value={formData.telephone} onChange={handleChange}
                      placeholder="+261 34 00 000 00"
                      className="w-full p-3 rounded-xl text-xs focus:outline-none border transition-colors"
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                      <BookOpen size={10} /> Filière souhaitée
                    </label>
                    <select
                      name="filiere" value={formData.filiere} onChange={handleChange}
                      className="w-full p-3 rounded-xl text-xs focus:outline-none border transition-colors cursor-pointer appearance-none"
                      style={inputStyle}
                    >
                      <option value="Administration et Gestion">Administration et Gestion</option>
                      <option value="Génie Logiciel et Administration Réseaux">Génie Logiciel et Administration Réseaux</option>
                      <option value="Bâtiment et Travaux Publics">Bâtiment et Travaux Publics</option>
                      <option value="Électromécanique et Industriels">Électromécanique et Industriels</option>
                    </select>
                  </div>
                </div>

                {/* Bouton envoi */}
                <button
                  type="submit"
                  className="w-full text-white font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition hover:opacity-95 cursor-pointer"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Envoyer ma candidature <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}