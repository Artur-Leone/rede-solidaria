import { config } from '../config/index.js';

export class HealthController {
  static getHealth(req, res) {
    res.status(200).json({
      sucesso: true,
      servico: 'Sombrinha API — Resiliência Climática RMR',
      status: 'online',
      versao: '1.0.0',
      ambiente: config.nodeEnv,
      timestamp: new Date().toISOString(),
      climaAtualRMR: {
        temperaturaC: 33.4,
        sensacaoTermicaC: 38.0,
        indiceUV: 11,
        alertaAtivo: true,
        aviso: 'Alerta de Calor Forte na Região Metropolitana do Recife. Procure rotas de sombra e hidrate-se.'
      }
    });
  }
}
