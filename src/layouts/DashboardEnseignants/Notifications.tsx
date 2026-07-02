import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Bell, Mail, Info, AlertTriangle, Check, 
  Trash2, Eye, ShieldAlert, CheckCircle2, Clock 
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
interface Notification {
  id: string;
  titre: string;
  description: string;
  date: string;
  lu: boolean;
  type: 'message' | 'systeme' | 'urgent';
}

// ─── Données Simulées (Mock Data) ─────────────────────────
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    titre: 'Nouveau message de la Scolarité',
    description: 'Veuillez soumettre les fiches de présence signées pour la classe L1 Info A avant ce vendredi à 16h.',
    date: 'Aujourd\'hui, 10:30',
    lu: false,
    type: 'message'
  },
  {
    id: 'notif-2',
    titre: 'Alerte : Conflit d\'emploi du temps résolu',
    description: 'Le cours d\'Algorithmique (L1 Info B) initialement prévu le Jeudi à 14h a été déplacé en salle A203 le Jeudi à 08h.',
    date: 'Hier, 15:45',
    lu: false,
    type: 'urgent'
  },
  {
    id: 'notif-3',
    titre: 'Mise à jour du système réussie',
    description: 'La plateforme de gestion universitaire a été mise à jour vers la version 2.4. Le module de saisie des PV de notes est désormais optimisé.',
    date: '28 Juin 2026',
    lu: true,
    type: 'systeme'
  },
  {
    id: 'notif-4',
    titre: 'Validation de votre demande de congé',
    description: 'Votre demande d\'absence pour motif académique (Conférence) du 12 Juillet a été validée par le Chef de Mention.',
    date: '25 Juin 2026',
    lu: true,
    type: 'message'
  }
];

export default function Notifications() {
  const { darkMode } = useTheme();
  
  // États
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'tout' | 'message' | 'systeme' | 'urgent'>('tout');

  const cardBg = darkMode ? 'rgba(18,18,18,0.7)' : 'rgba(255,255,255,0.9)';
  const borderStyle = { borderColor: 'var(--border)' };

  // Filtrer les notifications
  const filteredNotifs = useMemo(() => {
    if (filter === 'tout') return notifications;
    return notifications.filter(n => n.type === filter);
  }, [notifications, filter]);

  // Nombre de notifications non lues
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.lu).length;
  }, [notifications]);

  // Actions
  const marquerCommeLu = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n));
  };

  const supprimerNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toutMarquerCommeLu = () => {
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
  };

  // Icône et style dynamique selon la catégorie
  const getTypeStyles = (type: 'message' | 'systeme' | 'urgent', lu: boolean) => {
    if (lu) {
      return {
        icon: <Info size={14} />,
        bg: 'bg-neutral-500/5',
        text: 'text-neutral-400 dark:text-neutral-500',
        border: 'border-transparent'
      };
    }
    switch (type) {
      case 'urgent':
        return {
          icon: <AlertTriangle size={14} />,
          bg: 'bg-rose-500/10 dark:bg-rose-500/20',
          text: 'text-rose-500',
          border: 'border-rose-500/20'
        };
      case 'message':
        return {
          icon: <Mail size={14} />,
          bg: 'bg-blue-500/10 dark:bg-blue-500/20',
          text: 'text-blue-500',
          border: 'border-blue-500/20'
        };
      case 'systeme':
        return {
          icon: <CheckCircle2 size={14} />,
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
          text: 'text-emerald-500',
          border: 'border-emerald-500/20'
        };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Bell className="text-[var(--primary)]" size={22} />
            Centre de Notifications
          </h1>
          <p className="text-xs opacity-50 mt-0.5">
            Restez informé des messages de l'administration, des changements d'horaires et du système.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={toutMarquerCommeLu}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer self-start sm:self-center"
            style={borderStyle}
          >
            <Check size={14} />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* ─── Onglets de filtrage (Tabs) ─── */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border" style={borderStyle}>
        {(['tout', 'message', 'systeme', 'urgent'] as const).map((t) => {
          const isActive = filter === t;
          const label = t === 'tout' ? 'Tout' : t === 'message' ? 'Messages' : t === 'systeme' ? 'Système' : 'Urgents';
          
          // Compter par type pour affichage dynamique sur les badges
          const count = t === 'tout' ? notifications.length : notifications.filter(n => n.type === t).length;

          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-[var(--primary)] text-white shadow-xs' 
                  : 'opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>{label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/5 opacity-60'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Liste des Notifications ─── */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center border border-dashed rounded-2xl opacity-40 text-xs font-medium" style={borderStyle}>
            Aucune notification dans cette catégorie.
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            const style = getTypeStyles(notif.type, notif.lu);
            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all relative overflow-hidden group ${
                  !notif.lu ? 'border-l-4' : 'opacity-70'
                }`}
                style={{ 
                  backgroundColor: cardBg, 
                  borderColor: !notif.lu ? 'var(--primary)' : 'var(--border)',
                  borderLeftColor: !notif.lu ? 'var(--primary)' : undefined
                }}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Badge d'état / Type */}
                  <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${style.bg} ${style.border} ${style.text}`}>
                    {style.icon}
                  </div>
                  
                  {/* Contenu textuel */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-xs tracking-tight ${!notif.lu ? 'font-black' : 'font-bold'}`}>
                        {notif.titre}
                      </h3>
                      {!notif.lu && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] opacity-75 leading-relaxed pr-4">
                      {notif.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] opacity-40 pt-1 font-semibold">
                      <Clock size={11} />
                      <span>{notif.date}</span>
                    </div>
                  </div>
                </div>

                {/* Barre d'actions individuelles au survol ou focus */}
                <div className="flex items-center gap-1 shrink-0 opacity-45 group-hover:opacity-100 transition-opacity">
                  {!notif.lu && (
                    <button
                      onClick={() => marquerCommeLu(notif.id)}
                      title="Marquer comme lu"
                      className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-emerald-500 transition cursor-pointer"
                    >
                      <Eye size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => supprimerNotification(notif.id)}
                    title="Supprimer la notification"
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Discret pied de page de conformité RGPD / Système */}
      <div className="text-[10px] opacity-35 px-1 font-medium flex items-center gap-1.5">
        <ShieldAlert size={12} />
        <span>Les notifications d'urgence et d'administration système sont purgées automatiquement après 30 jours.</span>
      </div>

    </div>
  );
}