"""Modelo de incentivo à reciclagem e troca solidária por água e protetor solar."""

import json
import threading
from datetime import datetime, timezone
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "trocas.json"
DATA_LOCK = threading.Lock()

RECOMPENSAS = {
    "agua_mineral": {"nome": "Água Mineral Gelada 500ml", "pontos": 30},
    "protetor_solar": {"nome": "Sachê Protetor Solar FPS 50", "pontos": 20},
    "bone": {"nome": "Boné Protetor Solar", "pontos": 100},
}

VALORES_PONTOS = {
    "garrafa_pet": 5,    # Cada garrafa PET = 5 pts (6 garrafas = 1 água gelada)
    "latinha": 6,        # Latinha de alumínio = 6 pts
    "vidro": 4,
}


class RecycleModel:
    """Gerencia trocas de recicláveis e saldo do Cartão Cidadão."""

    @classmethod
    def _ensure_storage(cls) -> list[dict]:
        if not DATA_FILE.exists():
            DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
            DATA_FILE.write_text("[]", encoding="utf-8")
        try:
            return json.loads(DATA_FILE.read_text(encoding="utf-8"))
        except Exception:
            return []

    @classmethod
    def create_trade(cls, payload: dict) -> dict:
        item_tipo = payload.get("item_tipo", "garrafa_pet").lower()
        quantidade = int(payload.get("quantidade", 1))
        ecoponto = payload.get("ecoponto", "Ecoponto Central").strip()
        cartao_id = payload.get("cartao_id", "REC-CIDADAO-01").strip()

        if quantidade < 1:
            raise ValueError("A quantidade deve ser pelo menos 1.")

        pts_por_item = VALORES_PONTOS.get(item_tipo, 5)
        pontos_ganhos = pts_por_item * quantidade

        # Sugestão de resgate imediato
        resgate = None
        if pontos_ganhos >= RECOMPENSAS["agua_mineral"]["pontos"]:
            resgate = RECOMPENSAS["agua_mineral"]["nome"]
        elif pontos_ganhos >= RECOMPENSAS["protetor_solar"]["pontos"]:
            resgate = RECOMPENSAS["protetor_solar"]["nome"]

        registro = {
            "id": f"trc-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
            "cartao_id": cartao_id,
            "item_tipo": item_tipo,
            "quantidade": quantidade,
            "pontos_ganhos": pontos_ganhos,
            "resgate_sugerido": resgate,
            "ecoponto": ecoponto,
            "impacto_ambiental": f"{quantidade} embalagens retiradas da bacia do Rio Capibaribe",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        with DATA_LOCK:
            registros = cls._ensure_storage()
            registros.insert(0, registro)
            DATA_FILE.write_text(json.dumps(registros, ensure_ascii=False, indent=2), encoding="utf-8")

        return registro

    @classmethod
    def list_trades(cls) -> list[dict]:
        with DATA_LOCK:
            return cls._ensure_storage()

    @classmethod
    def get_catalog(cls) -> dict:
        return {
            "tabela_pontos": VALORES_PONTOS,
            "recompensas": RECOMPENSAS,
        }
