import React, { useState, useEffect } from 'react';
import { Zap, BrainCircuit, Save, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';

export default function AiSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // States mapped to the config.json
  const [strategy, setStrategy] = useState('cascade');
  const [effort, setEffort] = useState('balanced');
  
  const [prompts, setPrompts] = useState({
    whatsapp: "Eres un asistente de ventas profesional. Responde de manera concisa y amigable. Si no sabes algo, pide al cliente que espere un momento para revisión humana.",
    gastos: "Analiza esta transacción financiera y extrae los datos clave. Verifica si el importe parece inusualmente alto para la categoría asignada."
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get('/api/admin/config', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ai_settings = res.data.ai_settings || {};
        
        // Map from API back to UI
        if (ai_settings.cascade_enabled) setStrategy('cascade');
        else if (ai_settings.primary_model === 'llama-3-70b-instruct') setStrategy('groq');
        else if (ai_settings.primary_model === 'gemini-1.5-pro-latest') setStrategy('gemini');
        else setStrategy('claude');

        if (ai_settings.temperature === 0.2) setEffort('fast');
        else if (ai_settings.temperature === 0.9) setEffort('deep');
        else setEffort('balanced');
        
        if (ai_settings.prompts) {
           setPrompts(ai_settings.prompts);
        }

      } catch (error) {
        console.error("Error fetching config", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    let cascade_enabled = strategy === 'cascade';
    let primary_model = 'gpt-4o';
    if (strategy === 'groq') primary_model = 'llama-3-70b-instruct';
    if (strategy === 'gemini') primary_model = 'gemini-1.5-pro-latest';
    if (strategy === 'claude') primary_model = 'claude-3-5-sonnet-20240620';
    
    let temperature = 0.7;
    if (effort === 'fast') temperature = 0.2;
    if (effort === 'deep') temperature = 0.9;

    const payload = {
      ai_settings: {
        cascade_enabled,
        primary_model,
        temperature,
        prompts
      }
    };

    try {
      const token = localStorage.getItem('admin_token');
      await axios.post('/api/admin/config', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Configuración guardada correctamente.');
    } catch (error) {
      alert('Error guardando configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="fade-in" style={{ padding: '2rem' }}>Cargando configuración de IA...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div className="flex-between">
          <div>
            <h1>IA & Cascada Optimizada</h1>
            <p style={{ color: 'var(--text-muted)' }}>Configuración de modelos de lenguaje y límites de coste</p>
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <div className="grid-cols-2">
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <BrainCircuit size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem' }}>Modelo Principal</h2>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Estrategia de Resolución</label>
            <select className="input-glass" value={strategy} onChange={(e) => setStrategy(e.target.value)} style={{ appearance: 'none' }}>
              <option value="cascade">Cascada Groq → Gemini (Recomendado)</option>
              <option value="groq">Forzar Groq (Llama 3 - Muy rápido/Gratis)</option>
              <option value="gemini">Forzar Gemini (Multimodal/Gratis)</option>
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

        <div className="glass-panel">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>System Prompts</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Bot de Atención WhatsApp</label>
            <textarea 
              className="input-glass" 
              rows="4" 
              value={prompts.whatsapp}
              onChange={(e) => setPrompts({...prompts, whatsapp: e.target.value})}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Analizador de Gastos</label>
            <textarea 
              className="input-glass" 
              rows="3" 
              value={prompts.gastos}
              onChange={(e) => setPrompts({...prompts, gastos: e.target.value})}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
