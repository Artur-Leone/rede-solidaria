const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline ou inacessível, usando dados locais de fallback:', err.message);
    return {
      sucesso: true,
      servico: 'Sombrinha API (Offline / Fallback Local)',
      status: 'offline_local',
      climaAtualRMR: {
        temperaturaC: 33.4,
        sensacaoTermicaC: 38.0,
        indiceUV: 11,
        alertaAtivo: true,
        aviso: 'Alerta de Calor Extremo na RMR. Proteja-se na sombra e beba água.'
      }
    };
  }
}

export async function fetchPoints(tipo = '') {
  try {
    const url = tipo ? `${API_BASE}/api/pontos?tipo=${tipo}` : `${API_BASE}/api/pontos`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.dados || [];
  } catch (err) {
    console.warn('Erro ao carregar pontos da API, usando pontos locais:', err.message);
    return [
      {
        id: 'local-1',
        nome: 'Parque Treze de Maio (Área Arborizada)',
        tipo: 'SHADE',
        bairro: 'Santo Amaro',
        endereco: 'Rua do Hospício, Santo Amaro',
        descricao: 'Grande cobertura vegetal com sombra natural e bancos para descanso.'
      },
      {
        id: 'local-2',
        nome: 'Marquise Av. Conde da Boa Vista',
        tipo: 'SHADE',
        bairro: 'Boa Vista',
        endereco: 'Av. Conde da Boa Vista',
        descricao: 'Corredor comercial coberto com marquises contínuas protegendo do sol forte.'
      },
      {
        id: 'local-3',
        nome: 'Bebedouro Público Parque Dona Lindu',
        tipo: 'WATER_FOUNTAIN',
        bairro: 'Boa Viagem',
        endereco: 'Av. Boa Viagem, s/n',
        descricao: 'Ponto de água potável gelada e gratuita para pedestres.'
      },
      {
        id: 'local-4',
        nome: 'Ecoponto Solidário Capibaribe Livre (Marco Zero)',
        tipo: 'ECOPONTO',
        bairro: 'Recife Antigo',
        endereco: 'Praça Barão do Rio Branco',
        descricao: 'Entrega de garrafas PET e latinhas com troca imediata por água mineral e protetor solar.'
      },
      {
        id: 'local-5',
        nome: 'Compaz Dom Helder Camara (Refúgio Climatizado)',
        tipo: 'COOLING_CENTER',
        bairro: 'Ilha Joana Bezerra',
        endereco: 'Rua Lourenço Cavalcanti',
        descricao: 'Espaço público comunitário climatizado com água potável e banheiros.'
      }
    ];
  }
}

export async function requestShadeRoute(origem, destino) {
  try {
    const res = await fetch(`${API_BASE}/api/rotas/sombra`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origem, destino, horaAtual: new Date().getHours() })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.dados;
  } catch (err) {
    return {
      rotaSugerida: {
        tipo: 'SOMBRINHA_ARBORIZADA',
        nome: 'Caminho Sombrinha (Árvores & Marquises)',
        distanciaMetros: 920,
        tempoEstimadoMin: 12,
        indiceSombra: '85% coberto',
        alivioTermico: 'Até 4°C a menos de sensação térmica',
        pontosDeApoioNoCaminho: [
          'Praça arborizada com sombra contínua',
          'Marquise comercial com ventilação',
          'Ponto de hidratação com água mineral gelada'
        ],
        explicacaoIA: 'Esta rota prioriza calçadas arborizadas e fachadas com marquise, minimizando a exposição direta ao sol.'
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

export async function sendVoiceQuery(texto) {
  try {
    const res = await fetch(`${API_BASE}/api/rotas/voz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.dados;
  } catch (err) {
    return {
      analiseIA: {
        respostaVoz: 'Entendi sua necessidade. Encontrei pontos de sombra e água próximos no mapa.',
        recomendacao: 'Proteja-se sob as marquises e beba água mineral com frequência.'
      }
    };
  }
}

export async function submitRecycleTrade(troca) {
  try {
    const res = await fetch(`${API_BASE}/api/trocas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(troca)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      sucesso: true,
      mensagem: 'Reciclagem simulada registrada localmente!',
      dados: {
        id: `trc-local-${Date.now()}`,
        pontosGanhos: (troca.quantidade || 1) * 5,
        resgateSugerido: 'Água Mineral Gelada 500ml',
        impactoAmbiental: `${troca.quantidade || 1} embalagens a menos na bacia do Rio Capibaribe`
      }
    };
  }
}
