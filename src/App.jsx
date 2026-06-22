import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Activity, Bot, Database, Server, RefreshCw, ShieldCheck } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import AiSettings from './pages/AiSettings';
import BotsControl from './pages/BotsControl';
import Login from './pages/Login';
import { useState } from 'react';

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <ShieldCheck size={20} />
        </div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>LelaAdmin</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => \`nav-item \${isActive ? 'active' : ''}\`} end>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/ai-settings" className={({ isActive }) => \`nav-item \${isActive ? 'active' : ''}\`}>
          <Activity size={20} /> IA & Cascada
        </NavLink>
        <NavLink to="/bots-control" className={({ isActive }) => \`nav-item \${isActive ? 'active' : ''}\`}>
          <Bot size={20} /> Control de Bots
        </NavLink>
        <NavLink to="/maintenance" className={({ isActive }) => \`nav-item \${isActive ? 'active' : ''}\`}>
          <Database size={20} /> Caché & Logs
        </NavLink>
        
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-glass" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Refrescar UI
          </button>
        </div>
      </nav>
    </aside>
  );
}

function App() {
  // Simple auth state for demonstration
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true for dev

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai-settings" element={<AiSettings />} />
            <Route path="/bots-control" element={<BotsControl />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
