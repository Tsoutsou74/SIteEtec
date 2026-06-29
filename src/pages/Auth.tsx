import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center w-full px-10 py-10 pt-30">

      <div className="grid w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 lg:grid-cols-2">

        {/* ================================= */}
        {/* PANNEAU GAUCHE */}
        {/* ================================= */}
        {/* On réduit le padding (px-6 py-8) et la taille du texte pour que ça rentre parfaitement */}
        <div className="hidden lg:flex flex-col justify-center px-6 py-8 text-white relative bg-green-950/50">
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/30">
              <GraduationCap size={28} className="text-green-400" />
            </div>

            <h1 className="text-2xl font-black leading-tight text-[var(--text)]">
              Bienvenue à
              <span className="block text-green-400">
                E-TEC University
              </span>
            </h1>

            <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              Accédez à votre espace numérique pour vos cours, notes et informations.
            </p>

            <div className="mt-5 space-y-2 text-[var(--text)] text-xs">
              <Feature text="Accès sécurisé 24h/24" />
              <Feature text="Consultation des notes" />
              <Feature text="Emploi du temps" />
              <Feature text="Gestion des inscriptions" />
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* PANNEAU DROITE (Formulaire) */}
        {/* ================================= */}
        <div className="bg-Card px-6 py-8 flex flex-col justify-center">

          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center shadow-xl">
              <GraduationCap className="text-white" size={28} />
            </div>
          </div>

          <h2 className="text-center text-2xl font-black text-[var(--text)]">
            {isLogin ? "Connexion" : "Créer un compte"}
          </h2>

          <p className="mt-1 text-center text-xs text-[var(--text-secondary)]">
            {isLogin ? "Espace étudiant personnalisé." : "Inscrivez-vous rapidement."}
          </p>

          {/* Onglets */}
          <div className="mt-5 flex rounded-full bg-[var(--bg-secondary)] p-1 border border-[var(--border)] text-xs">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-full py-2 font-semibold transition ${
                isLogin ? "bg-green-600 text-white shadow-lg" : "text-[var(--text-secondary)]"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-full py-2 font-semibold transition ${
                !isLogin ? "bg-green-600 text-white shadow-lg" : "text-[var(--text-secondary)]"
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Zone des formulaires */}
          <div className="mt-5 min-h-[180px] flex items-center justify-center border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)]">
             <p className="text-xs text-[var(--text-secondary)]">Champs du formulaire</p>
          </div>

        </div>

      </div>
    </div>
  );
}

interface FeatureProps {
  text: string;
}

function Feature({ text }: FeatureProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-2 h-2 rounded-full bg-green-400" />
      <span>{text}</span>
    </div>
  );
}