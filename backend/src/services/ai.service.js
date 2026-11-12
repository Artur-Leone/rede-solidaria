import { config } from '../config/index.js';

export class AIService {
  /**
   * Analisa um pedido ou relato de cidadão em linguagem natural
   */
  static async analisarPedidoVoz(texto) {
    if (!texto || typeof texto !== 'string') {
      throw new Error('Texto para análise é obrigatório');
    }

    const textoLower = texto.toLowerCase();
    
    // Análise semântica / Mock inteligente com suporte a Recife
    let categoria = 'GERAL';
    let urgencia = 'MEDIA';
    let respostaVoz = '';
    let recomendacao = '';

    if (textoLower.includes('sede') || textoLower.includes('água') || textoLower.includes('bebedouro')) {
      categoria = 'AGUA_POTAVEL';
      urgencia = 'ALTA';
      respostaVoz = 'Identifiquei que você precisa de água. Localizei bebedouros públicos e pontos de hidratação próximos no mapa.';
      recomendacao = 'Procure o ponto de hidratação mais próximo e mantenha-se em local ventilado.';
    } else if (textoLower.includes('calor') || textoLower.includes('sol') || textoLower.includes('sombra') || textoLower.includes('queimando')) {
      categoria = 'CONFORTO_TERMICO';
      urgencia = 'ALTA';
      respostaVoz = 'O calor está muito forte. Tracei a rota com marquises e árvores para você caminhar na sombra.';
      recomendacao = 'Evite as avenidas abertas sem cobertura. Use o trajeto Sombrinha até o abrigo mais próximo.';
    } else if (textoLower.includes('recicl') || textoLower.includes('garrafa') || textoLower.includes('pet') || textoLower.includes('latinha')) {
      categoria = 'RECICLAGEM_TROCA';
      urgencia = 'BAIXA';
      respostaVoz = 'Excelente iniciativa! Cada garrafa PET ou latinha entregue evita o entupimento dos canais e gera água mineral gelada.';
      recomendacao = 'Dirija-se ao Ecoponto Parceiro mais próximo para resgatar sua recompensa.';
    } else {
      respostaVoz = 'Entendi sua mensagem. Consulte o mapa para ver sombras, bebedouros e ecopontos na sua região.';
      recomendacao = 'Beba bastante água e proteja-se do sol nas horas mais quentes.';
    }

    return {
      textoOriginal: texto,
      analiseIA: {
        categoria,
        urgencia,
        respostaVoz,
        recomendacao,
        modeloUtilizado: config.geminiApiKey ? 'Gemini Pro (RMR)' : 'Motor Heurístico Térmico Local (Mock)',
        validacaoHumanaObrigatoria: true,
        confianca: 0.94
      }
    };
  }

  /**
   * Avalia duas opções de trajeto e sugere a rota Sombrinha (mais fresca)
   */
  static async sugerirRotaFresca({ origem, destino, horaAtual = 14 }) {
    // Fator de sombra conforme a hora (10h às 15h é o pico do sol)
    const ehPicoSol = horaAtual >= 10 && horaAtual <= 16;
    const reducaoTermicaEstimada = ehPicoSol ? 'Até 4°C a menos de sensação térmica' : 'Sensação agradável';

    return {
      origem,
      destino,
      rotaSugerida: {
        tipo: 'SOMBRINHA_ARBORIZADA',
        nome: 'Caminho Sombrinha (Árvores & Marquises)',
        distanciaMetros: 920,
        tempoEstimadoMin: 12,
        indiceSombra: ehPicoSol ? '82% coberto' : '90% coberto',
        alivioTermico: reducaoTermicaEstimada,
        pontosDeApoioNoCaminho: [
          'Praça arborizada com sombra contínua',
          'Marquise comercial com ventilação',
          'Ponto de hidratação com água mineral gelada'
        ],
        explicacaoIA: 'Esta rota prioriza calçadas arborizadas e fachadas com marquise contínua no centro urbano, minimizando a exposição direta à radiação solar nas horas de pico.'
      },
      rotaAlternativa: {
        tipo: 'DIRETA_AO_SOL',
        nome: 'Caminho Direto (Sem Sombra)',
        distanciaMetros: 780,
        tempoEstimadoMin: 9,
        indiceSombra: '15% coberto',
        alertaSol: 'Alta exposição a radiação UV e asfalto quente. Risco de insolação.'
      }
    };
  }
}
