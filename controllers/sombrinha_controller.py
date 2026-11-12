"""Controlador para as rotas do projeto Sombrinha (Reciclagem, Pontos de Sombra e IA)."""

from datetime import datetime, timezone
from flask import Blueprint, jsonify, request

from models.ai_model import AIModel
from models.recycle_model import RecycleModel
from models.shade_points_model import ShadePointsModel

sombrinha_blueprint = Blueprint("sombrinha", __name__)


@sombrinha_blueprint.get("/api/health")
def health_check():
    return jsonify({
        "sucesso": True,
        "servico": "Sombrinha ☂️ • Bairro que Cuida (API RMR)",
        "status": "online",
        "versao": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "clima_rmr": {
            "temperatura_c": 33.4,
            "sensacao_termica_c": 38.0,
            "indice_uv": 11,
            "alerta_ativo": True,
            "aviso": "Alerta de Calor Forte em Recife. Procure rotas de sombra e hidrate-se.",
        },
    })


@sombrinha_blueprint.get("/api/verified-points")
def list_verified_points():
    tipo = request.args.get("tipo")
    bairro = request.args.get("bairro")
    pontos = ShadePointsModel.list_all(tipo, bairro)
    return jsonify({"sucesso": True, "total": len(pontos), "dados": pontos})


@sombrinha_blueprint.post("/api/trades")
def create_trade():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"erro": "Envie os dados da troca em JSON."}), 400
    try:
        registro = RecycleModel.create_trade(payload)
        return jsonify({"sucesso": True, "mensagem": "Reciclagem confirmada!", "dados": registro}), 201
    except ValueError as err:
        return jsonify({"erro": str(err)}), 400


@sombrinha_blueprint.get("/api/trades")
def list_trades():
    return jsonify({"sucesso": True, "dados": RecycleModel.list_trades()})


@sombrinha_blueprint.get("/api/trades/catalog")
def get_catalog():
    return jsonify({"sucesso": True, "dados": RecycleModel.get_catalog()})


@sombrinha_blueprint.post("/api/routes/shade")
def suggest_shade_route():
    payload = request.get_json(silent=True) or {}
    origem = payload.get("origem", "Derby")
    destino = payload.get("destino", "Marco Zero")
    hora = payload.get("hora", datetime.now().hour)
    resultado = AIModel.suggest_shade_route(origem, destino, hora)
    return jsonify({"sucesso": True, "dados": resultado})


@sombrinha_blueprint.post("/api/ai/voice")
def analyze_voice():
    payload = request.get_json(silent=True) or {}
    texto = payload.get("texto", "")
    if not texto:
        return jsonify({"erro": "O campo 'texto' é obrigatório."}), 400
    try:
        analise = AIModel.analyze_voice_text(texto)
        return jsonify({"sucesso": True, "dados": analise})
    except ValueError as err:
        return jsonify({"erro": str(err)}), 400
