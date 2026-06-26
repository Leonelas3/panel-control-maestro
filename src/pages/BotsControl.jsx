import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic, PauseCircle, PlayCircle, Settings2, Save, X, Shield, ShieldOff, Info } from 'lucide-react';
import axios from 'axios';

export default function BotsControl() {
  const [waPaused, setWaPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [showConfig, setShowConfig] = useState(false);
  const [botConfig, setBotConfig] = useState({
    wa_business_phone: '34651076547',
    tg_bot_phone: '34651076547',
    admin_tg_phone: '34613950002',
    admin_wa_phone: '34613950002',
    admin_wa_enabled: true,
    admin_tg_enabled: true
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get('/api/admin/config', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const bots = res.data.bots || {};
        const openclaw = bots.openclaw || {};
        
        if (openclaw.mode === 'paused') {
          setWaPaused(true);
        } else {
          setWaPaused(false);
        }

        setBotConfig({
          wa_business_phone: openclaw.wa_business_phone || '34651076547',
          tg_bot_phone: openclaw.tg_bot_phone || '34651076547',
          admin_tg_phone: openclaw.admin_tg_phone || '34613950002',
          admin_wa_phone: openclaw.admin_wa_phone || '34613950002',
          admin_wa_enabled: openclaw.admin_wa_enabled !== false, // default true
          admin_tg_enabled: openclaw.admin_tg_enabled !== false
        });
      } catch (error) {
        console.error("Error fetching config", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleTogglePause = async () => {
    const newPausedState = !waPaused;
    setWaPaused(newPausedState);
    setSaving(true);
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post('/api/admin/config', {
        bots: {
          openclaw: { enabled: true, mode: newPausedState ? 'paused' : 'autonomous' }
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      alert('Error cambiando estado del bot');
      setWaPaused(!newPausedState);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAdmin = async (platform) => {
    setSaving(true);
    const updatedConfig = { ...botConfig };
    if (platform === 'wa') updatedConfig.admin_wa_enabled = !botConfig.admin_wa_enabled;
    if (platform === 'tg') updatedConfig.admin_tg_enabled = !botConfig.admin_tg_enabled;
    
    setBotConfig(updatedConfig);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post('/api/admin/config', {
        bots: { openclaw: updatedConfig }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      alert('Error cambiando privilegios');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post('/api/admin/config', {
        bots: {
          openclaw: { ...botConfig }
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Configuración guardada correctamente.');
      setShowConfig(false);
    } catch (error) {
      alert('Error guardando configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="fade-in" style={{ padding: '2rem' }}>Cargando bots...</div>;

  return (
    <div className="fade-in" style={{ position: 'relative' }}>
      <div style={{ marginBottom: '24px' }}>
        <div className="flex-between">
          <div>
            <h1>Centro de Comunicaciones de Bots</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              Gestión multicanal de IA para atención al cliente y herramientas administrativas. <br/>
              Modifica los números y derechos de administrador para probar libremente.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowConfig(true)}>
            <Settings2 size={16} /> Ajustes Globales de Números
          </button>
        </div>
      </div>

      <div className="grid-cols-2">
        {/* WhatsApp Card */}
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px' }}>
            <span className={`badge ${waPaused ? 'badge-warning' : 'badge-success'}`}>
              {waPaused ? 'IA Silenciada' : 'Bot Activo'}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(37, 211, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={24} color="#25D366" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>WhatsApp (Cliente/Empresa)</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bot: +{botConfig.wa_business_phone}</p>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Misión del Bot</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span className="badge" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>Atención 24/7</span>
              <span className="badge" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>Audios / Texto</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Actúa como el agente primario de LELA para los clientes. Procesa pedidos, analiza fotos/audios con IA en Cascada y registra el historial.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginBottom: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Override Manual (Silenciar IA)</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Si quieres tomar el control de la conversación y que el bot deje de responder.</p>
              </div>
              <button 
                className={`btn ${waPaused ? 'btn-success' : 'btn-danger'}`}
                onClick={handleTogglePause}
                disabled={saving}
                style={{ minWidth: '130px', justifyContent: 'center' }}
              >
                {waPaused ? <><PlayCircle size={16} /> Encender IA</> : <><PauseCircle size={16} /> Silenciar IA</>}
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
            <div className="flex-between">
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Derechos de Admin WA</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Tu número (+{botConfig.admin_wa_phone})</p>
              </div>
              <button 
                className={`btn ${botConfig.admin_wa_enabled ? 'btn-primary' : 'btn-glass'}`}
                onClick={() => handleToggleAdmin('wa')}
                disabled={saving}
                title={botConfig.admin_wa_enabled ? "Desactivar para probar como cliente" : "Activar modo Admin"}
              >
                {botConfig.admin_wa_enabled ? <><Shield size={16}/> Admin ON</> : <><ShieldOff size={16}/> Admin OFF</>}
              </button>
            </div>
            {!botConfig.admin_wa_enabled && (
               <p style={{ fontSize: '0.75rem', color: 'var(--warning-color)', marginTop: '8px' }}>
                 ⚠️ Ahora mismo si le escribes al bot, te tratará como un cliente normal. Enciende esto para volver a mandar comandos de control.
               </p>
            )}
          </div>
        </div>

        {/* Telegram Card */}
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px' }}>
            <span className="badge badge-success">Bot Activo</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0, 136, 204, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={24} color="#0088cc" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>Telegram (Canal Interno/Alerta)</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bot: +{botConfig.tg_bot_phone}</p>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Misión del Bot</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span className="badge" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>Alertas de Sistema</span>
              <span className="badge" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>Reportes en vivo</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Este bot está diseñado para enviarte notificaciones y resúmenes de chats críticos a ti. También puedes consultarle métricas de Analista directamente usando /comandos.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #0088cc' }}>
            <div className="flex-between">
              <div>
                <h4 style={{ fontSize: '0.95rem' }}>Derechos de Admin TG</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Tu número (+{botConfig.admin_tg_phone})</p>
              </div>
              <button 
                className={`btn ${botConfig.admin_tg_enabled ? 'btn-primary' : 'btn-glass'}`}
                onClick={() => handleToggleAdmin('tg')}
                disabled={saving}
              >
                {botConfig.admin_tg_enabled ? <><Shield size={16}/> Admin ON</> : <><ShieldOff size={16}/> Admin OFF</>}
              </button>
            </div>
            {!botConfig.admin_tg_enabled && (
               <p style={{ fontSize: '0.75rem', color: 'var(--warning-color)', marginTop: '8px' }}>
                 ⚠️ No recibirás alertas críticas ni resúmenes mientras el modo Admin esté apagado.
               </p>
            )}
          </div>
        </div>
      </div>

      {showConfig && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '32px', border: '1px solid var(--border-color)' }}>
            <div className="flex-between" style={{ marginBottom: '24px' }}>
              <h2>Ajustes Globales de Telefonía</h2>
              <button className="btn btn-glass" onClick={() => setShowConfig(false)} style={{ padding: '8px' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ background: 'rgba(41, 128, 185, 0.1)', border: '1px solid rgba(41, 128, 185, 0.3)', padding: '12px', borderRadius: '8px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
              <Info size={24} color="#3498db" />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Asegúrate de incluir el código de país (ej. 34 para España) sin el símbolo + al configurar los números.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: '#25D366' }}>Entorno WhatsApp</h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Teléfono del BOT (Business)
                  </label>
                  <input 
                    type="text" 
                    className="input-glass" 
                    value={botConfig.wa_business_phone} 
                    onChange={e => setBotConfig({...botConfig, wa_business_phone: e.target.value})}
                    style={{ width: '100%' }}
                    placeholder="Ej. 34651076547"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Tu número Personal (Admin)
                  </label>
                  <input 
                    type="text" 
                    className="input-glass" 
                    value={botConfig.admin_wa_phone} 
                    onChange={e => setBotConfig({...botConfig, admin_wa_phone: e.target.value})}
                    style={{ width: '100%' }}
                    placeholder="Ej. 34613950002"
                  />
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: '#0088cc' }}>Entorno Telegram</h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Teléfono/ID del BOT
                  </label>
                  <input 
                    type="text" 
                    className="input-glass" 
                    value={botConfig.tg_bot_phone} 
                    onChange={e => setBotConfig({...botConfig, tg_bot_phone: e.target.value})}
                    style={{ width: '100%' }}
                    placeholder="Ej. 34651076547"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Tu número Personal (Admin)
                  </label>
                  <input 
                    type="text" 
                    className="input-glass" 
                    value={botConfig.admin_tg_phone} 
                    onChange={e => setBotConfig({...botConfig, admin_tg_phone: e.target.value})}
                    style={{ width: '100%' }}
                    placeholder="Ej. 34613950002"
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              <button className="btn btn-glass" onClick={() => setShowConfig(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveConfig} disabled={saving}>
                <Save size={16} /> {saving ? 'Guardando red...' : 'Confirmar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
