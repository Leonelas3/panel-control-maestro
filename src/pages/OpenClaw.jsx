import React, { useState, useEffect } from 'react';
import { Terminal, Settings2, Play, RefreshCw, Cpu } from 'lucide-react';
import axios from 'axios';

export default function OpenClaw() {
  const [logs, setLogs] = useState([]);
  const [command, setCommand] = useState('');
  const [restarting, setRestarting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    // Si la app corre en dev, puede que necesitemos apuntar directo al puerto 8006, 
    // pero asumiendo que corre en prod detrás de Nginx
    const wsUrl = `${protocol}//${host}/api/admin/logs/openclaw?token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      setLogs(prev => {
        const newLogs = [...prev, event.data];
        if (newLogs.length > 200) return newLogs.slice(newLogs.length - 200);
        return newLogs;
      });
    };
    
    ws.onerror = () => {
      setLogs(prev => [...prev, 'Error al conectar al WebSocket de logs.']);
    };
    
    ws.onclose = () => {
      setLogs(prev => [...prev, '--- Conexión de logs cerrada ---']);
    };
    
    return () => ws.close();
  }, []);

  const handleRestart = async () => {
    if (!window.confirm("¿Seguro que deseas reiniciar el motor OpenClaw?")) return;
    setRestarting(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post('/api/admin/services/docker.service/restart', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('OpenClaw (Docker) reiniciado correctamente.');
    } catch (error) {
      alert(`Error al reiniciar: ${error.response?.data?.detail || error.message}`);
    } finally {
      setRestarting(false);
    }
  };

  const executeCommand = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    // Simular ejecución
    setLogs(prev => [...prev, `> ${command}`, `Comando '${command}' ejecutado. (Simulación)`]);
    setCommand('');
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div className="flex-between">
          <div>
            <h1>OpenClaw Core</h1>
            <p style={{ color: 'var(--text-muted)' }}>Consola de comandos y ajustes profundos del motor IA</p>
          </div>
          <button className="btn btn-danger" onClick={handleRestart} disabled={restarting}>
            <RefreshCw size={16} className={restarting ? "spin" : ""} /> {restarting ? "Reiniciando..." : "Reiniciar OpenClaw"}
          </button>
        </div>
      </div>

      <div className="grid-cols-2">
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Terminal size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem' }}>Terminal Interactiva</h2>
          </div>
          
          <div style={{ 
            flex: 1, 
            background: 'rgba(0,0,0,0.4)', 
            borderRadius: '8px', 
            padding: '16px', 
            fontFamily: 'monospace', 
            fontSize: '0.9rem',
            overflowY: 'auto',
            minHeight: '200px',
            marginBottom: '16px'
          }}>
            <div style={{ color: 'var(--success)', marginBottom: '8px' }}>OpenClaw Shell v1.0. Conectado.</div>
            {logs.map((l, i) => (
              <div key={i} style={{ color: l.startsWith('>') ? 'var(--accent)' : 'var(--text-muted)', marginBottom: '4px' }}>
                {l}
              </div>
            ))}
          </div>

          <form onSubmit={executeCommand} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="input-glass" 
              style={{ flex: 1 }} 
              placeholder="Escribe un comando (/ayuda)..." 
              value={command}
              onChange={(e) => setCommand(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>
              <Play size={16} />
            </button>
          </form>
        </div>

        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Cpu size={20} color="var(--warning)" />
            <h2 style={{ fontSize: '1.2rem' }}>Variables de Entorno Activas</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Estas configuraciones se aplican directamente al contenedor Docker de OpenClaw.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>OPENCLAW_MODE</label>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px', fontFamily: 'monospace' }}>PRODUCTION</div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>MEMORY_LIMIT</label>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px', fontFamily: 'monospace' }}>2048M</div>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>DATABASE_URL</label>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px', fontFamily: 'monospace', filter: 'blur(4px)' }}>postgres://user:pass@localhost...</div>
            </div>
          </div>
          
          <button className="btn btn-glass" style={{ width: '100%', marginTop: '24px' }}>
            <Settings2 size={16} /> Editar Variables (.env)
          </button>
        </div>
      </div>
    </div>
  );
}
