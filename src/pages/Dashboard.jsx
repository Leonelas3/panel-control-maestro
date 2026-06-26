import React, { useState, useEffect } from 'react';
import { Server, Cpu, Database, Activity, RefreshCw, Power } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restarting, setRestarting] = useState(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRestart = async (serviceName, systemdName) => {
    if (!window.confirm(`¿Seguro que deseas reiniciar ${serviceName}?`)) return;
    setRestarting(systemdName);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`/api/admin/services/${systemdName}/restart`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${serviceName} reiniciado correctamente.`);
      fetchStats();
    } catch (error) {
      alert(`Error al reiniciar: ${error.response?.data?.detail || error.message}`);
    } finally {
      setRestarting(null);
    }
  };

  if (loading && !stats) {
    return <div className="fade-in" style={{ padding: '2rem' }}>Cargando métricas del VPS...</div>;
  }

  if (!stats) {
    return <div className="fade-in" style={{ padding: '2rem', color: 'var(--danger)' }}>Error cargando métricas. Revisa tu conexión o vuelve a iniciar sesión.</div>;
  }

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1>Monitor del VPS</h1>
          <p style={{ color: 'var(--text-muted)' }}>Métricas en tiempo real y estado de los servicios</p>
        </div>
        <button className="btn btn-danger">
          <Power size={16} /> Reiniciar VPS
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid-cols-3" style={{ marginBottom: '24px' }}>
        <div className="glass-panel">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>CPU Usage</h3>
            <Cpu size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {stats.cpu_usage_percent}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>%</span>
          </div>
          <div style={{ marginTop: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px' }}>
            <div style={{ width: `${stats.cpu_usage_percent}%`, background: 'var(--primary)', height: '100%', borderRadius: '2px' }}></div>
          </div>
        </div>

        <div className="glass-panel">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>RAM Usage</h3>
            <Database size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {stats.ram_usage_gb}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}> / {stats.ram_total_gb} GB</span>
          </div>
          <div style={{ marginTop: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px' }}>
            <div style={{ width: `${(stats.ram_usage_gb / stats.ram_total_gb) * 100}%`, background: 'var(--success)', height: '100%', borderRadius: '2px' }}></div>
          </div>
        </div>

        <div className="glass-panel">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Network I/O</h3>
            <Activity size={20} color="var(--info)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {(stats.net_bytes_recv / (1024*1024)).toFixed(0)}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}> MB</span>
          </div>
          <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '8px' }}>↑ {(stats.net_bytes_sent / (1024*1024)).toFixed(0)} MB / ↓ {(stats.net_bytes_recv / (1024*1024)).toFixed(0)} MB</div>
        </div>
      </div>

      {/* Services Status */}
      <h2>Estado de Servicios</h2>
      <div className="glass-panel" style={{ marginTop: '16px', padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Servicio</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Estado</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Uptime</th>
              <th style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {stats.services && stats.services.map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Server size={16} color={s.color} /> {s.name}
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span className="badge" style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}55` }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>-</td>
                <td style={{ padding: '16px' }}>
                  <button 
                    className="btn btn-glass" 
                    style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: restarting === s.service ? 0.5 : 1 }}
                    onClick={() => handleRestart(s.name, s.service)}
                    disabled={restarting === s.service}
                  >
                    <RefreshCw size={14} className={restarting === s.service ? "spin" : ""} /> {restarting === s.service ? "Reiniciando..." : "Reiniciar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
