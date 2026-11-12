import { app } from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`☂️ Servidor Sombrinha rodando com sucesso!`);
  console.log(`📍 Porta: ${PORT}`);
  console.log(`🌍 Ambiente: ${config.nodeEnv}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});
