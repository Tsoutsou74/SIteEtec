import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import  ApiService, {TokenStorage} from "../services/api";

type Role = "etudiant" | "enseignant";
type StudentFormationType = "initiale" | "continue" | "enligne";

const STUDENT_FORMATION_STORAGE_KEY = "etec_student_formation_type";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [role, setRole] = useState<Role>("etudiant");
  const [formationType, setFormationType] = useState<StudentFormationType>("enligne");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (isLogin) {
        const auth = await ApiService.auth.login({
          email: form.email,
          password: form.password,
        });

        TokenStorage.setTokens(auth.token);
        localStorage.setItem("token", auth.token);
        localStorage.setItem("etec_user_id", String(auth.userId ?? ""));
        localStorage.setItem("userId", String(auth.userId ?? ""));
        localStorage.setItem("etec_user_role", String(auth.role ?? ""));
        localStorage.setItem("role", String(auth.role ?? ""));

        const normalizedRole = String(auth.role || role).toLowerCase();
        if (normalizedRole.includes("etudiant")) {
          localStorage.setItem(STUDENT_FORMATION_STORAGE_KEY, formationType);
        }

        if (normalizedRole.includes("enseign")) {
          navigate("/enseignants");
        } else if (normalizedRole.includes("admin")) {
          navigate("/admin");
        } else {
          navigate("/etudiants");
        }
        return;
      }

      await ApiService.auth.register({
        role: role.toUpperCase(),
        username: form.nom,
        prenom: form.prenom,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      });
      if (role === "etudiant") {
        localStorage.setItem(STUDENT_FORMATION_STORAGE_KEY, formationType);
      }
      setIsLogin(true);
    } catch (error) {
      const message =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Impossible de traiter la demande.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
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
            {errorMessage && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500">
                {errorMessage}
              </p>
            )}

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
                  <User size={10} /> Adresse e-mail
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
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
              disabled={loading}
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
