import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Download, RefreshCw, AlertCircle } from 'lucide-react';

export default function Logs() {
  const [selectedService, setSelectedService] = useState('gastos.service');
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const logsEndRef = useRef(null);

  const services = [
    'gastos.service',
    'lela-auth.service',
    'lela-digital.service',
    'nginx.service',
    'docker.service',
    'analista-backend.service',
    'admin-api.service'
  ];

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/logs/${selectedService}?lines=200`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Error al cargar logs');
      }
      const data = await response.json();
      setLogs(data.logs || 'No hay logs recientes.');
      
      // Auto-scroll
      setTimeout(() => {
        if (logsEndRef.current) {
          logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedService]);

  const handleDownload = () => {
    const token = localStorage.getItem('admin_token');
    fetch(`/api/admin/logs/${selectedService}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(r => r.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedService}.log`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => {
      setError('Error al descargar: ' + err.message);
    });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>Logs del Sistema</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Visualizador en tiempo real y descarga de bitácoras por servicio
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchLogs} className="btn btn-glass" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refrescar
          </button>
          <button onClick={handleDownload} className="btn btn-primary" disabled={loading}>
            <Download size={16} />
            Descargar Completo
          </button>
        </div>
      </div>

      <div className="card p-5">
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Seleccionar Servicio
          </label>
          <select 
            className="input-glass" 
            style={{ width: '100%', maxWidth: '300px' }}
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {services.map(s => (
              <option key={s} value={s} style={{ color: '#000' }}>{s}</option>
            ))}
          </select>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div style={{ 
          background: '#0d1117', 
          borderRadius: '8px', 
          padding: '16px', 
          height: '500px', 
          overflowY: 'auto',
          border: '1px solid var(--border-color)',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          color: '#e6edf3',
          whiteSpace: 'pre-wrap'
        }}>
          {loading ? 'Cargando logs...' : logs}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
