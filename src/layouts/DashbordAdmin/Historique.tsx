import React, { useState, useMemo } from 'react';
import { 
  History, Search, Filter, Trash2, ShieldAlert, 
  RefreshCw, FilePlus, Edit, AlertCircle, Calendar, 
  Clock, User, CheckCircle2, Download
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// ─── Interfaces ─────────────────────────────────────────────────────
interface LogEntry {
  id: number;
  adminName: string;
  action: string;
  target: string;
  type: 'create' | 'update' | 'delete' | 'security';
  date: string;
  time: string;
  ipAddress: string;
}

// ─── Données Initiales (Logs récents de l'application) ──────────────
const INITIAL_LOGS: LogEntry[] = [
  { id: 1, adminName: 'Dr. Fanilo', action: 'Création du cours', target: 'Architecture Microservices & Cloud (INF-301)', type: 'create', date: '2026-07-02', time: '14:32', ipAddress: '192.168.1.42' },
  { id: 2, adminName: 'Mme Miora', action: 'Modification du slide vitrine', target: 'Inscriptions Ouvertes 2026 (ID: 1)', type: 'update', date: '2026-07-02', time: '11:15', ipAddress: '192.168.1.15' },
  { id: 3, adminName: 'Système / Sécurité', action: 'Tentative de connexion échouée', target: 'Compte admin [admin_test]', type: 'security', date: '2026-07-02', time: '09:04', ipAddress: '41.204.18.22' },
  { id: 4, adminName: 'Dr. Fanilo', action: 'Suppression d’un membre de l’organigramme', target: 'Ancien Enseignant (ID: 14)', type: 'delete', date: '2026-07-01', time: '16:45', ipAddress: '192.168.1.42' },
  { id: 5, adminName: 'Mme Miora', action: 'Modification des horaires de cours', target: 'Management Stratégique (MGT-101)', type: 'update', date: '2026-07-01', time: '10:20', ipAddress: '192.168.1.15' },
  { id: 6, adminName: 'M. Niavo', action: 'Création du cours', target: 'Intelligence Artificielle & NLP (INF-302)', type: 'create', date: '2026-06-30', time: '15:10', ipAddress: '192.168.1.89' },
];

const LOG_TYPES = ['Tous', 'Création', 'Modification', 'Suppression', 'Sécurité'];

export default function AdminHistorique() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');

  // ─── Filtrage intelligent des logs ──────────────────────────────────
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);

      let matchesType = true;
      if (selectedType === 'Création') matchesType = log.type === 'create';
      if (selectedType === 'Modification') matchesType = log.type === 'update';
      if (selectedType === 'Suppression') matchesType = log.type === 'delete';
      if (selectedType === 'Sécurité') matchesType = log.type === 'security';

      return matchesSearch && matchesType;
    });
  }, [logs, searchTerm, selectedType]);

  // ─── Calculs Statistiques (Bento) ───────────────────────────────────
  const stats = useMemo(() => {
    return {
      total: filteredLogs.length,
      securityAlerts: logs.filter(l => l.type === 'security').length,
    };
  }, [filteredLogs, logs]);

  // ─── Actions de l'historique ────────────────────────────────────────
  const handlePurgeLogs = () => {
    if (confirm('Voulez-vous vraiment vider tout l’historique des logs ? Cette action est irréversible.')) {
      setLogs([]);
    }
  };

  const handleExportCSV = () => {
    alert('Exportation des logs au format CSV simulée avec succès.');
  };

  // Rendu de l'icône selon le type de log
  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'create': return <FilePlus size={14} className="text-emerald-500" />;
      case 'update': return <Edit size={14} className="text-blue-500" />;
      case 'delete': return <Trash2 size={14} className="text-red-500" />;
      case 'security': return <ShieldAlert size={14} className="text-amber-500 animate-pulse" />;
    }
  };

  // Rendu du style du badge selon le type
  const getBadgeStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'create': return { backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' };
      case 'update': return { backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
      case 'delete': return { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' };
      case 'security': return { backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── En-tête ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wide">Historique des Activités</h1>
          <p className="text-xs opacity-50">Journal d'audit des actions effectuées par l'équipe administrative.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs border transition hover:bg-white/5 cursor-pointer"
            style={{ borderColor: 'var(--border)' }}
          >
            <Download size={14} />
            Exporter CSV
          </button>
          <button 
            onClick={handlePurgeLogs}
            disabled={logs.length === 0}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs text-red-500 border border-red-500/20 bg-red-500/5 transition hover:bg-red-500/10 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            <Trash2 size={14} />
            Purger
          </button>
        </div>
      </div>

      {/* ── Cartes statistiques Bento ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
          <div className="p-3 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,128,0,0.1)', color: 'var(--primary)' }}>
            <History size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider opacity-50">Événements Journalisés</p>
            <p className="text-lg font-black">{stats.total}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)' }}>
          <div className="p-3 rounded-xl flex items-center justify-center text-amber-500"
            style={{ backgroundColor: 'rgba(245,158,11,0.1)' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-wider opacity-50">Alertes Sécurité / Système</p>
            <p className="text-lg font-black">{stats.securityAlerts}</p>
          </div>
        </div>
      </div>

      {/* ── Filtres et Recherche ── */}
      <div className="p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: 'rgba(255,255,255,0.01)', borderColor: 'var(--border)' }}>
        
        {/* Barre de Recherche */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs flex-1 max-w-md"
          style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <Search size={15} className="opacity-40" />
          <input 
            type="text" 
            placeholder="Rechercher par admin, action, cible, IP..."
            className="bg-transparent outline-none w-full text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtres de types de logs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <Filter size={14} className="opacity-40 mr-1 shrink-0" />
          {LOG_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border"
              style={{
                borderColor: selectedType === type ? 'var(--primary)' : 'var(--border)',
                backgroundColor: selectedType === type ? 'rgba(0,180,0,0.12)' : 'transparent',
                color: selectedType === type ? 'var(--primary)' : 'var(--text)',
                opacity: selectedType === type ? 1 : 0.6
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table/Liste des Logs ── */}
      <div className="border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-[10px] uppercase font-black tracking-wider opacity-50" 
                style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <th className="p-4 w-12 text-center">Type</th>
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Action & Description</th>
                <th className="p-4">Cible Affectée</th>
                <th className="p-4">Date & Heure</th>
                <th className="p-4 text-right">Adresse IP</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs" style={{ borderColor: 'var(--border)' }}>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Icône et type */}
                    <td className="p-4 text-center">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto"
                        style={getBadgeStyle(log.type)}>
                        {getLogIcon(log.type)}
                      </div>
                    </td>

                    {/* Nom de l'admin */}
                    <td className="p-4 font-bold tracking-wide">
                      <div className="flex items-center gap-2">
                        <User size={12} className="opacity-40" />
                        <span>{log.adminName}</span>
                      </div>
                    </td>

                    {/* Action effectuée */}
                    <td className="p-4 font-semibold opacity-90">
                      {log.action}
                    </td>

                    {/* Élément cible */}
                    <td className="p-4 max-w-xs truncate font-medium opacity-60">
                      {log.target}
                    </td>

                    {/* Date et Heure */}
                    <td className="p-4 opacity-75">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 font-bold">
                          <Calendar size={11} className="opacity-40" /> {log.date}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] opacity-50">
                          <Clock size={11} className="opacity-40" /> {log.time}
                        </span>
                      </div>
                    </td>

                    {/* Adresse IP de l'appelant */}
                    <td className="p-4 text-right font-mono text-[11px] opacity-50">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center opacity-40">
                    <AlertCircle size={28} className="mx-auto mb-2 opacity-50" />
                    <p className="font-bold">Aucun log ou activité répertoriée avec ces critères.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}