import { TradesService } from '../services/trades.service.js';

export class TradesController {
  static async registrar(req, res, next) {
    try {
      const { cartaoCidadaoId, tipoItem, quantidade, ecoponto } = req.body;
      const troca = await TradesService.registrarTroca({
        cartaoCidadaoId,
        tipoItem,
        quantidade,
        ecoponto
      });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Reciclagem registrada com sucesso! Pontos computados.',
        dados: troca
      });
    } catch (error) {
      next(error);
    }
  }

  static async listar(req, res, next) {
    try {
      const historico = await TradesService.listarHistorico();
      res.status(200).json({
        sucesso: true,
        total: historico.length,
        dados: historico
      });
    } catch (error) {
      next(error);
    }
  }

  static catalogo(req, res) {
    res.status(200).json({
      sucesso: true,
      dados: TradesService.obterCatalogoRecompensas()
    });
  }
}
