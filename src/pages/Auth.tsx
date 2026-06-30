import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  BookOpen,
  ArrowRight,
} from "lucide-react";

type Role = "etudiant" | "enseignant";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [role, setRole] = useState<Role>("etudiant");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ role, isLogin, ...form });
  };

  const inputStyle = {
    backgroundColor: "var(--bg-secondary)",
    borderColor: "var(--border)",
    color: "var(--text)",
  };

  return (
    <div className="flex items-center justify-center w-full px-10 py-10 pt-30">

      <div className="grid w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 lg:grid-cols-2">

        {/* ================================= */}
        {/* PANNEAU GAUCHE */}
        {/* ================================= */}
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

          {/* Onglets Connexion / Inscription */}
          <div className="mt-5 flex rounded-full bg-[var(--bg-secondary)] p-1 border border-[var(--border)] text-xs">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-full py-2 font-semibold transition cursor-pointer ${
                isLogin ? "bg-green-600 text-white shadow-lg" : "text-[var(--text-secondary)]"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-full py-2 font-semibold transition cursor-pointer ${
                !isLogin ? "bg-green-600 text-white shadow-lg" : "text-[var(--text-secondary)]"
              }`}
            >
              Inscription
            </button>
          </div>

          {/* ── Sélecteur de rôle ── */}
          <div
            className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border p-1"
            style={{ borderColor: "var(--border)" }}
          >
            {([
              { key: "etudiant" as Role,   label: "Étudiant",   icon: <GraduationCap size={14} /> },
              { key: "enseignant" as Role, label: "Enseignant", icon: <BookOpen size={14} /> },
            ]).map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer"
                style={{
                  backgroundColor: role === r.key ? "rgba(34,197,94,0.12)" : "transparent",
                  color: role === r.key ? "#22c55e" : "var(--text-secondary)",
                  border: role === r.key ? "1px solid rgba(34,197,94,0.35)" : "1px solid transparent",
                }}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>

          {/* ── Formulaire ── */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">

            {/* Nom + Prénom — uniquement en mode Inscription */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                    <User size={10} /> Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="RAKOTO"
                    className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                    <User size={10} /> Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={form.prenom}
                    onChange={handleChange}
                    placeholder="Andry"
                    className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Nom (champ principal pour la connexion) */}
            {isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                  <User size={10} /> Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="nom"
                  required
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Ex: RAKOTO Andry"
                  className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
                  style={inputStyle}
                />
              </div>
            )}

            {/* Email — inscription uniquement */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                  <Mail size={10} /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder={role === "etudiant" ? "prenom.nom@etec.mg" : "prof.nom@etec.mg"}
                  className="w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none transition-colors"
                  style={inputStyle}
                />
              </div>
            )}

            {/* Mot de passe */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                <Lock size={10} /> Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none transition-colors"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 cursor-pointer transition"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* Confirmer mot de passe — inscription uniquement */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                  <Lock size={10} /> Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    name="confirm"
                    required
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none transition-colors"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 cursor-pointer transition"
                  >
                    {showPassword2 ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
            )}

            {/* Mot de passe oublié — connexion uniquement */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[10px] font-bold text-green-500 hover:opacity-80 transition cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* Bouton Se connecter / Créer un compte */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-green-600 transition-all hover:bg-green-700 cursor-pointer mt-1"
            >
              {isLogin ? "Se connecter" : "Créer mon compte"}
              <ArrowRight size={13} />
            </button>
          </form>

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