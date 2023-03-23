import os
import socket
from datetime import timedelta

import requests
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

ROUTER_URL = f"http://{os.getenv('ROUTER_URI')}"


def create_app():
    app = Flask("authentication-service")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_AUTH_USERNAME_KEY'] = 'email'
    app.config['JWT_AUTH_HEADER_PREFIX'] = 'Bearer'
    app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=1)

    db.init_app(app)

    from .api.main_api import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .api.auth_api import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

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
