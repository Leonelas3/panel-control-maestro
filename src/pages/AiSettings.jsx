import React, { useState, useEffect } from 'react';
import { Zap, BrainCircuit, Save, SlidersHorizontal, ArrowUp, ArrowDown, X, Plus } from 'lucide-react';
import axios from 'axios';

export default function AiSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [cascadeModels, setCascadeModels] = useState([]);
  const [temperature, setTemperature] = useState(0.7);
  
  const [prompts, setPrompts] = useState({
    whatsapp: "Eres un asistente de ventas profesional. Responde de manera concisa y amigable.",
    gastos: "Analiza esta transacción financiera y extrae los datos clave."
  });

  const availableModels = [
    // Groq (Gratis / Ultra Rápido)
    { id: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B (Groq)' },
    { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B (Groq)' },
    { id: 'llama-3-70b-instruct', label: 'Llama 3 70B (Groq Legacy)' },
    { id: 'llama-3-8b-instruct', label: 'Llama 3 8B (Groq Legacy)' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B (Groq)' },
    { id: 'gemma-7b-it', label: 'Gemma 7B (Groq)' },
    { id: 'gemma2-9b-it', label: 'Gemma 2 9B (Groq)' },
    // Google (Gratis tier)
    { id: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro (Google)' },
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Google)' },
    // OpenRouter (Gratis)
    { id: 'openrouter/auto', label: 'OpenRouter Auto (Gratis)' },
    { id: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B (OpenRouter Gratis)' },
    { id: 'google/gemma-7b-it:free', label: 'Gemma 7B (OpenRouter Gratis)' },
    { id: 'meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B (OpenRouter Gratis)' },
    { id: 'qwen/qwen-2-7b-instruct:free', label: 'Qwen 2 7B (OpenRouter Gratis)' },
    { id: 'microsoft/phi-3-mini-128k-instruct:free', label: 'Phi-3 Mini 128K (OpenRouter Gratis)' },
    { id: 'huggingfaceh4/zephyr-7b-beta:free', label: 'Zephyr 7B (OpenRouter Gratis)' },
    { id: 'gryphe/mythomax-l2-13b:free', label: 'MythoMax 13B (OpenRouter Gratis)' },
    { id: 'undi95/toppy-m-7b:free', label: 'Toppy M 7B (OpenRouter Gratis)' },
    // Premium
    { id: 'claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet (Premium)' },
    { id: 'gpt-4o', label: 'GPT-4o (Premium)' },
  ];

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get('/api/admin/config', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ai_settings = res.data.ai_settings || {};
        
        if (ai_settings.cascade_models && Array.isArray(ai_settings.cascade_models)) {
          setCascadeModels(ai_settings.cascade_models);
        } else if (ai_settings.primary_model) {
          const initCascade = [ai_settings.primary_model];
          if (ai_settings.fallback_model && ai_settings.cascade_enabled) {
            initCascade.push(ai_settings.fallback_model);
          }
          setCascadeModels(initCascade);
        }
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
        cascade_models: cascadeModels,
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

  const addModel = (modelId) => {
    if (!cascadeModels.includes(modelId)) {
      setCascadeModels([...cascadeModels, modelId]);
    }
  };

  const removeModel = (index) => {
    const newCascade = [...cascadeModels];
    newCascade.splice(index, 1);
    setCascadeModels(newCascade);
  };

  const moveModel = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === cascadeModels.length - 1) return;
    const newCascade = [...cascadeModels];
    const temp = newCascade[index];
    newCascade[index] = newCascade[index + direction];
    newCascade[index + direction] = temp;
    setCascadeModels(newCascade);
  };

  if (loading) return <div className="fade-in" style={{ padding: '2rem' }}>Cargando configuración de IA...</div>;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div className="flex-between">
          <div>
            <h1>IA & Cascada Optimizada</h1>
            <p style={{ color: 'var(--text-muted)' }}>Configuración del orden de ejecución (array) de modelos gratuitos y premium</p>
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
            <h2 style={{ fontSize: '1.2rem' }}>Tu Cascada (Orden de Ejecución)</h2>
          </div>
          
          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cascadeModels.length === 0 ? (
              <div style={{ padding: '12px', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No hay modelos en la cascada. Agrega desde la lista de la derecha.
              </div>
            ) : (
              cascadeModels.map((modelId, index) => {
                const modelDef = availableModels.find(m => m.id === modelId) || { label: modelId };
                return (
                  <div key={modelId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', fontSize: '12px', fontWeight: 'bold' }}>{index + 1}</span>
                      <span>{modelDef.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn btn-icon" onClick={() => moveModel(index, -1)} disabled={index === 0}><ArrowUp size={16} /></button>
                      <button className="btn btn-icon" onClick={() => moveModel(index, 1)} disabled={index === cascadeModels.length - 1}><ArrowDown size={16} /></button>
                      <button className="btn btn-icon" onClick={() => removeModel(index)} style={{ color: '#ef4444' }}><X size={16} /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div style={{ marginTop: '32px' }}>
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
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Modelos Disponibles</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
            {availableModels.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', opacity: cascadeModels.includes(m.id) ? 0.5 : 1 }}>
                <span>{m.label}</span>
                <button 
                  className="btn btn-glass btn-icon" 
                  onClick={() => addModel(m.id)}
                  disabled={cascadeModels.includes(m.id)}
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.2rem', marginTop: '32px', marginBottom: '16px' }}>System Prompts</h2>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Bot de Atención WhatsApp</label>
            <textarea 
              className="input-glass" 
              rows="4" 
              value={prompts.whatsapp || ""}
              onChange={(e) => setPrompts({...prompts, whatsapp: e.target.value})}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Analizador de Gastos</label>
            <textarea 
              className="input-glass" 
              rows="4" 
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
