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
    <div className="flex justify-center px-6 py-9 pt-30">

      <div className="grid w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-white/5">

        {/* ================================= */}
        {/* PANNEAU DROITE (Formulaire) */}
        {/* ================================= */}
        <div className="bg-Card px-2 py-3 flex flex-col justify-center">

          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center shadow-xl">
              <GraduationCap className="text-white" size={28} />
            </div>
          </div>

          <h2 className="text-center text-2xl font-black text-[var(--text)]">
            {isLogin ? "Connexion" : "Créer un compte"}
          </h2>


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
                  placeholder="Votre Nom"
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
                  placeholder="Votre Mots Passe"
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

            {/* Bouton Se connecter / Créer un compte */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-green-600 transition-all hover:bg-green-700 cursor-pointer mt-1"
            >
              {isLogin ? "Se connecter" : "Créer mon compte"}
                <ArrowRight size={13} />
              </button><hr></hr>
              {/* Inscriptions */}
              {isLogin && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="text-[13px] font-bold text-green-500 hover:opacity-80 transition cursor-pointer"
                  >
                    Mots de Passe Oublier
                  </button>
                </div>
              )}

              {/* Inscriptions */}
              {isLogin && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="text-[13px] font-bold text-green-500 hover:opacity-80 transition cursor-pointer"
                  >
                    Inscriptions
                  </button>
                </div>
              )}

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