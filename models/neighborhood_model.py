"""Lista oficial de bairros do Recife, agrupados por RPA."""

NEIGHBORHOODS_BY_RPA = {
    "1": ["Bairro do Recife", "Boa Vista", "Cabanga", "Coelhos", "Ilha do Leite", "Ilha Joana Bezerra", "Paissandu", "Santo Amaro", "Santo Antônio", "São José", "Soledade"],
    "2": ["Água Fria", "Alto Santa Terezinha", "Arruda", "Beberibe", "Bomba do Hemetério", "Cajueiro", "Campina do Barreto", "Campo Grande", "Dois Unidos", "Encruzilhada", "Fundão", "Hipódromo", "Linha do Tiro", "Peixinhos", "Ponto de Parada", "Porto da Madeira", "Rosarinho", "Torreão"],
    "3": ["Aflitos", "Alto do Mandu", "Alto José Bonifácio", "Alto José do Pinho", "Apipucos", "Brejo da Guabiraba", "Brejo de Beberibe", "Casa Amarela", "Casa Forte", "Córrego do Jenipapo", "Derby", "Dois Irmãos", "Espinheiro", "Graças", "Guabiraba", "Jaqueira", "Macaxeira", "Mangabeira", "Monteiro", "Morro da Conceição", "Nova Descoberta", "Parnamirim", "Passarinho", "Pau-Ferro", "Poço da Panela", "Santana", "Sítio dos Pintos", "Tamarineira", "Vasco da Gama"],
    "4": ["Caxangá", "Cidade Universitária", "Cordeiro", "Engenho do Meio", "Ilha do Retiro", "Iputinga", "Madalena", "Prado", "Torre", "Torrões", "Várzea", "Zumbi"],
    "5": ["Afogados", "Areias", "Barro", "Bongi", "Caçote", "Coqueiral", "Curado", "Estância", "Jardim São Paulo", "Jiquiá", "Mangueira", "Mustardinha", "San Martin", "Sancho", "Tejipió", "Totó"],
    "6": ["Boa Viagem", "Brasília Teimosa", "Cohab", "Ibura", "Imbiribeira", "Ipsep", "Jordão", "Pina"],
}

RECIFE_NEIGHBORHOODS = {
    name for names in NEIGHBORHOODS_BY_RPA.values() for name in names
}
