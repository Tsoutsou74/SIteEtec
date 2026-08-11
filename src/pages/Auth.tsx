import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, Lock, Mail, User, Eye, EyeOff,
  ArrowRight, Shield, ChevronRight, Users, Compass,
  BookOpen, Wifi, Award, TrendingUp,
} from "lucide-react";
import ApiService, { TokenStorage } from "../services/api";

type Role = "etudiant" | "enseignant";
type StudentFormationType = "initiale" | "continue" | "enligne";
const STUDENT_FORMATION_STORAGE_KEY = "etec_student_formation_type";
const API_ENABLED = import.meta.env.VITE_ENABLE_API === "true";

/* ── Animated floating particles component ── */
function Particles() {
  return (
    <div className="a-particles" aria-hidden>
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="a-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 14}s`,
            animationDelay: `${Math.random() * 10}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            opacity: 0.15 + Math.random() * 0.35,
          }}
        />
      ))}
    </div>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [role, setRole] = useState<Role>("etudiant");
  const [formationType, setFormationType] = useState<StudentFormationType>("enligne");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "", confirm: "" });

  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      // Mode autonome : l'interface reste utilisable sans backend démarré.
      if (!API_ENABLED) {
        const offlineRole = isLogin
          ? (localStorage.getItem("etec_user_role") || role).toLowerCase()
          : role;
        const offlineToken = "offline-session";
        TokenStorage.setTokens(offlineToken);
        localStorage.setItem("token", offlineToken);
        localStorage.setItem("etec_user_id", "offline-user");
        localStorage.setItem("userId", "offline-user");
        localStorage.setItem("etec_user_role", offlineRole);
        localStorage.setItem("role", offlineRole);
        if (offlineRole.includes("etudiant")) {
          localStorage.setItem(STUDENT_FORMATION_STORAGE_KEY, formationType);
        }
        if (!isLogin) {
          setIsLogin(true);
          setErrorMessage("Compte local créé. Vous pouvez vous connecter.");
        } else if (offlineRole.includes("enseign")) {
          navigate("/enseignants");
        } else if (offlineRole.includes("admin")) {
          navigate("/admin");
        } else {
          navigate("/etudiants");
        }
        return;
      }

      if (isLogin) {
        const auth = await ApiService.auth.login({ email: form.email, password: form.password });
        TokenStorage.setTokens(auth.token);
        localStorage.setItem("token", auth.token);
        localStorage.setItem("etec_user_id", String(auth.userId ?? ""));
        localStorage.setItem("userId", String(auth.userId ?? ""));
        localStorage.setItem("etec_user_role", String(auth.role ?? ""));
        localStorage.setItem("role", String(auth.role ?? ""));
        const nr = String(auth.role || role).toLowerCase();
        if (nr.includes("etudiant")) localStorage.setItem(STUDENT_FORMATION_STORAGE_KEY, formationType);
        if (nr.includes("enseign")) navigate("/enseignants");
        else if (nr.includes("admin")) navigate("/admin");
        else navigate("/etudiants");
        return;
      }
      await ApiService.auth.register({
        role: role.toUpperCase(), username: form.nom, prenom: form.prenom,
        email: form.email, password: form.password, password_confirmation: form.confirm,
      });
      if (role === "etudiant") localStorage.setItem(STUDENT_FORMATION_STORAGE_KEY, formationType);
      setIsLogin(true);
    } catch (error) {
      setErrorMessage(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Impossible de traiter la demande.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <BookOpen size={15} />, label: "120+ formations disponibles" },
    { icon: <Wifi size={15} />, label: "Apprentissage 100% en ligne" },
    { icon: <Award size={15} />, label: "Certifications reconnues" },
    { icon: <TrendingUp size={15} />, label: "99.2% de taux de réussite" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ─── ROOT ─── */
        .a-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: #020804;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ─── DEEP BACKGROUND ─── */
        .a-bg {
          position: absolute; inset: 0; pointer-events: none; overflow: hidden;
        }
        .a-bg-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.6;
        }
        .a-bg-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 50%, transparent 40%, #010503 100%);
        }
        .a-bg-glow1 {
          position: absolute;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
          top: -250px; left: -200px;
          animation: driftA 18s ease-in-out infinite alternate;
        }
        .a-bg-glow2 {
          position: absolute;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%);
          bottom: -150px; right: -100px;
          animation: driftB 22s ease-in-out infinite alternate;
        }
        .a-bg-glow3 {
          position: absolute;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          top: 50%; left: 55%;
          animation: driftC 14s ease-in-out infinite alternate;
        }
        @keyframes driftA {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes driftB {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(-40px, -60px) scale(1.1); }
        }
        @keyframes driftC {
          from { transform: translate(0, 0); }
          to { transform: translate(-30px, 50px); }
        }

        /* ─── PARTICLES ─── */
        .a-particles { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .a-particle {
          position: absolute;
          bottom: -10px;
          border-radius: 50%;
          background: #10b981;
          animation: floatUp linear infinite;
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
        }

        /* ─── GRID ─── */
        .a-bg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(16,185,129,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.035) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
        }

        /* ─── CARD WRAPPER ─── */
        .a-wrap {
          position: relative; z-index: 10;
          width: 100%; max-width: 1080px;
          animation: riseIn 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Hover tilt wrapper */
        .a-tilt { transform-style: preserve-3d; transition: transform 0.08s linear; }

        /* ─── MAIN CARD ─── */
        .a-card {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(16,185,129,0.18);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04),
            0 40px 100px rgba(0,0,0,0.75),
            0 0 80px rgba(16,185,129,0.07);
          position: relative;
        }

        /* Holographic shimmer border */
        .a-card::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 28px;
          padding: 1px;
          background: linear-gradient(135deg,
            rgba(16,185,129,0.4) 0%,
            rgba(255,255,255,0.05) 30%,
            rgba(245,158,11,0.25) 60%,
            rgba(16,185,129,0.3) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          pointer-events: none; z-index: 1;
          animation: shimmerBorder 6s linear infinite;
          background-size: 300% 300%;
        }
        @keyframes shimmerBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Spotlight */
        .a-spotlight {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          border-radius: 28px; overflow: hidden;
          opacity: 0; transition: opacity 0.6s ease;
        }
        .a-wrap:hover .a-spotlight { opacity: 1; }

        @media (max-width: 860px) {
          .a-card { grid-template-columns: 1fr; }
          .a-left  { display: none; }
        }

        /* ─── LEFT PANEL ─── */
        .a-left {
          position: relative;
          padding: 3.5rem 3rem;
          display: flex; flex-direction: column; justify-content: space-between;
          background: linear-gradient(160deg, #041208 0%, #061b0e 50%, #08240f 100%);
          border-right: 1px solid rgba(16,185,129,0.1);
          overflow: hidden;
        }
        .a-left::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Brand */
        .a-brand { display: flex; align-items: center; gap: 1rem; position: relative; z-index: 1; }
        .a-brand-mark {
          width: 54px; height: 54px;
          border-radius: 17px;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 1px rgba(16,185,129,0.4), 0 8px 30px rgba(16,185,129,0.35), inset 0 2px 3px rgba(255,255,255,0.25);
          position: relative;
        }
        .a-brand-mark::after {
          content: '';
          position: absolute; inset: -4px;
          border-radius: 21px;
          border: 1px solid rgba(16,185,129,0.2);
          animation: ringPulse 3s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        .a-brand-name {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem; font-weight: 900;
          color: #fff; letter-spacing: -0.035em; line-height: 1;
        }
        .a-brand-tag {
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: #10b981; margin-top: 3px;
        }

        /* Hero */
        .a-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 3rem 0; position: relative; z-index: 1; }

        .a-live-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.22);
          border-radius: 100px; padding: 5px 14px;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: #10b981; margin-bottom: 1.5rem; width: fit-content;
        }
        .a-live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: blinkDot 1.6s infinite alternate;
        }
        @keyframes blinkDot {
          from { opacity: 0.5; box-shadow: 0 0 4px #10b981; }
          to   { opacity: 1;   box-shadow: 0 0 12px #10b981, 0 0 24px rgba(16,185,129,0.4); }
        }

        .a-headline {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 900; line-height: 1.08; color: #fff; letter-spacing: -0.04em;
        }
        .a-headline em {
          font-style: normal;
          background: linear-gradient(100deg, #10b981 0%, #34d399 40%, #f59e0b 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .a-desc {
          font-size: 0.9rem; line-height: 1.65;
          color: rgba(255,255,255,0.42); margin-top: 1.1rem; max-width: 340px;
        }

        /* Feature list */
        .a-features { margin-top: 2.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .a-feature {
          display: flex; align-items: center; gap: 0.875rem;
          font-size: 0.8rem; color: rgba(255,255,255,0.55);
          transition: color 0.3s;
        }
        .a-feature:hover { color: rgba(255,255,255,0.85); }
        .a-feature-icon {
          width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
          background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.18);
          display: flex; align-items: center; justify-content: center; color: #10b981;
          transition: all 0.3s;
        }
        .a-feature:hover .a-feature-icon {
          background: rgba(16,185,129,0.15); box-shadow: 0 0 12px rgba(16,185,129,0.2);
        }

        .a-left-foot {
          font-size: 0.62rem; color: rgba(255,255,255,0.18);
          letter-spacing: 0.05em; position: relative; z-index: 1;
        }

        /* ─── RIGHT PANEL ─── */
        .a-right {
          background: rgba(3, 8, 5, 0.98);
          padding: 3.5rem 3rem;
          display: flex; flex-direction: column; justify-content: center;
          position: relative;
        }

        /* Tab switcher */
        .a-tabs {
          display: grid; grid-template-columns: 1fr 1fr;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 5px;
          margin-bottom: 2rem;
        }
        .a-tab {
          background: transparent; border: none; padding: 0.7rem;
          color: rgba(255,255,255,0.35); font-family: 'Outfit', sans-serif;
          font-weight: 700; font-size: 0.85rem; cursor: pointer;
          border-radius: 10px; letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .a-tab.on {
          color: #fff;
          background: linear-gradient(135deg, rgba(16,185,129,0.22), rgba(16,185,129,0.06));
          border: 1px solid rgba(16,185,129,0.35);
          box-shadow: 0 4px 16px rgba(16,185,129,0.18), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        /* Heading */
        .a-form-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: -0.025em;
        }
        .a-form-sub {
          font-size: 0.78rem; color: rgba(255,255,255,0.3); margin: 0.3rem 0 1.5rem;
        }

        /* Role pills */
        .a-roles { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; margin-bottom: 1.25rem; }
        .a-role {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 13px; padding: 0.8rem 0.5rem;
          color: rgba(255,255,255,0.38); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.82rem;
          transition: all 0.25s ease;
        }
        .a-role.on {
          border-color: rgba(16,185,129,0.45);
          background: rgba(16,185,129,0.09);
          color: #10b981;
          box-shadow: inset 0 0 12px rgba(16,185,129,0.08), 0 0 0 1px rgba(16,185,129,0.15);
        }

        /* Floating-label input group */
        .a-grp { position: relative; margin-bottom: 1.2rem; }
        .a-inp {
          width: 100%; padding: 1.1rem 1rem 1.1rem 2.8rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.875rem;
          outline: none; transition: all 0.3s ease;
        }
        .a-inp::placeholder { color: transparent; }
        .a-inp:focus {
          border-color: rgba(16,185,129,0.65);
          background: rgba(16,185,129,0.045);
          box-shadow: 0 0 0 4px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .a-ico {
          position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.22); pointer-events: none; display: flex;
          transition: color 0.3s;
        }
        .a-inp:focus ~ .a-ico { color: #10b981; }
        .a-lbl {
          position: absolute; left: 2.8rem; top: 50%; transform: translateY(-50%);
          font-size: 0.875rem; color: rgba(255,255,255,0.28); pointer-events: none;
          transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
          white-space: nowrap;
        }
        .a-inp:focus ~ .a-lbl,
        .a-inp:not(:placeholder-shown) ~ .a-lbl {
          top: 0; transform: translateY(-55%) scale(0.74);
          left: 0.875rem; color: #10b981; font-weight: 700;
          background: rgba(3,8,5,0.98); padding: 0 5px; border-radius: 4px;
        }

        /* Select */
        .a-sel {
          width: 100%; padding: 1.1rem 2rem 1.1rem 2.8rem;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.875rem;
          outline: none; appearance: none; cursor: pointer;
          transition: all 0.3s ease;
        }
        .a-sel:focus { border-color: rgba(16,185,129,0.65); background: rgba(16,185,129,0.045); }
        .a-sel option { background: #040c06; color: #fff; }

        /* Eye toggle */
        .a-eye {
          position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(255,255,255,0.28); cursor: pointer;
          display: flex; transition: color 0.3s;
        }
        .a-eye:hover { color: #10b981; }

        /* Error */
        .a-err {
          background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.22);
          color: #fca5a5; padding: 0.875rem 1rem; border-radius: 13px;
          font-size: 0.78rem; font-weight: 500; margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 9px;
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Submit */
        .a-btn {
          width: 100%; padding: 1.1rem 1rem;
          border-radius: 14px; border: none;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff; font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 0.95rem;
          letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 10px 28px rgba(16,185,129,0.32), inset 0 1px 0 rgba(255,255,255,0.18);
          margin-top: 0.5rem; position: relative; overflow: hidden;
        }
        .a-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .a-btn:hover::after { opacity: 1; }
        .a-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 44px rgba(16,185,129,0.5), 0 0 24px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .a-btn:active { transform: translateY(1px); }
        .a-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .a-spin {
          width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer */
        .a-foot {
          display: flex; flex-direction: column; align-items: center; gap: 0.55rem;
          margin-top: 1.75rem; padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .a-foot-txt { font-size: 0.76rem; color: rgba(255,255,255,0.28); }
        .a-foot-lnk {
          color: #10b981; background: none; border: none;
          font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.83rem;
          cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
          transition: all 0.3s; padding: 0;
        }
        .a-foot-lnk:hover { color: #34d399; text-shadow: 0 0 10px rgba(52,211,153,0.3); }

        /* 2-col */
        .a-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }

        /* Theme alignment with the public pages */
        .a-root {
          background: var(--bg);
          color: var(--text);
          padding: 1.5rem 1rem;
        }
        .a-bg-vignette { background: radial-gradient(ellipse at 50% 50%, transparent 45%, color-mix(in srgb, var(--bg) 85%, transparent) 100%); }
        .a-bg-grid { opacity: 0.35; }
        .a-card {
          background: var(--card);
          border-color: var(--border);
          border-radius: 1.5rem;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
        }
        .a-card::before { display: none; }
        .a-spotlight { display: none; }
        .a-left {
          padding: 2.5rem;
          background: linear-gradient(155deg, #064e3b 0%, #0b7a3b 58%, #16a34a 100%);
          border-right: 0;
        }
        .a-brand-name { font-size: 1.75rem; }
        .a-hero { padding: 2rem 0; }
        .a-headline { font-size: clamp(1.8rem, 3.2vw, 2.6rem); }
        .a-desc { color: rgba(255,255,255,0.7); }
        .a-feature { color: rgba(255,255,255,0.72); }
        .a-right { background: var(--card); padding: 2.5rem; }
        .a-tabs { background: color-mix(in srgb, var(--bg) 65%, transparent); border-color: var(--border); margin-bottom: 1.5rem; }
        .a-tab { color: color-mix(in srgb, var(--text) 48%, transparent); }
        .a-tab.on { color: var(--primary); background: color-mix(in srgb, var(--primary) 10%, transparent); border-color: color-mix(in srgb, var(--primary) 35%, transparent); box-shadow: none; }
        .a-form-title { color: var(--text); font-size: 1.35rem; }
        .a-form-sub { color: color-mix(in srgb, var(--text) 52%, transparent); }
        .a-role, .a-inp, .a-sel { background: color-mix(in srgb, var(--bg) 72%, transparent); border-color: var(--border); color: var(--text); }
        .a-role { color: color-mix(in srgb, var(--text) 58%, transparent); }
        .a-role.on { color: var(--primary); background: color-mix(in srgb, var(--primary) 9%, transparent); border-color: color-mix(in srgb, var(--primary) 45%, transparent); box-shadow: none; }
        .a-inp { font-size: 0.8rem; padding-top: 0.95rem; padding-bottom: 0.95rem; }
        .a-inp:focus, .a-sel:focus { border-color: var(--primary); background: color-mix(in srgb, var(--primary) 5%, var(--card)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 13%, transparent); }
        .a-inp:focus ~ .a-ico { color: var(--primary); }
        .a-ico { color: color-mix(in srgb, var(--text) 40%, transparent); }
        .a-lbl { color: color-mix(in srgb, var(--text) 50%, transparent); font-size: 0.8rem; }
        .a-inp:focus ~ .a-lbl, .a-inp:not(:placeholder-shown) ~ .a-lbl { color: var(--primary); background: var(--card); }
        .a-sel option { background: var(--card); color: var(--text); }
        .a-eye { color: color-mix(in srgb, var(--text) 42%, transparent); }
        .a-eye:hover, .a-foot-lnk { color: var(--primary); }
        .a-btn { background: var(--primary); box-shadow: 0 8px 20px color-mix(in srgb, var(--primary) 25%, transparent); font-size: 0.78rem; padding: 0.9rem 1rem; border-radius: 0.75rem; }
        .a-btn:hover { box-shadow: 0 12px 26px color-mix(in srgb, var(--primary) 32%, transparent); }
        .a-foot { border-color: var(--border); margin-top: 1.25rem; padding-top: 1.25rem; }
        .a-foot-txt { color: color-mix(in srgb, var(--text) 52%, transparent); }
        .a-foot-lnk:hover { color: var(--primary); text-shadow: none; }
        .a-live-badge { color: #a7f3d0; }

        @media (max-width: 860px) {
          .a-right { padding: 2rem 1.25rem; }
        }
        @media (max-width: 480px) {
          .a-root { padding: 0; align-items: stretch; }
          .a-wrap { max-width: none; }
          .a-card { min-height: 100vh; border-radius: 0; border-left: 0; border-right: 0; }
          .a-right { padding: 1.5rem 1rem; }
        }
      `}</style>

      <div className="a-root">
        {/* Background layers */}
        <div className="a-bg">
          <div className="a-bg-noise" />
          <div className="a-bg-grid" />
          <div className="a-bg-glow1" />
          <div className="a-bg-glow2" />
          <div className="a-bg-glow3" />
          <div className="a-bg-vignette" />
          <Particles />
        </div>

        <div className="a-wrap">
          {/* Spotlight */}
          <div
            className="a-spotlight"
            style={{
              background: `radial-gradient(700px circle at ${mouse.x}% ${mouse.y}%, rgba(16,185,129,0.1), transparent 50%)`,
            }}
          />

          <div className="a-card a-tilt" ref={cardRef} onMouseMove={handleMouseMove}>

            {/* ── LEFT ── */}
            <div className="a-left">
              <div className="a-brand">
                <div className="a-brand-mark">
                  <GraduationCap color="#fff" size={26} />
                </div>
                <div>
                  <div className="a-brand-name">ETEC</div>
                  <div className="a-brand-tag">Campus Connect</div>
                </div>
              </div>

              <div className="a-hero">
                <div className="a-live-badge">
                  <span className="a-live-dot" />
                  Système opérationnel
                </div>
                <h1 className="a-headline">
                  L'excellence<br />académique,<br /><em>réinventée.</em>
                </h1>
                <p className="a-desc">
                  Accédez à votre parcours éducatif complet depuis un seul espace — sécurisé, intuitif et toujours disponible.
                </p>
                <div className="a-features">
                  {features.map((f, i) => (
                    <div className="a-feature" key={i}>
                      <div className="a-feature-icon">{f.icon}</div>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="a-left-foot">
                © {new Date().getFullYear()} ETEC — Tous droits réservés
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="a-right">
              {/* Tabs */}
              <div className="a-tabs">
                <button className={`a-tab ${isLogin ? "on" : ""}`} type="button"
                  onClick={() => { setIsLogin(true); setErrorMessage(""); }}>
                  Connexion
                </button>
                <button className={`a-tab ${!isLogin ? "on" : ""}`} type="button"
                  onClick={() => { setIsLogin(false); setErrorMessage(""); }}>
                  Inscription
                </button>
              </div>

              <div className="a-form-title">{isLogin ? "Bon retour 👋" : "Créer un compte"}</div>
              <div className="a-form-sub">
                {isLogin ? "Connectez-vous à votre espace académique." : "Rejoignez la communauté ETEC dès aujourd'hui."}
              </div>

              {errorMessage && (
                <div className="a-err"><Shield size={15} />{errorMessage}</div>
              )}

              <form onSubmit={handleSubmit} autoComplete="off">
                {/* Role selector */}
                {!isLogin && (
                  <div className="a-roles">
                    <button type="button" className={`a-role ${role === "etudiant" ? "on" : ""}`}
                      onClick={() => setRole("etudiant")}>
                      <Users size={15} /> Étudiant
                    </button>
                    <button type="button" className={`a-role ${role === "enseignant" ? "on" : ""}`}
                      onClick={() => setRole("enseignant")}>
                      <GraduationCap size={15} /> Enseignant
                    </button>
                  </div>
                )}

                {/* Formation type */}
                {!isLogin && role === "etudiant" && (
                  <div className="a-grp">
                    <select name="formationType" value={formationType}
                      onChange={(e) => setFormationType(e.target.value as StudentFormationType)}
                      className="a-sel">
                      <option value="enligne">Formation en Ligne</option>
                      <option value="initiale">Formation Initiale</option>
                      <option value="continue">Formation Continue</option>
                    </select>
                    <div className="a-ico"><Compass size={17} /></div>
                    <div style={{ position:"absolute", right:"1rem", top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"rgba(255,255,255,0.3)", fontSize:"11px" }}>▼</div>
                  </div>
                )}

                {/* Nom / Prénom */}
                {!isLogin && (
                  <div className="a-2col">
                    <div className="a-grp">
                      <input type="text" name="nom" placeholder=" " required value={form.nom}
                        onChange={handleChange} className="a-inp" id="a-nom" />
                      <span className="a-ico"><User size={16} /></span>
                      <label className="a-lbl" htmlFor="a-nom">Nom</label>
                    </div>
                    <div className="a-grp">
                      <input type="text" name="prenom" placeholder=" " required value={form.prenom}
                        onChange={handleChange} className="a-inp" id="a-prenom" />
                      <span className="a-ico"><User size={16} /></span>
                      <label className="a-lbl" htmlFor="a-prenom">Prénom</label>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="a-grp">
                  <input type="email" name="email" placeholder=" " required value={form.email}
                    onChange={handleChange} className="a-inp" id="a-email" />
                  <span className="a-ico"><Mail size={16} /></span>
                  <label className="a-lbl" htmlFor="a-email">Adresse e-mail</label>
                </div>

                {/* Password */}
                <div className="a-grp">
                  <input type={showPassword ? "text" : "password"} name="password" placeholder=" "
                    required value={form.password} onChange={handleChange} className="a-inp"
                    style={{ paddingRight: "3rem" }} id="a-pwd" />
                  <span className="a-ico"><Lock size={16} /></span>
                  <label className="a-lbl" htmlFor="a-pwd">Mot de passe</label>
                  <button type="button" className="a-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Confirm */}
                {!isLogin && (
                  <div className="a-grp">
                    <input type={showPassword2 ? "text" : "password"} name="confirm" placeholder=" "
                      required value={form.confirm} onChange={handleChange} className="a-inp"
                      style={{ paddingRight: "3rem" }} id="a-confirm" />
                    <span className="a-ico"><Lock size={16} /></span>
                    <label className="a-lbl" htmlFor="a-confirm">Confirmer le mot de passe</label>
                    <button type="button" className="a-eye" onClick={() => setShowPassword2(!showPassword2)}>
                      {showPassword2 ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                )}

                <button type="submit" className="a-btn" disabled={loading} id="a-submit">
                  {loading
                    ? <span className="a-spin" />
                    : <><span>{isLogin ? "Se connecter" : "Créer un compte"}</span><ArrowRight size={18} /></>
                  }
                </button>
              </form>

              <div className="a-foot">
                {isLogin && (
                  <button type="button" className="a-foot-lnk" id="a-forgot">
                    Mot de passe oublié ?
                  </button>
                )}
                <div style={{ display:"flex", gap:"6px", alignItems:"center", flexWrap:"wrap", justifyContent:"center" }}>
                  <span className="a-foot-txt">
                    {isLogin ? "Nouveau sur Campus Connect ?" : "Déjà un compte ?"}
                  </span>
                  <button type="button" className="a-foot-lnk"
                    id={isLogin ? "a-to-register" : "a-to-login"}
                    onClick={() => { setIsLogin(!isLogin); setErrorMessage(""); }}>
                    {isLogin ? "Créer un compte" : "Se connecter"}<ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
