import { Router } from 'express';
import { TradesController } from '../controllers/trades.controller.js';

export const tradesRoutes = Router();

tradesRoutes.post('/trocas', TradesController.registrar);
tradesRoutes.get('/trocas', TradesController.listar);
tradesRoutes.get('/trocas/catalogo', TradesController.catalogo);
