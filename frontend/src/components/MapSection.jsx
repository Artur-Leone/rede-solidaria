import React, { useState } from 'react';
import { MapPin, Navigation, Compass, TreePine, Droplet, Recycle, Building, CheckCircle } from 'lucide-react';
import { requestShadeRoute } from '../services/api';

export function MapSection({ points = [] }) {
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [origem, setOrigem] = useState('Derby (Praça)');
  const [destino, setDestino] = useState('Marco Zero (Recife Antigo)');
  const [dadosRota, setDadosRota] = useState(null);
  const [carregandoRota, setCarregandoRota] = useState(false);

  const handleCalcularRota = async (e) => {
    e.preventDefault();
    setCarregandoRota(true);
    try {
      const res = await requestShadeRoute(origem, destino);
      setDadosRota(res);
    } finally {
      setCarregandoRota(false);
    }
  };

  const pontosFiltrados = points.filter((p) => {
    if (filtroTipo === 'TODOS') return true;
    return p.tipo === filtroTipo;
  });

  const getTagInfo = (tipo) => {
    switch (tipo) {
      case 'SHADE':
        return { label: '🌳 Sombra / Arborização', className: 'tag-shade' };
      case 'WATER_FOUNTAIN':
        return { label: '💧 Bebedouro Público', className: 'tag-water' };
      case 'ECOPONTO':
        return { label: '♻️ Ecoponto Solidário', className: 'tag-ecopoint' };
      case 'COOLING_CENTER':
        return { label: '❄️ Refúgio Climatizado', className: 'tag-cooling' };
      default:
        return { label: 'Ponto de Apoio', className: 'tag-shade' };
    }
  };

  return (
    <section className="section-card" aria-label="Mapa e Rotas Térmicas">
      <div className="section-title">
        <Compass size={24} color="var(--primary)" />
        <h2>Mapa Térmico & Rota da Sombrinha</h2>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        Em vez de traçar o caminho mais curto, a IA calcula a rota com <strong>maior cobertura de árvores e marquises</strong>, evitando o asfalto quente.
      </p>

      {/* Formulário de Trajeto */}
      <form onSubmit={handleCalcularRota} style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
            Origem:
          </label>
          <input
            type="text"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)'
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
            Destino:
          </label>
          <input
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)'
            }}
          />
        </div>

        <div style={{ alignSelf: 'flex-end' }}>
          <button
            type="submit"
            disabled={carregandoRota}
            style={{ background: 'var(--secondary)', color: 'white' }}
          >
            <Navigation size={18} />
            <span>{carregandoRota ? 'Calculando...' : 'Traçar Rota na Sombra'}</span>
          </button>
        </div>
      </form>

      {/* Comparativo de Rotas */}
      {dadosRota && (
        <div className="route-comparison">
          <div className="route-card route-shady">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
              <TreePine size={20} />
              <span>{dadosRota.rotaSugerida.nome}</span>
            </h4>
            <div style={{ margin: '8px 0', fontSize: '1.25rem', fontWeight: 800 }}>
              {dadosRota.rotaSugerida.indiceSombra} de Sombra
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
              ✅ <strong>{dadosRota.rotaSugerida.alivioTermico}</strong>
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              Distância: {dadosRota.rotaSugerida.distanciaMetros}m • Tempo a pé: ~{dadosRota.rotaSugerida.tempoEstimadoMin} min
            </p>
            <ul style={{ marginTop: '8px', paddingLeft: '18px', fontSize: '0.85rem' }}>
              {dadosRota.rotaSugerida.pontosDeApoioNoCaminho?.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>

          <div className="route-card route-sunny">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem' }}>
              <span>☀️ {dadosRota.rotaAlternativa.nome}</span>
            </h4>
            <div style={{ margin: '8px 0', fontSize: '1.25rem', fontWeight: 800 }}>
              {dadosRota.rotaAlternativa.indiceSombra} de Sombra
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
              ⚠️ {dadosRota.rotaAlternativa.alertaSol}
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              Distância: {dadosRota.rotaAlternativa.distanciaMetros}m • Tempo a pé: ~{dadosRota.rotaAlternativa.tempoEstimadoMin} min
            </p>
          </div>
        </div>
      )}

      {/* Filtros de Pontos */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
          📍 Pontos Oficiais de Apoio na RMR ({pontosFiltrados.length})
        </h3>
        <div className="tabs-nav" role="tablist">
          <button
            type="button"
            className={`tab-btn ${filtroTipo === 'TODOS' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('TODOS')}
          >
            Todos
          </button>
          <button
            type="button"
            className={`tab-btn ${filtroTipo === 'SHADE' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('SHADE')}
          >
            🌳 Sombras & Árvores
          </button>
          <button
            type="button"
            className={`tab-btn ${filtroTipo === 'WATER_FOUNTAIN' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('WATER_FOUNTAIN')}
          >
            💧 Bebedouros
          </button>
          <button
            type="button"
            className={`tab-btn ${filtroTipo === 'ECOPONTO' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('ECOPONTO')}
          >
            ♻️ Ecopontos
          </button>
          <button
            type="button"
            className={`tab-btn ${filtroTipo === 'COOLING_CENTER' ? 'active' : ''}`}
            onClick={() => setFiltroTipo('COOLING_CENTER')}
          >
            ❄️ Compaz / Refúgio
          </button>
        </div>

        <div className="points-list">
          {pontosFiltrados.map((p) => {
            const tag = getTagInfo(p.tipo);
            return (
              <article key={p.id} className="point-item">
                <span className={`point-tag ${tag.className}`}>{tag.label}</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '4px 0' }}>{p.nome}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  📍 {p.bairro} — {p.endereco}
                </p>
                <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>{p.descricao}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
