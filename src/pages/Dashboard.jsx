import { Server, Cpu, Database, Activity, RefreshCw, Power } from 'lucide-react';

export default function Dashboard() {
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
            14<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>%</span>
          </div>
          <div style={{ marginTop: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px' }}>
            <div style={{ width: '14%', background: 'var(--primary)', height: '100%', borderRadius: '2px' }}></div>
          </div>
        </div>

        <div className="glass-panel">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>RAM Usage</h3>
            <Database size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            2.1<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}> GB</span>
          </div>
          <div style={{ marginTop: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', height: '4px', borderRadius: '2px' }}>
            <div style={{ width: '26%', background: 'var(--success)', height: '100%', borderRadius: '2px' }}></div>
          </div>
        </div>

        <div className="glass-panel">
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Network I/O</h3>
            <Activity size={20} color="var(--info)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            45<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}> Mbps</span>
          </div>
          <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '8px' }}>↑ 12 Mbps / ↓ 33 Mbps</div>
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
            {[
              { name: 'Gastos App (FastAPI)', status: 'Online', uptime: '14d 2h', color: 'var(--success)' },
              { name: 'OpenClaw Bot', status: 'Online', uptime: '2d 5h', color: 'var(--success)' },
              { name: 'Nginx Reverse Proxy', status: 'Online', uptime: '30d 1h', color: 'var(--success)' },
              { name: 'Redis Cache', status: 'Warning', uptime: '1d 12h', color: 'var(--warning)' },
            ].map((s, i) => (
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
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{s.uptime}</td>
                <td style={{ padding: '16px' }}>
                  <button className="btn btn-glass" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <RefreshCw size={14} /> Reiniciar
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
