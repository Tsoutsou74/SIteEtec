import { useMemo, useState } from 'react';
import { CheckCircle2, HelpCircle, Trophy } from 'lucide-react';

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

const questions: Question[] = [
  {
    id: 1,
    question: 'Quel hook React permet de gérer un état local ?',
    options: ['useMemo', 'useState', 'useRef'],
    answer: 1,
  },
  {
    id: 2,
    question: 'Quel verbe HTTP sert à créer une ressource ?',
    options: ['GET', 'POST', 'DELETE'],
    answer: 1,
  },
  {
    id: 3,
    question: 'Quel format est souvent utilisé pour les échanges API ?',
    options: ['PNG', 'JSON', 'MP3'],
    answer: 1,
  },
];

export default function QuizPage() {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const score = useMemo(
    () => questions.reduce((acc, item) => acc + (selected[item.id] === item.answer ? 1 : 0), 0),
    [selected],
  );

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Dashboard admin</p>
            <h1 className="text-3xl font-black tracking-tight">Quiz formation en ligne</h1>
            <p className="max-w-2xl text-sm opacity-70">
              Création et suivi des quiz associés aux formations en ligne.
            </p>
          </div>

          <div className="rounded-2xl border bg-white/5 px-4 py-3 text-right">
            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Score</p>
            <p className="mt-1 text-2xl font-black text-emerald-600">{score}/{questions.length}</p>
          </div>
        </div>

        <div className="grid gap-4">
          {questions.map((item) => (
            <section key={item.id} className="rounded-2xl border bg-white/5 p-4 md:p-5">
              <div className="mb-4 flex items-center gap-2">
                <HelpCircle size={16} className="text-emerald-600" />
                <h2 className="text-base font-black">{item.question}</h2>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {item.options.map((option, index) => {
                  const isSelected = selected[item.id] === index;
                  const isCorrect = item.answer === index;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelected((prev) => ({ ...prev, [item.id]: index }))}
                      className="rounded-2xl border px-4 py-4 text-left transition"
                      style={{
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                        backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold">{option}</span>
                        {isSelected && isCorrect && <CheckCircle2 size={16} className="text-emerald-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white">
            Terminer le quiz <Trophy size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
