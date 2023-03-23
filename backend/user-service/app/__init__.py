import os
import socket

import requests
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

ROUTER_URL = f"http://{os.getenv('ROUTER_URI')}"


def create_app():
    app = Flask("user-service")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from .api.main_api import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .api.user_api import user as user_blueprint
    app.register_blueprint(user_blueprint, url_prefix='/users')

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
