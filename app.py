"""Ponto de entrada da aplicação unificada Sombrinha ☂️ • Bairro que Cuida."""

import os
import socket

from flask import Flask

from controllers.report_controller import reports_blueprint
from controllers.sombrinha_controller import sombrinha_blueprint
from models.report_model import ReportModel

HOST = "0.0.0.0"
PORT = int(os.environ.get("PORT", "8000"))


def create_app() -> Flask:
    app = Flask(
        __name__,
        template_folder="views/templates",
        static_folder="static",
    )
    app.config["MAX_CONTENT_LENGTH"] = 50_000

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
        return response

    app.register_blueprint(reports_blueprint)
    app.register_blueprint(sombrinha_blueprint)
    return app


app = create_app()


def local_ip() -> str:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("192.0.2.1", 80))
            return sock.getsockname()[0]
    except OSError:
        return "IP-DO-COMPUTADOR"


if __name__ == "__main__":
    ReportModel.initialize_database()
    print(f"☂️ Sombrinha • Bairro que Cuida rodando com sucesso!")
    print(f"Aplicação disponível neste computador: http://localhost:{PORT}")
    print(f"Para testar no celular na mesma rede Wi-Fi: http://{local_ip()}:{PORT}")
    print("Pare o servidor com Ctrl+C.")
    app.run(host=HOST, port=PORT, debug=False, threaded=True)
