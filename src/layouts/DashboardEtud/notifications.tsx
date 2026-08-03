import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Bell, ClipboardList, Megaphone,
  FileText, Check, Trash2, ShieldAlert, Clock, Loader2 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface NotificationEtudiant {
  id: string;
  titre: string;
  description: string;
  type: 'Administration' | 'Cours' | 'Notes' | 'Urgent';
  date: string;
  lu: boolean;
}

export default function NotificationsEtudiant() {
  const { darkMode } = useTheme();

  // ─── États Dynamiques ───────────────────────────────────
  const [notifications, setNotifications] = useState<NotificationEtudiant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('Tous');

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };
  const filtres = ['Tous', 'Urgent', 'Notes', 'Cours', 'Administration'];

  useEffect(() => {
    const fetchNotificationsData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setNotifications([
          { id: '1', titre: 'Notes de Mathématiques publiées', description: "Vos notes pour l'examen de Mathématiques sont désormais disponibles.", type: 'Notes', date: 'Il y a 2 heures', lu: false },
          { id: '2', titre: 'Changement de salle', description: 'Le cours de Programmation Web aura lieu en Salle 202.', type: 'Urgent', date: 'Il y a 5 heures', lu: false },
          { id: '3', titre: 'Nouveau support de cours', description: "Le chapitre 3 d'Algorithmique a été mis en ligne.", type: 'Cours', date: 'Hier', lu: true },
          { id: '4', titre: 'Fermeture de la scolarité', description: 'Le secrétariat sera fermé ce vendredi après-midi.', type: 'Administration', date: 'Hier', lu: true }
        ]);
      } catch (err) {
        console.error("Erreur lors de la récupération des notifications :", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationsData();
  }, []);

  const marquerCommeLu = async (id: string) => {
    const target = notifications.find(n => n.id === id);
    if (!target || target.lu) return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
  };

  const toutMarquerCommeLu = async () => {
    if (notifications.every(n => n.lu)) return;
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
  };

  const supprimerNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ─── Mémos et Filtres ───────────────────────────────────
  const nbNonLues = useMemo(() => notifications.filter(n => !n.lu).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'Tous') return notifications;
    return notifications.filter(n => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Urgent':
        return { icon: <ShieldAlert size={14} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
      case 'Notes':
        return { icon: <ClipboardList size={14} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
      case 'Cours':
        return { icon: <FileText size={14} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' };
      default:
        return { icon: <Megaphone size={14} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' };
    }
  };

  return (
    <div className="space-y-6 max-w-3xl pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
            <Bell style={{ color: 'var(--primary)' }} size={24} />
            Centre de Notifications
            {nbNonLues > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full text-white bg-rose-500 font-mono font-bold animate-pulse">
                {nbNonLues} nouvelle{nbNonLues > 1 ? 's' : ''}
              </span>
            )}
          </h1>
          <p className="text-xs opacity-45 mt-0.5">
            Restez informé en temps réel des publications de notes, devoirs et alertes administratives.
          </p>
        </div>

        {nbNonLues > 0 && (
          <button
            type="button"
            onClick={toutMarquerCommeLu}
            className="flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold hover:opacity-80 transition cursor-pointer self-start sm:self-center"
            style={borderStyle}
          >
            <Check size={14} />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filtres.map(f => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold transition whitespace-nowrap cursor-pointer"
              style={{
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                color: isActive ? 'white' : 'var(--text)',
                opacity: isActive ? 1 : 0.7,
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Zone principale de contenu */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3 opacity-60 text-xs">
          <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
          <p className="font-bold">Synchronisation de vos alertes en temps réel...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center border border-dashed rounded-2xl opacity-40 text-xs font-medium" style={borderStyle}>
              Aucune notification dans cette catégorie.
            </div>
          ) : (
            filteredNotifications.map(notif => {
              const meta = getTypeBadge(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => marquerCommeLu(notif.id)}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition duration-200 ${
                    !notif.lu ? 'cursor-pointer border-l-4' : 'opacity-60'
                  }`}
                  style={{
                    backgroundColor: cardBg,
                    borderColor: 'var(--border)',
                    borderLeftColor: !notif.lu ? 'var(--primary)' : 'var(--border)',
                  }}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-xl shrink-0 flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: meta.bg, color: meta.color }}>
                      {meta.icon}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-xs tracking-tight ${!notif.lu ? 'font-black' : 'font-bold'}`}>
                          {notif.titre}
                        </h3>
                        {!notif.lu && (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--primary)' }} />
                        )}
                      </div>
                      <p className="text-[11px] opacity-60 leading-relaxed font-medium">
                        {notif.description}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] opacity-40 font-semibold pt-1">
                        <Clock size={11} />
                        <span>{notif.date}</span>
                        <span>·</span>
                        <span className="uppercase tracking-wider text-[9px]" style={{ color: meta.color }}>
                          {notif.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={e => supprimerNotification(notif.id, e)}
                    className="p-1.5 rounded-lg opacity-30 hover:opacity-100 hover:text-rose-500 transition cursor-pointer shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}