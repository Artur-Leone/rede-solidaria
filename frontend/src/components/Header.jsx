import React from 'react';
import { Sun, Moon, CreditCard, ShieldCheck } from 'lucide-react';

export function Header({ isSolExtremo, onToggleSolExtremo, onOpenCitizenCard, backendStatus }) {
  return (
    <header className="app-header">
      <div className="container header-content">
        <div className="brand">
          <span className="brand-icon" role="img" aria-label="Sombrinha de Frevo">☂️</span>
          <div>
            <h1 className="brand-title">Sombrinha</h1>
            <span className="brand-subtitle">
              Resiliência Climática & Sombra Solidária • Recife
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-contrast"
            onClick={onToggleSolExtremo}
            aria-pressed={isSolExtremo}
            title="Alternar modo de alto contraste para leitura sob sol forte"
          >
            <Sun size={20} />
            <span>{isSolExtremo ? 'Modo Normal' : 'Modo Sol Forte'}</span>
          </button>

          <button
            type="button"
            className="btn-citizen-card"
            onClick={onOpenCitizenCard}
            title="Acessar Cartão Solidário (Inclusão para quem não tem celular)"
          >
            <CreditCard size={20} />
            <span>Cartão Cidadão</span>
          </button>
        </div>
      </div>
    </header>
  );
}
