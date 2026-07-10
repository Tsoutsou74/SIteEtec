import { useMemo, useState, useEffect } from 'react';
import { Send, Search, Paperclip, MessageSquareText, Star, Loader2, AlertCircle } from 'lucide-react';

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

// export default function MessagePage({ title, subtitle, audienceLabel }: MessagePageProps) {
//   // ─── États ──────────────────────────────────────────────
//   // const [threads, setThreads] = useState<MessageThread[]>([]);
//   const [activeId, setActiveId] = useState<number | null>(null);
//   const [replyText, setReplyText] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const [loading, setLoading] = useState<boolean>(true);
//   const [sending, setSending] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // 1. Chargement initial des fils de discussion
//   useEffect(() => {
//     const fetchThreads = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const data = await apiService.getMessageThreads();
//         setThreads(data || []);
        
//         if (data && data.length > 0) {
//           setActiveId(data[0].id);
//         }
//       } catch (err) {
//         console.error("Erreur lors de la récupération des messages:", err);
//         setError("Impossible de charger vos messages. Veuillez réessayer.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchThreads();
//   }, []);

//   // Sélection du fil actif basé sur l'ID sélectionné
//   const activeThread = useMemo(() => {
//     return threads.find((thread) => thread.id === activeId) ?? null;
//   }, [activeId, threads]);

//   // ─── Filtrage & Recherche ───
//   const filteredThreads = useMemo(() => {
//     return threads.filter(thread => 
//       thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       thread.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       thread.preview.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [threads, searchTerm]);

//   // ─── Actions ───
//   const handleSendMessage = async () => {
//     if (!replyText.trim() || !activeId) return;

//     try {
//       setSending(true);
//       setError(null);

//       // Appel asynchrone vers l'API pour poster la réponse
//       await apiService.replyToThread(activeId, { message: replyText });
      
//       setReplyText('');
      
//       // Optionnel : Recharger ou mettre à jour localement le preview du thread
//       const updatedThreads = await apiService.getMessageThreads();
//       if (updatedThreads) setThreads(updatedThreads);

//     } catch (err) {
//       console.error("Erreur lors de l'envoi du message:", err);
//       setError("Le message n'a pas pu être envoyé.");
//     } finally {
//       setSending(false);
//     }
//   };
// const threads: MessageThread[] = [
//   {
//     id: 1,
//     subject: 'Inscription confirmée',
//     sender: 'Scolarité',
//     preview: 'Votre dossier a bien été reçu et est en cours de traitement.',
//     time: '08:42',
//     unread: true,
//   },
//   {
//     id: 2,
//     subject: 'Rappel de séance',
//     sender: 'Enseignement',
//     preview: 'La séance de demain est déplacée à 14h00.',
//     time: 'Hier',
//   },
//   {
//     id: 3,
//     subject: 'Accès au module',
//     sender: 'Support',
//     preview: 'Le cours en ligne est maintenant disponible dans votre espace.',
//     time: 'Lun',
//   },
// ];

// export default function MessagePage({ title, subtitle, audienceLabel }: MessagePageProps) {
//   const [activeId, setActiveId] = useState(threads[0].id);

//   const activeThread = useMemo(
//     () => threads.find((thread) => thread.id === activeId) ?? threads[0],
//     [activeId],
//   );


//   return (
//     <div className="min-h-screen px-4 py-6 md:px-8 md:py-10">
//       <div className="mx-auto max-w-7xl space-y-6">

//         <header className="space-y-2">
//           <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">{audienceLabel}</p>
//           <h1 className="text-3xl font-black tracking-tight">{title}</h1>
//           <p className="max-w-2xl text-sm opacity-70">{subtitle}</p>
//         </header>

//         {/* Global Error Feedback */}
//         {error && (
//           <div className="flex items-center gap-2 p-3 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
//             <AlertCircle size={16} />
//             <span>{error}</span>
//           </div>
//         )}

//         <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          
//           {/* Liste latérale / Sidebar */}
//           <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
//             <aside className="rounded-2xl border bg-white/5 p-4">
//               <div className="mb-4 flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: 'var(--border)' }}>
//                 <Search size={14} className="opacity-60" />
//                 <input
//                   type="text"
//                   placeholder="Rechercher un message"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full bg-transparent text-sm outline-none"
//                 />
//               </div>

//               <div className="space-y-2">
//                 {loading ? (
//                   <div className="flex flex-col items-center justify-center py-12 gap-2 opacity-60">
//                     <Loader2 className="animate-spin text-emerald-600" size={20} />
//                     <p className="text-xs font-medium">Récupération des messages...</p>
//                   </div>
//                 ) : filteredThreads.length === 0 ? (
//                   <p className="text-xs text-center opacity-50 py-8 font-medium">Aucun message trouvé.</p>
//                 ) : (
//                   filteredThreads.map((thread) => (
//                     <button
//                       key={thread.id}
//                       type="button"
//                       onClick={() => setActiveId(thread.id)}
//                       className="w-full rounded-2xl border px-3 py-3 text-left transition cursor-pointer"
//                       style={{
//                         borderColor: activeId === thread.id ? 'var(--primary)' : 'var(--border)',
//                         backgroundColor: activeId === thread.id ? 'rgba(16,185,129,0.08)' : 'transparent',
//                       }}
//                     >
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="min-w-0">
//                           <p className="truncate text-sm font-bold">{thread.subject}</p>
//                           <p className="text-xs opacity-60">{thread.sender}</p>
//                         </div>
//                         <span className="text-[10px] opacity-50">{thread.time}</span>
//                       </div>
//                       <p className="mt-2 truncate text-xs opacity-70">{thread.preview}</p>
//                       {thread.unread && (
//                         <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-1 text-[10px] font-bold text-emerald-600">
//                           <Star size={10} /> Non lu
//                         </span>
//                       )}
//                     </button>
//                   ))
//                 )}
//               </div>
//             </aside>

