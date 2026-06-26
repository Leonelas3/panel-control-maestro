import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Download, RefreshCw, AlertCircle, ListFilter } from 'lucide-react';

export default function Logs() {
  const [logType, setLogType] = useState('systemd'); // 'systemd' or 'app'
  const [selectedService, setSelectedService] = useState('gastos.service');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [logs, setLogs] = useState('');
  const [appLogs, setAppLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const logsEndRef = useRef(null);

  const services = [
    'gastos.service',
    'lela-auth.service',
    'lela-digital.service',
    'nginx.service',
    'docker.service',
    'analista.service',
    'lela-admin-api.service'
  ];

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      if (logType === 'systemd') {
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
      } else {
        const url = new URL('/api/admin/app-logs', window.location.origin);
        if (categoryFilter) {
          url.searchParams.append('category', categoryFilter);
        }
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Error al cargar logs de la aplicación');
        }
        const data = await response.json();
        setAppLogs(data.logs || []);
      }
      
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
  }, [selectedService, logType, categoryFilter]);

  const handleDownload = () => {
    const token = localStorage.getItem('admin_token');
    let url = '';
    let filename = '';

    if (logType === 'systemd') {
      url = `/api/admin/logs/${selectedService}/download`;
      filename = `${selectedService}.log`;
    } else {
      url = '/api/admin/app-logs/download';
      if (categoryFilter) {
        url += `?category=${categoryFilter}`;
      }
      filename = `app_logs${categoryFilter ? '_' + categoryFilter : ''}.log`;
    }

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(r => r.blob())
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
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
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>Logs del Sistema y Aplicación</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Visualizador en tiempo real y descarga de bitácoras por servicio o categoría
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
        <div className="flex gap-4 mb-6 border-b border-gray-800 pb-4">
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${logType === 'systemd' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setLogType('systemd')}
          >
            Systemd Logs
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${logType === 'app' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setLogType('app')}
          >
            App Logs
          </button>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          {logType === 'systemd' ? (
            <div style={{ flex: 1, maxWidth: '300px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Seleccionar Servicio
              </label>
              <select 
                className="input-glass" 
                style={{ width: '100%' }}
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                {services.map(s => (
                  <option key={s} value={s} style={{ color: '#000' }}>{s}</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ flex: 1, maxWidth: '300px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Filtrar por Categoría
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  className="input-glass w-full pl-10" 
                  placeholder="Ej: AI_REQUEST, USER_ACTION..."
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                />
                <ListFilter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}
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
          {loading ? 'Cargando logs...' : (
            logType === 'systemd' ? logs : (
              appLogs.length === 0 ? 'No hay logs de la aplicación.' : appLogs.map((log, index) => (
                <div key={index} className="mb-2 border-b border-gray-800 pb-2">
                  <span className="text-gray-500">[{new Date(log.timestamp).toLocaleString()}]</span>{' '}
                  <span className="text-blue-400 font-semibold">[{log.category}]</span>{' '}
                  <span className="text-green-400">[{log.project}]</span>{' '}
                  <span>{log.message}</span>
                </div>
              ))
            )
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
