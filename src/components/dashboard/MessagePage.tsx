import { useMemo, useState } from 'react';
import { Mail, MessageSquareText, Search, Send, Star } from 'lucide-react';

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

const INITIAL_THREADS: MessageThread[] = [
  { id: 1, subject: 'Inscription confirmée', sender: 'Scolarité', preview: 'Votre dossier a bien été reçu et est en cours de traitement.', time: '08:42', unread: true },
  { id: 2, subject: 'Rappel de séance', sender: 'Enseignement', preview: 'La séance de demain est déplacée à 14h00.', time: 'Hier' },
  { id: 3, subject: 'Accès au module', sender: 'Support', preview: 'Le cours en ligne est maintenant disponible dans votre espace.', time: 'Lun' },
];

export default function MessagePage({ title, subtitle, audienceLabel }: MessagePageProps) {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeId, setActiveId] = useState(INITIAL_THREADS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');

  const filteredThreads = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return threads.filter((thread) => [thread.subject, thread.sender, thread.preview].some((value) => value.toLowerCase().includes(query)));
  }, [searchTerm, threads]);

  const activeThread = threads.find((thread) => thread.id === activeId) ?? filteredThreads[0] ?? null;

  const sendReply = () => {
    if (!activeThread || !replyText.trim()) return;
    const preview = replyText.trim();
    setThreads((current) => current.map((thread) => thread.id === activeThread.id ? { ...thread, preview, time: 'À l’instant', unread: false } : thread));
    setReplyText('');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <header>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">{audienceLabel}</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm opacity-60">{subtitle}</p>
      </header>

      <div className="grid min-h-[560px] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-3xl border p-3 shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="mb-3 flex items-center gap-2 rounded-2xl border px-3 py-2.5" style={{ borderColor: 'var(--border)' }}>
            <Search size={14} className="opacity-50" />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Rechercher un message" className="w-full bg-transparent text-xs outline-none" />
          </div>
          <div className="space-y-2">
            {filteredThreads.map((thread) => <button key={thread.id} type="button" onClick={() => setActiveId(thread.id)} className="w-full rounded-2xl border p-3 text-left transition hover:-translate-y-px hover:shadow-sm" style={{ borderColor: activeThread?.id === thread.id ? 'var(--primary)' : 'var(--border)', backgroundColor: activeThread?.id === thread.id ? 'rgba(16,185,129,0.08)' : 'transparent' }}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-bold">{thread.subject}</p><p className="text-[11px] opacity-55">{thread.sender}</p></div><span className="shrink-0 text-[10px] opacity-45">{thread.time}</span></div><p className="mt-2 line-clamp-2 text-xs opacity-65">{thread.preview}</p>{thread.unread && <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2 py-1 text-[10px] font-bold text-[var(--primary)]"><Star size={10} /> Non lu</span>}</button>)}
            {filteredThreads.length === 0 && <p className="py-10 text-center text-xs opacity-50">Aucun message trouvé.</p>}
          </div>
        </aside>

        <section className="flex min-w-0 flex-col rounded-3xl border p-4 shadow-sm md:p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          {activeThread ? <>
            <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--primary)]">Conversation</p><h2 className="mt-1 text-lg font-black">{activeThread.subject}</h2><p className="text-xs opacity-55">Avec {activeThread.sender}</p></div><div className="rounded-2xl bg-[var(--primary)]/10 p-3 text-[var(--primary)]"><MessageSquareText size={20} /></div></div>
            <div className="flex-1 space-y-4 py-6"><div className="max-w-2xl rounded-2xl rounded-tl-sm bg-[var(--primary)]/10 p-4 text-sm leading-6">{activeThread.preview}</div><p className="text-[11px] opacity-45">Vous pouvez répondre à cette conversation ci-dessous.</p></div>
            <div className="space-y-3 rounded-2xl border p-3" style={{ borderColor: 'var(--border)' }}><textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} rows={4} placeholder="Écrire un message..." className="w-full resize-none rounded-xl border bg-transparent p-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" style={{ borderColor: 'var(--border)' }} /><div className="flex items-center justify-end"><button type="button" onClick={sendReply} disabled={!replyText.trim()} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:-translate-y-px hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40" style={{ backgroundColor: 'var(--primary)' }}>Envoyer <Send size={14} /></button></div></div>
          </> : <div className="flex flex-1 flex-col items-center justify-center text-center opacity-50"><Mail size={36} className="mb-3" /><p className="text-sm font-bold">Sélectionnez une conversation</p></div>}
        </section>
      </div>
    </div>
  );
}
