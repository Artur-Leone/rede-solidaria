// Base de pontos reais e verificados de refúgio climático e ecopontos na RMR (Recife)
const PONTOS_RECIFE = [
  {
    id: 'pt-1',
    nome: 'Parque Treze de Maio (Área Arborizada)',
    tipo: 'SHADE',
    bairro: 'Santo Amaro',
    endereco: 'Rua do Hospício, Santo Amaro, Recife',
    latitude: -8.0583,
    longitude: -34.8819,
    descricao: 'Grande cobertura vegetal com sombra natural e bancos para descanso em área central.',
    verificado: true
  },
  {
    id: 'pt-2',
    nome: 'Marquise Av. Conde da Boa Vista (Lado Par)',
    tipo: 'SHADE',
    bairro: 'Boa Vista',
    endereco: 'Av. Conde da Boa Vista, Recife',
    latitude: -8.0601,
    longitude: -34.8876,
    descricao: 'Corredor comercial coberto com marquises contínuas protegendo do sol da tarde.',
    verificado: true
  },
  {
    id: 'pt-3',
    nome: 'Bebedouro Público Parque Dona Lindu',
    tipo: 'WATER_FOUNTAIN',
    bairro: 'Boa Viagem',
    endereco: 'Av. Boa Viagem, s/n, Recife',
    latitude: -8.1425,
    longitude: -34.9038,
    descricao: 'Ponto de água potável gelada acessível e gratuito para pedestres.',
    verificado: true
  },
  {
    id: 'pt-4',
    nome: 'Ecoponto Solidário Capibaribe Livre (Marco Zero)',
    tipo: 'ECOPONTO',
    bairro: 'Recife Antigo',
    endereco: 'Praça Barão do Rio Branco, Recife Antigo',
    latitude: -8.0631,
    longitude: -34.8711,
    descricao: 'Recebimento de garrafas PET e latinhas com troca imediata por água mineral e protetor solar.',
    verificado: true
  },
  {
    id: 'pt-5',
    nome: 'Compaz Dom Helder Camara (Refúgio Climatizado)',
    tipo: 'COOLING_CENTER',
    bairro: 'Ilha Joana Bezerra',
    endereco: 'Rua Lourenço Cavalcanti, Recife',
    latitude: -8.0772,
    longitude: -34.8988,
    descricao: 'Espaço público comunitário climatizado com água potável, banheiros e assistência social.',
    verificado: true
  },
  {
    id: 'pt-6',
    nome: 'Praça do Derby (Arborização Histórica)',
    tipo: 'SHADE',
    bairro: 'Derby',
    endereco: 'Praça do Derby, Recife',
    latitude: -8.0567,
    longitude: -34.8998,
    descricao: 'Árvores centenárias proporcionando conforto térmico significativo próximo ao terminal integrado.',
    verificado: true
  },
  {
    id: 'pt-7',
    nome: 'Ecoponto Mercado de Afogados',
    tipo: 'ECOPONTO',
    bairro: 'Afogados',
    endereco: 'Largo da Paz, Afogados, Recife',
    latitude: -8.0792,
    longitude: -34.9089,
    descricao: 'Ponto de coleta de recicláveis voltado a trabalhadores informais e feirantes.',
    verificado: true
  }
];

export class PointsService {
  static async listarTodos(filtros = {}) {
    let resultado = [...PONTOS_RECIFE];

    if (filtros.tipo) {
      resultado = resultado.filter(p => p.tipo.toUpperCase() === filtros.tipo.toUpperCase());
    }

    if (filtros.bairro) {
      resultado = resultado.filter(p => p.bairro.toLowerCase().includes(filtros.bairro.toLowerCase()));
    }

    return resultado;
  }

  static async buscarPorId(id) {
    const ponto = PONTOS_RECIFE.find(p => p.id === id);
    if (!ponto) {
      const error = new Error(`Ponto com ID '${id}' não encontrado`);
      error.statusCode = 404;
      throw error;
    }
    return ponto;
  }

  static async cadastrar(dados) {
    if (!dados.nome || !dados.tipo || dados.latitude === undefined || dados.longitude === undefined) {
      const error = new Error('Nome, tipo, latitude e longitude são obrigatórios');
      error.statusCode = 400;
      throw error;
    }

    const novoPonto = {
      id: `pt-${Date.now()}`,
      nome: dados.nome,
      tipo: dados.tipo,
      bairro: dados.bairro || 'Região Metropolitana',
      endereco: dados.endereco || null,
      latitude: Number(dados.latitude),
      longitude: Number(dados.longitude),
      descricao: dados.descricao || null,
      verificado: false,
      criadoEm: new Date().toISOString()
    };

    PONTOS_RECIFE.push(novoPonto);
    return novoPonto;
  }
}
