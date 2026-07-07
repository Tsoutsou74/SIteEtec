import { useMemo, useState } from 'react';
import { Send, Search, Paperclip, MessageSquareText, Star } from 'lucide-react';

type MessageThread = {
  id: number;
  subject: string;
  sender: string;
  preview: string;
  time: string;
  unread?: boolean;
};

type MessagePageProps = {
  title: string;
  subtitle: string;
  audienceLabel: string;
};

const threads: MessageThread[] = [
  {
    id: 1,
    subject: 'Inscription confirmée',
    sender: 'Scolarité',
    preview: 'Votre dossier a bien été reçu et est en cours de traitement.',
    time: '08:42',
    unread: true,
  },
  {
    id: 2,
    subject: 'Rappel de séance',
    sender: 'Enseignement',
    preview: 'La séance de demain est déplacée à 14h00.',
    time: 'Hier',
  },
  {
    id: 3,
    subject: 'Accès au module',
    sender: 'Support',
    preview: 'Le cours en ligne est maintenant disponible dans votre espace.',
    time: 'Lun',
  },
];

export default function MessagePage({ title, subtitle, audienceLabel }: MessagePageProps) {
  const [activeId, setActiveId] = useState(threads[0].id);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeId) ?? threads[0],
    [activeId],
  );

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">{audienceLabel}</p>
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          <p className="max-w-2xl text-sm opacity-70">{subtitle}</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border bg-white/5 p-4">
            <div className="mb-4 flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border)' }}>
              <Search size={14} className="opacity-60" />
              <input
                type="text"
                placeholder="Rechercher un message"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <div className="space-y-2">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveId(thread.id)}
                  className="w-full rounded-2xl border px-3 py-3 text-left transition"
                  style={{
                    borderColor: activeId === thread.id ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: activeId === thread.id ? 'rgba(16,185,129,0.08)' : 'transparent',
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{thread.subject}</p>
                      <p className="text-xs opacity-60">{thread.sender}</p>
                    </div>
                    <span className="text-[10px] opacity-50">{thread.time}</span>
                  </div>
                  <p className="mt-2 truncate text-xs opacity-70">{thread.preview}</p>
                  {thread.unread && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-1 text-[10px] font-bold text-emerald-600">
                      <Star size={10} /> Non lu
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl border bg-white/5 p-4 md:p-5">
            <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">Conversation</p>
                <h2 className="text-lg font-black">{activeThread.subject}</h2>
                <p className="text-xs opacity-60">{activeThread.sender}</p>
              </div>
              <MessageSquareText size={20} className="text-emerald-600" />
            </div>

            <div className="space-y-4 py-5">
              <div className="max-w-2xl rounded-2xl bg-emerald-600/10 p-4 text-sm">
                {activeThread.preview} Répondez ci-dessous pour poursuivre l’échange.
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <textarea
                rows={5}
                placeholder="Écrire un message..."
                className="w-full resize-none rounded-xl border bg-transparent p-3 text-sm outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
              <div className="flex items-center justify-between gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-wider" style={{ borderColor: 'var(--border)' }}>
                  <Paperclip size={14} /> Joindre
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                  Envoyer <Send size={14} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
