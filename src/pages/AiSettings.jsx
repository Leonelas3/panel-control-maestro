import React, { useState, useEffect } from 'react';
import { Zap, BrainCircuit, Save, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';

export default function AiSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // States mapped to the config.json
  const [primaryModel, setPrimaryModel] = useState('gpt-4o');
  const [fallbackModel, setFallbackModel] = useState('claude-3-5-sonnet-20240620');
  const [cascadeEnabled, setCascadeEnabled] = useState(true);
  const [temperature, setTemperature] = useState(0.7);
  
  const [prompts, setPrompts] = useState({
    whatsapp: "Eres un asistente de ventas profesional. Responde de manera concisa y amigable. Si no sabes algo, pide al cliente que espere un momento para revisión humana.",
    gastos: "Analiza esta transacción financiera y extrae los datos clave. Verifica si el importe parece inusualmente alto para la categoría asignada."
  });

  const availableModels = [
    { id: 'llama-3-70b-instruct', label: 'Llama 3 70B (Groq - Gratis/Rápido)' },
    { id: 'llama-3-8b-instruct', label: 'Llama 3 8B (Groq - Gratis/Rápido)' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B (Groq - Gratis)' },
    { id: 'gemma-7b-it', label: 'Gemma 7B (Groq - Gratis)' },
    { id: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro (Google - Gratis/Avanzado)' },
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Google - Gratis/Rápido)' },
    { id: 'claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet (Anthropic - Premium)' },
    { id: 'gpt-4o', label: 'GPT-4o (OpenAI - Premium)' },
  ];

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get('/api/admin/config', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ai_settings = res.data.ai_settings || {};
        
        if (ai_settings.primary_model) setPrimaryModel(ai_settings.primary_model);
        if (ai_settings.fallback_model) setFallbackModel(ai_settings.fallback_model);
        if (ai_settings.cascade_enabled !== undefined) setCascadeEnabled(ai_settings.cascade_enabled);
        if (ai_settings.temperature !== undefined) setTemperature(ai_settings.temperature);
        if (ai_settings.prompts) setPrompts(ai_settings.prompts);

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

    const payload = {
      ai_settings: {
        cascade_enabled: cascadeEnabled,
        primary_model: primaryModel,
        fallback_model: fallbackModel,
        temperature: temperature,
        prompts: prompts
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
            <h2 style={{ fontSize: '1.2rem' }}>Modelos y Estrategia</h2>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px' }}>
              <input 
                type="checkbox" 
                checked={cascadeEnabled} 
                onChange={(e) => setCascadeEnabled(e.target.checked)} 
                style={{ width: '18px', height: '18px' }}
              />
              Activar Cascada Optimizada (Principal → Fallback)
            </label>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Modelo Principal</label>
            <select className="input-glass" value={primaryModel} onChange={(e) => setPrimaryModel(e.target.value)} style={{ appearance: 'none' }}>
              {availableModels.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Modelo de Respaldo (Fallback)</label>
            <select className="input-glass" value={fallbackModel} onChange={(e) => setFallbackModel(e.target.value)} style={{ appearance: 'none' }} disabled={!cascadeEnabled}>
              {availableModels.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Esfuerzo de la IA (Temperatura: {temperature})</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className={`btn ${temperature <= 0.3 ? 'btn-primary' : 'btn-glass'}`}
                onClick={() => setTemperature(0.2)}
                style={{ flex: 1 }}
              >
                <Zap size={16} /> Exacta (0.2)
              </button>
              <button 
                className={`btn ${temperature > 0.3 && temperature < 0.8 ? 'btn-primary' : 'btn-glass'}`}
                onClick={() => setTemperature(0.7)}
                style={{ flex: 1 }}
              >
                <SlidersHorizontal size={16} /> Balanceada (0.7)
              </button>
              <button 
                className={`btn ${temperature >= 0.8 ? 'btn-primary' : 'btn-glass'}`}
                onClick={() => setTemperature(0.9)}
                style={{ flex: 1 }}
              >
                <BrainCircuit size={16} /> Creativa (0.9)
              </button>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.1" 
              value={temperature} 
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              style={{ width: '100%', marginTop: '12px' }}
            />
          </div>
        </div>

        <div className="glass-panel">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>System Prompts</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Bot de Atención WhatsApp</label>
            <textarea 
              className="input-glass" 
              rows="6" 
              value={prompts.whatsapp || ""}
              onChange={(e) => setPrompts({...prompts, whatsapp: e.target.value})}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Analizador de Gastos</label>
            <textarea 
              className="input-glass" 
              rows="5" 
              value={prompts.gastos || ""}
              onChange={(e) => setPrompts({...prompts, gastos: e.target.value})}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
