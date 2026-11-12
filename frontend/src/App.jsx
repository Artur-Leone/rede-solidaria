import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ClimateAlertBanner } from './components/ClimateAlertBanner';
import { VoiceAssistant } from './components/VoiceAssistant';
import { MapSection } from './components/MapSection';
import { RecycleSection } from './components/RecycleSection';
import { CitizenCardModal } from './components/CitizenCardModal';
import { checkHealth, fetchPoints } from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [isSolExtremo, setIsSolExtremo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendData, setBackendData] = useState(null);
  const [pontos, setPontos] = useState([]);
  const [saldoPontos, setSaldoPontos] = useState(45);

  // Alterna a classe sol-extremo no body para alto contraste
  const toggleSolExtremo = () => {
    setIsSolExtremo((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('sol-extremo');
      } else {
        document.body.classList.remove('sol-extremo');
      }
      return next;
    });
  };

  useEffect(() => {
    async function loadData() {
      const health = await checkHealth();
      setBackendData(health);

      const pts = await fetchPoints();
      setPontos(pts);
    }
    loadData();
  }, []);

  const handleTradeComplete = (res) => {
    if (res.dados?.pontosGanhos) {
      setSaldoPontos((prev) => prev + res.dados.pontosGanhos);
    }
  };

  return (
    <div className="app-layout">
      <Header
        isSolExtremo={isSolExtremo}
        onToggleSolExtremo={toggleSolExtremo}
        onOpenCitizenCard={() => setIsModalOpen(true)}
        backendStatus={backendData?.status}
      />

      <main className="container" id="main-content">
        {/* Status de Conexão com a API */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', fontSize: '0.8rem', marginTop: '8px' }}>
          {backendData?.status === 'online' ? (
            <>
              <CheckCircle2 size={14} color="#10b981" />
              <span style={{ color: '#059669', fontWeight: 600 }}>API Sombrinha Online (RMR)</span>
            </>
          ) : (
            <>
              <AlertCircle size={14} color="#f59e0b" />
              <span style={{ color: '#d97706', fontWeight: 600 }}>Modo Offline Resiliente (Local)</span>
            </>
          )}
        </div>

        {/* 1. Alerta de Calor Extremo na RMR */}
        <ClimateAlertBanner clima={backendData?.climaAtualRMR} />

        {/* 2. Assistente por Voz / Texto Acessível */}
        <VoiceAssistant />

        {/* 3. Mapa de Sombras e Trajetos Frescos */}
        <MapSection points={pontos} />

        {/* 4. Ecoponto & Proteção do Capibaribe */}
        <RecycleSection onTradeComplete={handleTradeComplete} />
      </main>

      {/* Modal do Cartão Cidadão Solidário (Inclusão analógica) */}
      <CitizenCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        saldoPontos={saldoPontos}
      />

      <footer className="app-footer">
        <div className="container">
          <p>
            <strong>Sombrinha ☂️</strong> — Hackathon Antena na Lama (APONTI Academy & Movimento Pró-Criança)
          </p>
          <p style={{ marginTop: '4px', opacity: 0.8 }}>
            Desenvolvido por Artur Leone & Madu Barretto • Recife/PE
          </p>
        </div>
      </footer>
    </div>
  );
}
