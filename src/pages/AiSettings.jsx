import { Zap, BrainCircuit, Save, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function AiSettings() {
  const [effort, setEffort] = useState('balanced');
  
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div className="flex-between">
          <div>
            <h1>IA & Cascada Optimizada</h1>
            <p style={{ color: 'var(--text-muted)' }}>Configuración de modelos de lenguaje y límites de coste</p>
          </div>
          <button className="btn btn-primary">
            <Save size={16} /> Guardar Cambios
          </button>
        </div>
      </div>

      <div className="grid-cols-2">
        {/* Cascade Configuration */}
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <BrainCircuit size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem' }}>Modelo Principal</h2>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Estrategia de Resolución</label>
            <select className="input-glass" defaultValue="cascade" style={{ appearance: 'none' }}>
              <option value="cascade">Cascada Groq → Gemini (Recomendado)</option>
              <option value="groq">Forzar Groq (Llama 3 - Muy rápido/Gratis)</option>
              <option value="gemini">Forzar Gemini Flash (Multimodal/Gratis)</option>
              <option value="claude">Forzar Claude 3.5 (Premium - Pago)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Esfuerzo de la IA (Tokens/Coste)</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className={`btn ${effort === 'fast' ? 'btn-primary' : 'btn-glass'}`}
                onClick={() => setEffort('fast')}
                style={{ flex: 1 }}
              >
                <Zap size={16} /> Rápida
              </button>
              <button 
                className={`btn ${effort === 'balanced' ? 'btn-primary' : 'btn-glass'}`}
                onClick={() => setEffort('balanced')}
                style={{ flex: 1 }}
              >
                <SlidersHorizontal size={16} /> Balanceada
              </button>
              <button 
                className={`btn ${effort === 'deep' ? 'btn-primary' : 'btn-glass'}`}
                onClick={() => setEffort('deep')}
                style={{ flex: 1 }}
              >
                <BrainCircuit size={16} /> Detallista
              </button>
            </div>
          </div>
        </div>

        {/* System Prompts */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>System Prompts</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Bot de Atención WhatsApp</label>
            <textarea 
              className="input-glass" 
              rows="4" 
              defaultValue="Eres un asistente de ventas profesional. Responde de manera concisa y amigable. Si no sabes algo, pide al cliente que espere un momento para revisión humana."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Analizador de Gastos</label>
            <textarea 
              className="input-glass" 
              rows="3" 
              defaultValue="Analiza esta transacción financiera y extrae los datos clave. Verifica si el importe parece inusualmente alto para la categoría asignada."
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
