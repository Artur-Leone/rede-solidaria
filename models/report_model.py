"""Validação, persistência e agregação dos relatos comunitários."""

import json
import math
import os
import re
import threading
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

from models.neighborhood_model import RECIFE_NEIGHBORHOODS


DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "relatos.json"
DATA_LOCK = threading.Lock()

REPORT_TYPES = {
    "quente_sem_sombra": {"label": "Lugar muito quente ou sem sombra", "weight": 1.0},
    "precisa_sombra": {"label": "Espaço que poderia receber mais sombra", "weight": 0.8},
    "ponto_refresco": {"label": "Sugestão de local para ponto de refresco", "weight": 0.6},
    "espaco_verde": {"label": "Área verde que precisa de cuidado", "weight": 0.5},
}


class ReportModel:
    """Representa operações de leitura e escrita dos relatos."""

    @staticmethod
    def database_url() -> str | None:
        url = os.environ.get("DATABASE_URL")
        if url and url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql://", 1)
        return url

    @classmethod
    def _open_database(cls):
        import psycopg

        return psycopg.connect(cls.database_url())

    @classmethod
    def initialize_database(cls) -> None:
        if not cls.database_url():
            return
        with cls._open_database() as connection:
            connection.execute(
                """CREATE TABLE IF NOT EXISTS community_reports (
                    id BIGSERIAL PRIMARY KEY,
                    location TEXT NOT NULL,
                    neighborhood TEXT NOT NULL,
                    reference TEXT NOT NULL,
                    latitude DOUBLE PRECISION NOT NULL,
                    longitude DOUBLE PRECISION NOT NULL,
                    kind TEXT NOT NULL,
                    note TEXT NOT NULL DEFAULT '',
                    created_at TEXT NOT NULL
                )"""
            )

    @classmethod
    def all(cls) -> list[dict]:
        if cls.database_url():
            with cls._open_database() as connection:
                rows = connection.execute(
                    """SELECT location, neighborhood, reference, latitude, longitude,
                              kind, note, created_at
                       FROM community_reports ORDER BY id"""
                ).fetchall()
            columns = (
                "location", "neighborhood", "reference", "latitude", "longitude",
                "kind", "note", "created_at",
            )
            return [dict(zip(columns, row)) for row in rows]

        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        if not DATA_FILE.exists():
            return []
        try:
            content = json.loads(DATA_FILE.read_text(encoding="utf-8"))
            return content if isinstance(content, list) else []
        except (json.JSONDecodeError, OSError):
            return []

    @classmethod
    def create(cls, payload: dict) -> None:
        neighborhood = str(payload.get("neighborhood", "")).strip()
        reference = str(payload.get("reference", "")).strip()
        kind = str(payload.get("kind", "")).strip()
        note = str(payload.get("note", "")).strip()

        try:
            latitude = float(payload.get("latitude"))
            longitude = float(payload.get("longitude"))
        except (TypeError, ValueError):
            raise ValueError("Marque o local aproximado no mapa.")

        if not math.isfinite(latitude) or not math.isfinite(longitude):
            raise ValueError("As coordenadas do local são inválidas.")
        if not -90 <= latitude <= 90 or not -180 <= longitude <= 180:
            raise ValueError("As coordenadas do local são inválidas.")
        if neighborhood not in RECIFE_NEIGHBORHOODS:
            raise ValueError("Selecione um dos bairros do Recife.")
        if not reference or len(reference) > 80:
            raise ValueError("Informe um ponto de referência público (até 80 caracteres).")
        if kind not in REPORT_TYPES:
            raise ValueError("Escolha uma das opções de situação.")
        if len(note) > 240:
            raise ValueError("Os detalhes podem ter até 240 caracteres.")

        report = {
            "location": f"{neighborhood} — {reference}",
            "neighborhood": neighborhood,
            "reference": reference,
            "latitude": latitude,
            "longitude": longitude,
            "kind": kind,
            "note": note,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        with DATA_LOCK:
            if cls.database_url():
                with cls._open_database() as connection:
                    connection.execute(
                        """INSERT INTO community_reports
                           (location, neighborhood, reference, latitude, longitude, kind, note, created_at)
                           VALUES (%(location)s, %(neighborhood)s, %(reference)s, %(latitude)s,
                                   %(longitude)s, %(kind)s, %(note)s, %(created_at)s)""",
                        report,
                    )
            else:
                reports = cls.all()
                reports.append(report)
                DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
                temp_file = DATA_FILE.with_suffix(".tmp")
                temp_file.write_text(
                    json.dumps(reports, ensure_ascii=False, indent=2), encoding="utf-8"
                )
                temp_file.replace(DATA_FILE)

    @classmethod
    def summary(cls) -> dict:
        reports = cls.all()
        return {"total_reports": len(reports), "locations": cls._build_summary(reports)}

    @classmethod
    def _build_summary(cls, reports: list[dict]) -> list[dict]:
        now = datetime.now(timezone.utc)
        groups: dict[str, list[dict]] = {}
        for report in reports:
            latitude = report.get("latitude")
            longitude = report.get("longitude")
            if isinstance(latitude, (int, float)) and isinstance(longitude, (int, float)):
                key = f"geo:{round(latitude, 3)}:{round(longitude, 3)}"
            else:
                key = f"text:{cls._normalize_location(report.get('location', ''))}"
            if key:
                groups.setdefault(key, []).append(report)

        result = []
        for entries in groups.values():
            recent_count = 0
            weighted_need = 0.0
            newest = ""
            for entry in entries:
                weighted_need += REPORT_TYPES.get(entry.get("kind"), {}).get("weight", 0)
                created = entry.get("created_at", "")
                newest = max(newest, created)
                try:
                    timestamp = datetime.fromisoformat(created)
                    if (now - timestamp).total_seconds() <= 30 * 24 * 3600:
                        recent_count += 1
                except (TypeError, ValueError):
                    pass

            volume_score = min(len(entries) / 5, 1) * 55
            need_score = min(weighted_need / max(len(entries), 1), 1) * 25
            recent_score = min(recent_count / 5, 1) * 20
            labels = [
                REPORT_TYPES.get(entry.get("kind"), {}).get("label", "Relato")
                for entry in entries
            ]
            counts = {label: labels.count(label) for label in dict.fromkeys(labels)}
            main_issue = max(counts, key=counts.get) if counts else "Relatos comunitários"
            located = [
                entry for entry in entries
                if isinstance(entry.get("latitude"), (int, float))
                and isinstance(entry.get("longitude"), (int, float))
            ]
            result.append({
                "location": entries[0].get("location", "Local sem nome"),
                "latitude": round(sum(item["latitude"] for item in located) / len(located), 6) if located else None,
                "longitude": round(sum(item["longitude"] for item in located) / len(located), 6) if located else None,
                "count": len(entries),
                "recent_count": recent_count,
                "priority": round(volume_score + need_score + recent_score),
                "main_issue": main_issue,
                "newest": newest,
                "suggestion": cls._suggest_action(entries),
            })

        return sorted(result, key=lambda item: (-item["priority"], item["location"].casefold()))

    @staticmethod
    def _normalize_location(value: str) -> str:
        value = unicodedata.normalize("NFKD", value)
        value = "".join(char for char in value if not unicodedata.combining(char))
        return re.sub(r"\s+", " ", value.strip().casefold())

    @staticmethod
    def _suggest_action(entries: list[dict]) -> str:
        kinds = {entry.get("kind") for entry in entries}
        if "quente_sem_sombra" in kinds or "precisa_sombra" in kinds:
            return "Avaliar uma ilha de sombra com a comunidade e os responsáveis pelo espaço."
        if "ponto_refresco" in kinds:
            return "Verificar se existe um espaço acessível que possa funcionar como ponto de refresco."
        return "Combinar uma ação comunitária de cuidado da área verde."
