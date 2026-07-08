import React, { useState, useMemo, useEffect } from 'react';
import { 
  History, Search, Filter, Trash2, ShieldAlert, 
  FilePlus, Edit, AlertCircle, Calendar, 
  Clock, User, Download, Loader2, AlertTriangle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ApiService from '../../services/ApiService';

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

const LOG_TYPES = ['Tous', 'Création', 'Modification', 'Suppression', 'Sécurité'];

export default function AdminHistorique() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');

  // ─── Chargement initial depuis l'API ────────────────────────────────
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await ApiService.historiques.getAll();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      setLoadError("Impossible de charger l'historique des activités.");
    } finally {
      setIsLoading(false);
    }
  };

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
  const handlePurgeLogs = async () => {
    if (!confirm('Voulez-vous vraiment vider tout l’historique des logs ? Cette action est irréversible.')) return;

    const previous = logs;
    setIsPurging(true);
    setLogs([]);

    try {
      await ApiService.historiques.purgeAll();
    } catch (err) {
      console.error(err);
      setLogs(previous); // rollback
      alert("La purge a échoué côté serveur, réessaie.");
    } finally {
      setIsPurging(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert("Aucun log à exporter avec les filtres actuels.");
      return;
    }

    const headers = ['Type', 'Utilisateur', 'Action', 'Cible', 'Date', 'Heure', 'Adresse IP'];
    const rows = filteredLogs.map(log => [
      log.type, log.adminName, log.action, log.target, log.date, log.time, log.ipAddress
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historique_etec_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  // ─── États de chargement / erreur ────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 gap-2 opacity-60">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-xs font-bold">Chargement de l'historique...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="py-12 text-center border border-dashed rounded-2xl opacity-70" style={{ borderColor: 'var(--border)' }}>
        <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-xs font-bold mb-3">{loadError}</p>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Réessayer
        </button>
      </div>
    );
  }

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
            disabled={logs.length === 0 || isPurging}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs text-red-500 border border-red-500/20 bg-red-500/5 transition hover:bg-red-500/10 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            {isPurging ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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