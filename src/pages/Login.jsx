import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function Login({ onLogin }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const [googleCredential, setGoogleCredential] = useState(null);
  const [totpCode, setTotpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    if (decoded.email && decoded.email.toLowerCase() === 'leonelastres@gmail.com') {
      setError('');
      setGoogleCredential(credentialResponse.credential);
      setStep(2);
    } else {
      setError('Cuenta de Google no autorizada. Usa leonelastres@gmail.com');
    }
  };

  const handle2FA = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_credential: googleCredential,
          totp_code: totpCode
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Error en la verificación 2FA');
      }

      localStorage.setItem('admin_token', data.access_token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Acceso administrativo restringido</p>

        {step === 1 ? (
          <div>
            <p style={{ marginBottom: '16px', fontSize: '0.9rem' }}>Inicia sesión de forma segura usando Google OAuth</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Fallo en la autenticación con Google')}
                theme="filled_black"
                text="continue_with"
                shape="rectangular"
              />
            </div>

            {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '16px' }}>{error}</p>}
          </div>
        ) : (
          <form onSubmit={handle2FA} className="fade-in">
            <p style={{ marginBottom: '16px', fontSize: '0.9rem' }}>Introduce el código de 6 dígitos de tu app de Autenticación (2FA)</p>
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <input 
                type="text" 
                className="input-glass" 
                placeholder="000000" 
                maxLength="6" 
                required 
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px' }} 
              />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Verificar y Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
