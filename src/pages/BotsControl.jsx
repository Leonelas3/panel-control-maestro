import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic, PauseCircle, PlayCircle, Settings2, Save, X } from 'lucide-react';
import axios from 'axios';

export default function BotsControl() {
  const [waPaused, setWaPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [showConfig, setShowConfig] = useState(false);
  const [botConfig, setBotConfig] = useState({
    wa_business_phone: '651076547',
    tg_bot_phone: '651076547',
    admin_tg_phone: '613950002',
    admin_wa_phone: '613950002'
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
          wa_business_phone: openclaw.wa_business_phone || '651076547',
          tg_bot_phone: openclaw.tg_bot_phone || '651076547',
          admin_tg_phone: openclaw.admin_tg_phone || '613950002',
          admin_wa_phone: openclaw.admin_wa_phone || '613950002'
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
      setWaPaused(!newPausedState); // rollback
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
      alert('Configuración de teléfonos guardada correctamente.');
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
            <h1>Control de Bots OpenClaw</h1>
            <p style={{ color: 'var(--text-muted)' }}>Gestión multicanal y modos de intervención manual</p>
          </div>
          <button className="btn btn-glass" onClick={() => setShowConfig(true)}>
            <Settings2 size={16} /> Configurar Teléfonos
          </button>
        </div>
      </div>

      <div className="grid-cols-2">
        {/* WhatsApp Card */}
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px' }}>
            <span className={`badge ${waPaused ? 'badge-warning' : 'badge-success'}`}>
              {waPaused ? 'Pausado' : 'Conectado'}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(37, 211, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={24} color="#25D366" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>WhatsApp Business</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+{botConfig.wa_business_phone}</p>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Capacidades Activas</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <span className="badge" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>Atención 24/7</span>
              <span className="badge" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
                <Mic size={12} style={{ display: 'inline', marginRight: 4 }} /> 
                Audios ES/EN
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Este bot atiende automáticamente los mensajes de clientes recibidos en el número configurado.
              Interpreta audios y texto, genera respuestas siguiendo el System Prompt y guarda el historial en la base de datos.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1rem' }}>Override Manual (Silencio)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>La IA dejará de responder para que puedas hablar manualmente.</p>
              </div>
              <button 
                className={`btn ${waPaused ? 'btn-primary' : 'btn-danger'}`}
                onClick={handleTogglePause}
                disabled={saving}
              >
                {waPaused ? <><PlayCircle size={16} /> Reactivar IA</> : <><PauseCircle size={16} /> Pausar IA</>}
              </button>
            </div>
          </div>
        </div>

        {/* Telegram Card */}
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px' }}>
            <span className="badge badge-success">Conectado</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0, 136, 204, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={24} color="#0088cc" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>Notificaciones Telegram</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bot: +{botConfig.tg_bot_phone}</p>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Reportes en vivo</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              OpenClaw te enviará resúmenes de chats de clientes a tu Telegram personal (+{botConfig.admin_tg_phone}).
              Se incluyen resúmenes de texto y respuestas en audio autogeneradas para que puedas escucharlas mientras conduces.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div className="flex-between">
              <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Admin: +{botConfig.admin_tg_phone}</h4>
              <button className="btn btn-glass" style={{ padding: '6px 12px' }} onClick={() => setShowConfig(true)}>
                <Settings2 size={16} /> Cambiar Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfig && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h2>Configuración de Números</h2>
              <button className="btn btn-glass" onClick={() => setShowConfig(false)} style={{ padding: '8px' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  WhatsApp Business (Número del Bot que responde clientes)
                </label>
                <input 
                  type="text" 
                  className="input-glass" 
                  value={botConfig.wa_business_phone} 
                  onChange={e => setBotConfig({...botConfig, wa_business_phone: e.target.value})}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  WhatsApp Admin (Tú simulando ser cliente para pruebas)
                </label>
                <input 
                  type="text" 
                  className="input-glass" 
                  value={botConfig.admin_wa_phone} 
                  onChange={e => setBotConfig({...botConfig, admin_wa_phone: e.target.value})}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Telegram Bot (Número o ID del bot de alertas)
                </label>
                <input 
                  type="text" 
                  className="input-glass" 
                  value={botConfig.tg_bot_phone} 
                  onChange={e => setBotConfig({...botConfig, tg_bot_phone: e.target.value})}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Telegram Admin (Tu número personal donde recibes alertas)
                </label>
                <input 
                  type="text" 
                  className="input-glass" 
                  value={botConfig.admin_tg_phone} 
                  onChange={e => setBotConfig({...botConfig, admin_tg_phone: e.target.value})}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-glass" onClick={() => setShowConfig(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveConfig} disabled={saving}>
                <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
