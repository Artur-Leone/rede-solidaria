import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { healthRoutes } from './routes/health.routes.js';
import { pointsRoutes } from './routes/points.routes.js';
import { routesRoutes } from './routes/routes.routes.js';
import { tradesRoutes } from './routes/trades.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

export const app = express();

// Middlewares globais
app.use(cors({
  origin: config.corsOrigin === '*' ? true : [config.corsOrigin, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Boas-vindas na raiz
app.get('/', (req, res) => {
  res.status(200).json({
    projeto: 'Sombrinha ☂️',
    descricao: 'Resiliência Climática e Cuidado Social na Região Metropolitana do Recife',
    hackathon: 'Antena na Lama — APONTI Academy & Movimento Pró-Criança',
    endpoints: {
      saude: '/api/health',
      pontosDeSombraEBebedouros: '/api/pontos',
      sugestaoDeRotaFresca: 'POST /api/rotas/sombra',
      analiseDeVoz: 'POST /api/rotas/voz',
      registroDeReciclagem: 'POST /api/trocas',
      catalogoRecompensas: '/api/trocas/catalogo'
    }
  });
});

// Rotas da API
app.use('/api', healthRoutes);
app.use('/api', pointsRoutes);
app.use('/api', routesRoutes);
app.use('/api', tradesRoutes);

// Tratamento de rotas inexistentes (404)
app.use(notFoundHandler);

// Tratamento global de erros (500)
app.use(errorHandler);
