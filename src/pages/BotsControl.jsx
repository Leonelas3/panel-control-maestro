import { MessageSquare, Mic, PauseCircle, PlayCircle, Settings2 } from 'lucide-react';
import { useState } from 'react';

export default function BotsControl() {
  const [waPaused, setWaPaused] = useState(false);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h1>Control de Bots OpenClaw</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gestión multicanal y modos de intervención manual</p>
      </div>

      <div className="grid-cols-2">
        {/* WhatsApp Card */}
        <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px' }}>
            <span className="badge badge-success">Conectado</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(37, 211, 102, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={24} color="#25D366" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>WhatsApp Business</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+34 651 07 65 47</p>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Capacidades Activas</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>Atención 24/7</span>
              <span className="badge" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
                <Mic size={12} style={{ display: 'inline', marginRight: 4 }} /> 
                Audios ES/EN
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1rem' }}>Override Manual (Silencio)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>La IA dejará de responder temporalmente.</p>
              </div>
              <button 
                className={\`btn \${waPaused ? 'btn-primary' : 'btn-danger'}\`}
                onClick={() => setWaPaused(!waPaused)}
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
              <h2 style={{ fontSize: '1.2rem' }}>Telegram (Admin)</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>+34 613 95 00 02</p>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Reportes en vivo</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              OpenClaw te enviará resúmenes de chats de clientes a este Telegram.
              Se incluyen resúmenes de texto y respuestas en audio autogeneradas para que no tengas que leer conduciendo.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div className="flex-between">
              <h4 style={{ fontSize: '1rem' }}>Token del Bot</h4>
              <button className="btn btn-glass" style={{ padding: '6px 12px' }}>
                <Settings2 size={16} /> Configurar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
