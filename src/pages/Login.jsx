import { ShieldCheck, Lock, User } from 'lucide-react';
import { useState } from 'react';

export default function Login({ onLogin }) {
  const [step, setStep] = useState(1);
  
  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-dark)'
    }}>
      <div className="glass-panel fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, var(--primary), #d946ef)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <ShieldCheck size={32} />
          </div>
        </div>
        
        <h2 style={{ marginBottom: '8px' }}>Panel Maestro</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Acceso administrativo seguro</p>

        {step === 1 ? (
          <form onSubmit={handleNext}>
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="text" className="input-glass" placeholder="Usuario" required style={{ paddingLeft: '44px' }} />
            </div>
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-muted)' }} />
              <input type="password" className="input-glass" placeholder="Contraseña" required style={{ paddingLeft: '44px' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Continuar
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="fade-in">
            <p style={{ marginBottom: '16px', fontSize: '0.9rem' }}>Introduce el código de 6 dígitos de tu app de Autenticación (2FA)</p>
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <input 
                type="text" 
                className="input-glass" 
                placeholder="000000" 
                maxLength="6" 
                required 
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px' }} 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Verificar y Entrar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
