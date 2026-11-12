const RECOMPENSAS = {
  AGUA_MINERAL: { nome: 'Água Mineral Gelada 500ml', pontosNecessarios: 30 },
  PROTETOR_SOLAR: { nome: 'Sachê Protetor Solar FPS 50', pontosNecessarios: 20 },
  BONE_PROTETOR: { nome: 'Boné Protetor Solar', pontosNecessarios: 100 }
};

const TABELA_PONTOS = {
  GARRAFA_PET: 5,   // Cada garrafa PET = 5 pontos (6 garrafas = 1 água)
  LATINHA_ALUMINIO: 6,
  VIDRO: 4,
  OUTRO: 2
};

const HISTORICO_TROCAS = [];

export class TradesService {
  static async registrarTroca({ cartaoCidadaoId = 'ANONIMO', tipoItem = 'GARRAFA_PET', quantidade = 1, ecoponto = 'Ecoponto Central' }) {
    if (!quantidade || quantidade < 1) {
      const error = new Error('Quantidade inválida para reciclagem');
      error.statusCode = 400;
      throw error;
    }

    const valorPorItem = TABELA_PONTOS[tipoItem.toUpperCase()] || TABELA_PONTOS.GARRAFA_PET;
    const pontosGanhos = valorPorItem * quantidade;

    // Sugestão de resgate imediato se atingir o mínimo
    let resgateSugerido = null;
    if (pontosGanhos >= RECOMPENSAS.AGUA_MINERAL.pontosNecessarios) {
      resgateSugerido = RECOMPENSAS.AGUA_MINERAL.nome;
    } else if (pontosGanhos >= RECOMPENSAS.PROTETOR_SOLAR.pontosNecessarios) {
      resgateSugerido = RECOMPENSAS.PROTETOR_SOLAR.nome;
    }

    const registro = {
      id: `trc-${Date.now()}`,
      cartaoCidadaoId,
      tipoItem,
      quantidade,
      pontosGanhos,
      resgateSugerido,
      ecoponto,
      impactoAmbiental: `${quantidade} embalagens a menos na bacia do Rio Capibaribe`,
      criadoEm: new Date().toISOString()
    };

    HISTORICO_TROCAS.unshift(registro);
    return registro;
  }

  static async listarHistorico() {
    return HISTORICO_TROCAS;
  }

  static obterCatalogoRecompensas() {
    return {
      tabelaPontos: TABELA_PONTOS,
      recompensas: RECOMPENSAS
    };
  }
}
