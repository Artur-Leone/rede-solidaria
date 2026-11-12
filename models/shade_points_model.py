"""Base de pontos verificados de sombra, bebedouros e refúgios térmicos em Recife."""

VERIFIED_POINTS = [
    {
        "id": "pt-1",
        "nome": "Parque Treze de Maio (Área Arborizada)",
        "tipo": "sombra",
        "bairro": "Santo Amaro",
        "rpa": "1",
        "endereco": "Rua do Hospício, Santo Amaro",
        "latitude": -8.0583,
        "longitude": -34.8819,
        "descricao": "Grande cobertura vegetal com sombra natural e bancos para descanso em área central.",
    },
    {
        "id": "pt-2",
        "nome": "Marquise Av. Conde da Boa Vista (Lado Par)",
        "tipo": "sombra",
        "bairro": "Boa Vista",
        "rpa": "1",
        "endereco": "Av. Conde da Boa Vista",
        "latitude": -8.0601,
        "longitude": -34.8876,
        "descricao": "Corredor comercial coberto com marquises contínuas protegendo do sol da tarde.",
    },
    {
        "id": "pt-3",
        "nome": "Bebedouro Público Parque Dona Lindu",
        "tipo": "bebedouro",
        "bairro": "Boa Viagem",
        "rpa": "6",
        "endereco": "Av. Boa Viagem, s/n",
        "latitude": -8.1425,
        "longitude": -34.9038,
        "descricao": "Ponto de água potável gelada e gratuita para pedestres.",
    },
    {
        "id": "pt-4",
        "nome": "Ecoponto Solidário Capibaribe Livre (Marco Zero)",
        "tipo": "ecoponto",
        "bairro": "Bairro do Recife",
        "rpa": "1",
        "endereco": "Praça Barão do Rio Branco",
        "latitude": -8.0631,
        "longitude": -34.8711,
        "descricao": "Recebimento de garrafas PET e latinhas com troca imediata por água mineral e protetor solar.",
    },
    {
        "id": "pt-5",
        "nome": "Compaz Dom Helder Camara (Refúgio Climatizado)",
        "tipo": "refugio",
        "bairro": "Ilha Joana Bezerra",
        "rpa": "1",
        "endereco": "Rua Lourenço Cavalcanti",
        "latitude": -8.0772,
        "longitude": -34.8988,
        "descricao": "Espaço comunitário climatizado com água potável, banheiros e assistência social.",
    },
    {
        "id": "pt-6",
        "nome": "Praça do Derby (Arborização Histórica)",
        "tipo": "sombra",
        "bairro": "Derby",
        "rpa": "3",
        "endereco": "Praça do Derby",
        "latitude": -8.0567,
        "longitude": -34.8998,
        "descricao": "Árvores centenárias proporcionando conforto térmico significativo próximo ao terminal integrado.",
    },
    {
        "id": "pt-7",
        "nome": "Ecoponto Mercado de Afogados",
        "tipo": "ecoponto",
        "bairro": "Afogados",
        "rpa": "5",
        "endereco": "Largo da Paz, Afogados",
        "latitude": -8.0792,
        "longitude": -34.9089,
        "descricao": "Ponto de coleta de recicláveis voltado a trabalhadores informais e feirantes.",
    },
]


class ShadePointsModel:
    @classmethod
    def list_all(cls, tipo: str | None = None, bairro: str | None = None) -> list[dict]:
        pontos = VERIFIED_POINTS
        if tipo:
            pontos = [p for p in pontos if p["tipo"].lower() == tipo.lower()]
        if bairro:
            pontos = [p for p in pontos if bairro.lower() in p["bairro"].lower()]
        return pontos
