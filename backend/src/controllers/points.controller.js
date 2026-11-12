import { PointsService } from '../services/points.service.js';

export class PointsController {
  static async listar(req, res, next) {
    try {
      const { tipo, bairro } = req.query;
      const pontos = await PointsService.listarTodos({ tipo, bairro });
      res.status(200).json({
        sucesso: true,
        total: pontos.length,
        dados: pontos
      });
    } catch (error) {
      next(error);
    }
  }

  static async obterPorId(req, res, next) {
    try {
      const ponto = await PointsService.buscarPorId(req.params.id);
      res.status(200).json({
        sucesso: true,
        dados: ponto
      });
    } catch (error) {
      next(error);
    }
  }

  static async criar(req, res, next) {
    try {
      const novoPonto = await PointsService.cadastrar(req.body);
      res.status(201).json({
        sucesso: true,
        mensagem: 'Ponto cadastrado com sucesso e encaminhado para validação',
        dados: novoPonto
      });
    } catch (error) {
      next(error);
    }
  }
}
