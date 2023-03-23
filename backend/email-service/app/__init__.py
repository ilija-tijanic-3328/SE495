import os
import socket

import requests
from flask import Flask

ROUTER_URL = f"http://{os.getenv('ROUTER_URI')}"


def create_app():
    app = Flask("email-service")

    from .api.main_api import main as main_blueprint
    app.register_blueprint(main_blueprint)

    register_app(app)

    return app


def register_app(app):
    port = os.getenv('INTERNAL_PORT')
    host = socket.gethostname()
    data = f'{{"name": "{app.name}", "location": "http://{host}:{port}"}}'
    try:
        requests.post(f"{ROUTER_URL}/register", json=data)
    except Exception as e:
        app.logger.error("couldn't register app")
#         TODO log error
