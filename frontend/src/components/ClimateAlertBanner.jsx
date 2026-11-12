import React from 'react';
import { AlertTriangle, Droplets, ThermometerSun, ShieldAlert } from 'lucide-react';

export function ClimateAlertBanner({ clima }) {
  if (!clima) return null;

  return (
    <aside className="alert-banner" role="region" aria-label="Alerta Climático Oficial">
      <div className="alert-info">
        <h3>
          <AlertTriangle size={24} aria-hidden="true" />
          <span>Alerta de Calor Extremo — RMR Recife</span>
        </h3>
        <p style={{ marginTop: '4px', fontSize: '0.95rem' }}>
          {clima.aviso || 'Radiação solar em níveis críticos. Utilize o mapa Sombrinha para caminhar por rotas arborizadas.'}
        </p>

        <div className="alert-badges">
          <span className="badge">
            <ThermometerSun size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Temperatura: {clima.temperaturaC}°C (Sensação {clima.sensacaoTermicaC}°C)
          </span>
          <span className="badge">
            Índice UV: {clima.uvIndex} (Extremo)
          </span>
          <span className="badge">
            <Droplets size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Hidratação Recomendada: +500ml/hora
          </span>
        </div>
      </div>
    </aside>
  );
}
