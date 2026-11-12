import React, { useState } from 'react';
import { Recycle, Droplet, Shield, Award, CheckCircle2 } from 'lucide-react';
import { submitRecycleTrade } from '../services/api';

export function RecycleSection({ onTradeComplete }) {
  const [tipoItem, setTipoItem] = useState('GARRAFA_PET');
  const [quantidade, setQuantidade] = useState(6);
  const [ecoponto, setEcoponto] = useState('Ecoponto Marco Zero (Recife Antigo)');
  const [carregando, setCarregando] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState(null);

  // Cada PET = 5 pts, cada Latas = 6 pts
  const pontosCalculados = (tipoItem === 'GARRAFA_PET' ? 5 : 6) * Number(quantidade);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      const res = await submitRecycleTrade({
        cartaoCidadaoId: 'CIDADAO-RECIFE-01',
        tipoItem,
        quantidade: Number(quantidade),
        ecoponto
      });

      setSucessoMsg(res.dados || res);
      if (onTradeComplete) onTradeComplete(res);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="section-card" aria-label="Ecopontos e Reciclagem Solidária">
      <div className="section-title">
        <Recycle size={24} color="var(--secondary)" />
        <h2>Ecoponto Solidário & Proteção aos Mangues</h2>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        Toda garrafa PET e latinha entregue é retirada das ruas antes de entupir canais e poluir a bacia do <strong>Rio Capibaribe</strong>. Em troca, você ganha <strong>água mineral gelada e protetor solar</strong>.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
              Material a entregar:
            </label>
            <select
              value={tipoItem}
              onChange={(e) => setTipoItem(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '1rem'
              }}
            >
              <option value="GARRAFA_PET">🍾 Garrafas Plásticas PET (5 pts cada)</option>
              <option value="LATINHA_ALUMINIO">🥫 Latinhas de Alumínio (6 pts cada)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
              Quantidade de itens:
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
              Ecoponto de Entrega:
            </label>
            <select
              value={ecoponto}
              onChange={(e) => setEcoponto(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '1rem'
              }}
            >
              <option value="Ecoponto Marco Zero">Marco Zero (Recife Antigo)</option>
              <option value="Ecoponto Parque Treze de Maio">Parque Treze de Maio (Santo Amaro)</option>
              <option value="Ecoponto Mercado de Afogados">Mercado de Afogados</option>
              <option value="Compaz Dom Helder Camara">Compaz Dom Helder Camara</option>
            </select>
          </div>
        </div>

        {/* Resumo de Pontos e Recompensas */}
        <div
          style={{
            margin: '16px 0',
            padding: '14px',
            borderRadius: '10px',
            background: 'var(--secondary-light)',
            border: '2px solid var(--secondary)',
            color: '#064e3b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              +{pontosCalculados} Pontos Gerados
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              {pontosCalculados >= 30 ? (
                <span>🎉 <strong>Dá direito a: 1 Água Mineral Gelada 500ml</strong></span>
              ) : pontosCalculados >= 20 ? (
                <span>✨ <strong>Dá direito a: 1 Sachê Protetor Solar FPS 50</strong></span>
              ) : (
                <span>Faltam {30 - pontosCalculados} pontos para 1 Água Gelada</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            style={{ background: 'var(--secondary)', color: 'white' }}
          >
            <Award size={18} />
            <span>{carregando ? 'Registrando...' : 'Confirmar Entrega Solidária'}</span>
          </button>
        </div>
      </form>

      {sucessoMsg && (
        <div
          style={{
            marginTop: '12px',
            padding: '14px',
            borderRadius: '8px',
            background: '#ecfdf5',
            border: '2px solid #10b981',
            color: '#065f46'
          }}
          role="alert"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <CheckCircle2 size={20} color="#059669" />
            <span>Entrega validada com sucesso!</span>
          </div>
          <p style={{ marginTop: '4px', fontSize: '0.9rem' }}>
            Impacto: <strong>{sucessoMsg.impactoAmbiental || 'Resíduos recolhidos com sucesso'}</strong>
          </p>
          <p style={{ fontSize: '0.85rem', marginTop: '2px' }}>
            Recompensa liberada no balcão: <strong>{sucessoMsg.resgateSugerido || 'Água Mineral Gelada'}</strong>
          </p>
        </div>
      )}
    </section>
  );
}