//             {/* Zone de lecture et réponse principale */}
//             <section className="rounded-2xl border bg-white/5 p-4 md:p-5">
//               {activeThread ? (
//                 <>
//                   <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
//                     <div>
//                       <p className="text-xs font-bold uppercase tracking-wider opacity-60">Conversation</p>
//                       <h2 className="text-lg font-black">{activeThread.subject}</h2>
//                       <p className="text-xs opacity-60">{activeThread.sender}</p>
//                     </div>
//                     <MessageSquareText size={20} className="text-emerald-600" />
//                   </div>

//                   <div className="space-y-4 py-5">
//                     <div className="max-w-2xl rounded-2xl bg-emerald-600/10 p-4 text-sm">
//                       {activeThread.preview} Répondez ci-dessous pour poursuivre l’échange.
//                     </div>
//                   </div>

//                   <div className="space-y-3 rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
//                     <textarea
//                       rows={5}
//                       value={replyText}
//                       onChange={(e) => setReplyText(e.target.value)}
//                       placeholder="Écrire un message..."
//                       disabled={sending}
//                       className="w-full resize-none rounded-xl border bg-transparent p-3 text-sm outline-none disabled:opacity-50"
//                       style={{ borderColor: 'var(--border)' }}
//                     />
//                     <div className="flex items-center justify-between gap-3">
//                       <button 
//                         type="button"
//                         disabled={sending}
//                         className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-40" 
//                         style={{ borderColor: 'var(--border)' }}
//                       >
//                         <Paperclip size={14} /> Joindre
//                       </button>
//                       <button 
//                         type="button"
//                         onClick={handleSendMessage}
//                         disabled={sending || !replyText.trim()}
//                         className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white cursor-pointer hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                       >
//                         {sending ? (
//                           <>Injections... <Loader2 className="animate-spin" size={14} /></>
//                         ) : (
//                           <>Envoyer <Send size={14} /></>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-12">
//                   <MessageSquareText size={32} className="mb-2" />
//                   <p className="text-sm font-medium">Sélectionnez une discussion pour afficher l'historique.</p>
//                 </div>
//               )}
//             </section>

//                 {threads.map((thread) => (
//                   <button
//                     key={thread.id}
//                     type="button"
//                     onClick={() => setActiveId(thread.id)}
//                     className="w-full rounded-2xl border px-3 py-3 text-left transition"
//                     style={{
//                       borderColor: activeId === thread.id ? 'var(--primary)' : 'var(--border)',
//                       backgroundColor: activeId === thread.id ? 'rgba(16,185,129,0.08)' : 'transparent',
//                     }}
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="min-w-0">
//                         <p className="truncate text-sm font-bold">{thread.subject}</p>
//                         <p className="text-xs opacity-60">{thread.sender}</p>
//                       </div>
//                       <span className="text-[10px] opacity-50">{thread.time}</span>
//                     </div>
//                     <p className="mt-2 truncate text-xs opacity-70">{thread.preview}</p>
//                     {thread.unread && (
//                       <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-1 text-[10px] font-bold text-emerald-600">
//                         <Star size={10} /> Non lu
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>

//             <section className="rounded-2xl border bg-white/5 p-4 md:p-5">
//               <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-wider opacity-60">Conversation</p>
//                   <h2 className="text-lg font-black">{activeThread.subject}</h2>
//                   <p className="text-xs opacity-60">{activeThread.sender}</p>
//                 </div>
//                 <MessageSquareText size={20} className="text-emerald-600" />
//               </div>

//               <div className="space-y-4 py-5">
//                 <div className="max-w-2xl rounded-2xl bg-emerald-600/10 p-4 text-sm">
//                   {activeThread.preview} Répondez ci-dessous pour poursuivre l’échange.
//                 </div>
//               </div>

//               <div className="space-y-3 rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
//                 <textarea
//                   rows={5}
//                   placeholder="Écrire un message..."
//                   className="w-full resize-none rounded-xl border bg-transparent p-3 text-sm outline-none"
//                   style={{ borderColor: 'var(--border)' }}
//                 />
//                 <div className="flex items-center justify-between gap-3">
//                   <button className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-wider" style={{ borderColor: 'var(--border)' }}>
//                     <Paperclip size={14} /> Joindre
//                   </button>
//                   <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
//                     Envoyer <Send size={14} />
//                   </button>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//   );
// }
// }

export default function MessagePage({title, subtitle, audienceLabel}: MessagePageProps) {

  // body...
  
}
