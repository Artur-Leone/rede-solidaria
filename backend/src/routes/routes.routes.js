import { Router } from 'express';
import { RoutesController } from '../controllers/routes.controller.js';

export const routesRoutes = Router();

routesRoutes.post('/rotas/sombra', RoutesController.sugerirRota);
routesRoutes.post('/rotas/voz', RoutesController.analisarComandoVoz);
