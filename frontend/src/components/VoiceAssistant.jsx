import React, { useState } from 'react';
import { Mic, Volume2, Sparkles, Send, Loader2 } from 'lucide-react';
import { sendVoiceQuery } from '../services/api';

export function VoiceAssistant({ onVoiceResponse }) {
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [resposta, setResposta] = useState(null);
  const [ouvindo, setOuvindo] = useState(false);

  // Sintetizador de voz acessível
  const falarTexto = (frase) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(frase);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleConsultar = async (queryTexto) => {
    const q = queryTexto || texto;
    if (!q.trim()) return;

    setCarregando(true);
    try {
      const res = await sendVoiceQuery(q);
      setResposta(res.analiseIA);
      if (res.analiseIA?.respostaVoz) {
        falarTexto(res.analiseIA.respostaVoz);
      }
      if (onVoiceResponse) {
        onVoiceResponse(res);
      }
    } finally {
      setCarregando(false);
    }
  };

  const simularVoz = (frasePronta) => {
    setTexto(frasePronta);
    handleConsultar(frasePronta);
  };

  // Reconhecimento de voz real se suportado pelo navegador
  const alternarMicrofone = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      simularVoz('Tô no Derby com muita sede e muito calor');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setOuvindo(true);
      recognition.onend = () => setOuvindo(false);
      recognition.onerror = () => {
        setOuvindo(false);
        simularVoz('Onde tem água potável e sombra perto de mim?');
      };
      recognition.onresult = (event) => {
        const transcr = event.results[0][0].transcript;
        setTexto(transcr);
        handleConsultar(transcr);
      };

      recognition.start();
    } catch {
      simularVoz('Onde tem sombra e bebedouro no centro?');
    }
  };

  return (
    <section className="section-card" aria-label="Assistente de Voz Acessível">
      <div className="section-title">
        <Sparkles size={22} color="var(--primary)" />
        <h2>Assistente Acessível por Voz & Texto</h2>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '14px' }}>
        Fale ou digite como você está se sentindo. A IA orienta você para a sombra ou água mais próxima.
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ex: 'Tô com sede no Derby' ou 'Onde tem sombra?'"
          style={{
            flex: 1,
            minWidth: '220px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '2px solid var(--border-color)',
            fontSize: '1rem',
            background: 'var(--bg-card)',
            color: 'var(--text-main)'
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleConsultar()}
        />

        <button
          type="button"
          onClick={alternarMicrofone}
          style={{
            background: ouvindo ? '#ef4444' : 'var(--primary)',
            color: 'white'
          }}
          aria-label={ouvindo ? 'Ouvindo sua voz...' : 'Falar pelo microfone'}
        >
          <Mic size={20} />
          <span>{ouvindo ? 'Ouvindo...' : 'Falar'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleConsultar()}
          disabled={carregando}
          style={{ background: 'var(--text-main)', color: 'var(--bg-card)' }}
          aria-label="Enviar pergunta"
        >
          {carregando ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          <span>Consultar</span>
        </button>
      </div>

      {/* Sugestões rápidas para um toque */}
      <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="tab-btn"
          onClick={() => simularVoz('Tô na Conde da Boa Vista procurando bebedouro com água')}
          style={{ fontSize: '0.85rem', padding: '6px 12px', minHeight: '36px' }}
        >
          💧 "Onde tem bebedouro na Boa Vista?"
        </button>
        <button
          type="button"
          className="tab-btn"
          onClick={() => simularVoz('Quero a rota com mais árvores saindo do Derby')}
          style={{ fontSize: '0.85rem', padding: '6px 12px', minHeight: '36px' }}
        >
          🌳 "Rota com mais árvores saindo do Derby"
        </button>
      </div>

      {resposta && (
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            borderRadius: '10px',
            background: 'var(--primary-light)',
            border: '2px solid var(--primary)'
          }}
          role="status"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <strong style={{ color: 'var(--primary-dark)', fontSize: '1.05rem' }}>
              Orientação da IA Sombrinha:
            </strong>
            <button
              type="button"
              onClick={() => falarTexto(resposta.respostaVoz)}
              style={{
                background: 'var(--primary)',
                color: 'white',
                minHeight: '36px',
                padding: '4px 10px',
                fontSize: '0.85rem'
              }}
              title="Ouvir resposta novamente"
            >
              <Volume2 size={16} />
              <span>Ouvir</span>
            </button>
          </div>
          <p style={{ marginTop: '8px', fontSize: '1rem', fontWeight: 600 }}>
            {resposta.respostaVoz}
          </p>
          <p style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            💡 <em>{resposta.recomendacao}</em>
          </p>
        </div>
      )}
    </section>
  );
}
