import React from 'react';
import { X, QrCode, Heart, Sparkles, Check } from 'lucide-react';

export function CitizenCardModal({ isOpen, onClose, saldoPontos = 45 }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Cartão Solidário do Cidadão">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💳 Cartão Cidadão Solidário</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', color: 'var(--text-main)', padding: '6px' }}
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        <p style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Inclusão real: trabalhadores informais, catadores e crianças atendidas pelo <strong>Movimento Pró-Criança</strong> recebem esse cartão impresso para trocar recicláveis por água e protetor mesmo sem celular.
        </p>

        {/* Prévia do Cartão Físico */}
        <div
          style={{
            marginTop: '16px',
            background: 'linear-gradient(135deg, #0284c7, #0f766e)',
            borderRadius: '16px',
            padding: '20px',
            color: 'white',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>PROJETO SOMBRINHA • RMR</span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Cartão da Cidadania Térmica</h4>
            </div>
            <span style={{ fontSize: '1.8rem' }}>☂️</span>
          </div>

          <div style={{ margin: '20px 0', textAlign: 'center' }}>
            {/* Simulação de QR Code */}
            <div
              style={{
                display: 'inline-block',
                background: 'white',
                padding: '12px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  background: '#1e293b',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  gap: '4px'
                }}
              >
                <QrCode size={48} color="#38bdf8" />
                <span>ID: REC-9482</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>BENEFICIÁRIO:</span>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Manoel da Silva (Afogados)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>SALDO DISPONÍVEL:</span>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fef08a' }}>{saldoPontos} Pts</div>
            </div>
          </div>
        </div>

        {/* Como funciona */}
        <div style={{ marginTop: '16px', background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
          <strong>Como funciona na prática:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '6px', lineHeight: 1.4 }}>
            <li>O voluntário ou comerciante parceiro lê este QR Code com a câmera do celular.</li>
            <li>O saldo é creditado ou debitado imediatamente.</li>
            <li>A água gelada é entregue na hora ao beneficiário.</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{ width: '100%', marginTop: '16px', background: 'var(--primary)', color: 'white' }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
