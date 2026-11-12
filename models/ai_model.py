"""Serviço de Inteligência Artificial para roteamento térmico e assistência de voz."""

import os
from datetime import datetime


class AIModel:
    @staticmethod
    def analyze_voice_text(texto: str) -> dict:
        if not texto or not isinstance(texto, str):
            raise ValueError("Texto para análise é obrigatório.")

        t = texto.lower()

        if any(w in t for w in ["sede", "água", "agua", "bebedouro", "beber"]):
            categoria = "AGUA_POTAVEL"
            resposta_voz = "Identifiquei que você precisa de água. Encontrei bebedouros públicos e pontos de hidratação próximos no mapa."
            recomendacao = "Procure o bebedouro mais próximo e mantenha-se em local ventilado."
        elif any(w in t for w in ["calor", "sol", "sombra", "queimando", "quente"]):
            categoria = "CONFORTO_TERMICO"
            resposta_voz = "O calor está muito forte. Tracei o Caminho Sombrinha com marquises e árvores para você andar protegido."
            recomendacao = "Evite avenidas abertas sem cobertura. Use o trajeto Sombrinha até o abrigo mais próximo."
        elif any(w in t for w in ["recicl", "garrafa", "pet", "latinha", "lixo"]):
            categoria = "RECICLAGEM_SOLIDARIA"
            resposta_voz = "Excelente! Cada garrafa PET ou latinha entregue evita o entupimento dos canais e gera água mineral gelada."
            recomendacao = "Dirija-se ao Ecoponto Parceiro mais próximo para resgatar sua água ou protetor solar."
        else:
            categoria = "GERAL"
            resposta_voz = "Entendi sua mensagem. Consulte o mapa para ver sombras, bebedouros e ecopontos em Recife."
            recomendacao = "Beba bastante água e proteja-se do sol nas horas de pico."

        return {
            "texto_original": texto,
            "categoria": categoria,
            "resposta_voz": resposta_voz,
            "recomendacao": recomendacao,
            "modelo": "Motor Heurístico Térmico Local (Sombrinha RMR)",
        }

    @staticmethod
    def suggest_shade_route(origem: str = "Derby", destino: str = "Marco Zero", hora: int = 14) -> dict:
        eh_pico_sol = 10 <= hora <= 16
        alivio = "Até 4°C a menos de sensação térmica" if eh_pico_sol else "Sensação agradável"

        return {
            "origem": origem,
            "destino": destino,
            "rota_sugerida": {
                "tipo": "SOMBRINHA_ARBORIZADA",
                "nome": "Caminho Sombrinha (Árvores & Marquises)",
                "distancia_metros": 920,
                "tempo_min": 12,
                "indice_sombra": "85% coberto",
                "alivio_termico": alivio,
                "pontos_apoio": [
                    "Praça arborizada com sombra contínua",
                    "Marquise comercial com ventilação",
                    "Ponto de hidratação com água mineral gelada",
                ],
                "explicacao_ia": "Esta rota prioriza calçadas arborizadas e fachadas com marquises contínuas no centro urbano, minimizando a exposição direta ao sol.",
            },
            "rota_alternativa": {
                "tipo": "DIRETA_AO_SOL",
                "nome": "Caminho Direto (Sem Sombra)",
                "distancia_metros": 780,
                "tempo_min": 9,
                "indice_sombra": "15% coberto",
                "alerta_sol": "Alta exposição a radiação UV e asfalto quente. Risco de insolação.",
            },
        }
