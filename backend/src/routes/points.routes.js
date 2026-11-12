import { Router } from 'express';
import { PointsController } from '../controllers/points.controller.js';

export const pointsRoutes = Router();

pointsRoutes.get('/pontos', PointsController.listar);
pointsRoutes.get('/pontos/:id', PointsController.obterPorId);
pointsRoutes.post('/pontos', PointsController.criar);
