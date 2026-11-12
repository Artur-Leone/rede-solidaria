import { AIService } from '../services/ai.service.js';

export class RoutesController {
  static async sugerirRota(req, res, next) {
    try {
      const { origem = 'Derby', destino = 'Marco Zero', horaAtual } = req.body;
      const sugestao = await AIService.sugerirRotaFresca({ origem, destino, horaAtual });
      
      res.status(200).json({
        sucesso: true,
        dados: sugestao
      });
    } catch (error) {
      next(error);
    }
  }

  static async analisarComandoVoz(req, res, next) {
    try {
      const { texto } = req.body;
      if (!texto) {
        return res.status(400).json({
          sucesso: false,
          erro: { mensagem: 'O campo texto é obrigatório para análise de voz' }
        });
      }

      const resultado = await AIService.analisarPedidoVoz(texto);
      res.status(200).json({
        sucesso: true,
        dados: resultado
      });
    } catch (error) {
      next(error);
    }
  }
}
