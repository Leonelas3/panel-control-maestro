import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Activity, Bot, Database, Server, RefreshCw, ShieldCheck, Terminal } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AiSettings from './pages/AiSettings';
import BotsControl from './pages/BotsControl';
import OpenClaw from './pages/OpenClaw';
import Logs from './pages/Logs';
import Login from './pages/Login';
import { useState, useEffect } from 'react';

function useVersionCheck() {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let currentVersion = null;

    const checkVersion = async () => {
      try {
        const res = await fetch('/api/admin/version');
        if (res.ok) {
          const data = await res.json();
          if (currentVersion === null) {
            currentVersion = data.version;
          } else if (currentVersion !== data.version) {
            setIsUpdating(true);
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        }
      } catch (err) {
        // Ignore network errors
      }
    };

    const interval = setInterval(checkVersion, 30000);
    checkVersion();
    return () => clearInterval(interval);
  }, []);

  return isUpdating;
}

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <ShieldCheck size={20} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>LelaAdmin</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/ai-settings" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Activity size={20} /> IA & Cascada
          </NavLink>
          <NavLink to="/bots-control" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Bot size={20} /> Control de Bots
          </NavLink>
          <NavLink to="/openclaw" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Server size={20} /> OpenClaw
          </NavLink>
          <NavLink to="/maintenance" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Database size={20} /> Caché & Logs
          </NavLink>
          <NavLink to="/logs" onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Terminal size={20} /> Logs del Sistema
          </NavLink>
          
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <button className="btn btn-glass" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => window.location.reload()}>
              <RefreshCw size={16} /> Refrescar UI
            </button>
            <button className="btn btn-glass" style={{ width: '100%', justifyContent: 'flex-start', marginTop: '10px', color: '#f87171' }} onClick={() => { localStorage.removeItem('admin_token'); window.location.href = '/login'; }}>
              <ShieldCheck size={16} /> Cerrar Sesión
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('admin_token');
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isUpdating = useVersionCheck();

  return (
    <Router>
      {isUpdating && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, fontSize: '1.5rem', fontWeight: 'bold'
        }}>
          Actualizando sistema...
        </div>
      )}
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="app-container">
          {/* Topbar visible solo en móviles */}
          <div className="mobile-topbar">
            <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="sidebar-logo" style={{ width: '28px', height: '28px' }}>
                <ShieldCheck size={16} />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>LelaAdmin</h2>
            </div>
            <button className="btn btn-glass" style={{ padding: '6px 10px' }} onClick={() => setIsSidebarOpen(true)}>
              ☰
            </button>
          </div>

          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="main-content fade-in">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ai-settings" element={<AiSettings />} />
              <Route path="/bots-control" element={<BotsControl />} />
              <Route path="/openclaw" element={<OpenClaw />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;
