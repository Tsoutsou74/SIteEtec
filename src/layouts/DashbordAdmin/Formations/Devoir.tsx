import { useMemo, useState } from 'react';
import { FileText, Upload, CheckCircle2, Clock3, ArrowRight, Sparkles } from 'lucide-react';

type DevoirItem = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: 'A faire' | 'En cours' | 'Rendu';
  points: number;
};

const devoirs: DevoirItem[] = [
  {
    id: 1,
    title: 'Projet React - Tableau de bord',
    course: 'Développement Web',
    dueDate: '08 juillet 2026',
    status: 'En cours',
    points: 20,
  },
  {
    id: 2,
    title: 'Exercice API REST',
    course: 'Architecture Logicielle',
    dueDate: '10 juillet 2026',
    status: 'A faire',
    points: 15,
  },
  {
    id: 3,
    title: 'Correction du mini-projet',
    course: 'Base de données',
    dueDate: '12 juillet 2026',
    status: 'Rendu',
    points: 25,
  },
];

export default function DevoirPage() {
  const [selectedId, setSelectedId] = useState<number>(1);

  const selected = useMemo(
    () => devoirs.find((item) => item.id === selectedId) ?? devoirs[0],
    [selectedId],
  );

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Dashboard admin</p>
            <h1 className="text-3xl font-black tracking-tight">Devoirs formation en ligne</h1>
            <p className="max-w-2xl text-sm opacity-70">
              Gestion des devoirs, échéances et dépôts des travaux.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
            Nouveau devoir <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border bg-white/5 p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-600" />
              <h2 className="text-lg font-black">Liste des devoirs</h2>
            </div>

            <div className="space-y-3">
              {devoirs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className="flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition hover:border-emerald-500/50"
                  style={{ borderColor: selectedId === item.id ? 'var(--primary)' : 'var(--border)' }}
                >
                  <div className="space-y-1">
                    <p className="font-bold">{item.title}</p>
                    <p className="text-xs opacity-60">{item.course}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-bold">{item.dueDate}</p>
                    <p className="opacity-60">{item.status}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border bg-white/5 p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText size={16} className="text-emerald-600" />
              <h2 className="text-lg font-black">Détail du devoir</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border p-4">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">Titre</p>
                <p className="mt-1 text-base font-black">{selected.title}</p>
                <p className="mt-2 text-sm opacity-70">{selected.course}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60">Date limite</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-bold">
                    <Clock3 size={14} /> {selected.dueDate}
                  </p>
                </div>
                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60">Points</p>
                  <p className="mt-1 text-sm font-bold">{selected.points} pts</p>
                </div>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-6 text-center transition hover:border-emerald-500/60">
                <Upload size={22} className="text-emerald-600" />
                <span className="text-sm font-semibold">Déposer un fichier</span>
                <span className="text-xs opacity-60">PDF, DOCX, ZIP</span>
                <input type="file" className="hidden" />
              </label>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">
                Marquer comme rendu <CheckCircle2 size={14} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
