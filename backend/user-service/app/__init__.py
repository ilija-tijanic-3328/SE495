import atexit
import os
import socket

import requests
from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()

ROUTER_URL = f"http://{os.getenv('ROUTER_URI')}"


def create_app():
    app = Flask("user-service")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.url_map.strict_slashes = False

    db.init_app(app)
    migrate.init_app(app, db)

    from .api.main_api import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .api.user_api import users as user_blueprint
    app.register_blueprint(user_blueprint, url_prefix='/users')

    from .api.user_app_config_api import user_app_configs as user_app_config_blueprint
    app.register_blueprint(user_app_config_blueprint, url_prefix='/user-app-configs')

    with app.app_context():
        from .api import error_handler
        from .data.models import User, UserAppConfig
        db.create_all()
        update_router(app, 'register')
        atexit.register(lambda: update_router(app, 'unregister'))

    return app


def update_router(app, action):
    port = os.getenv('INTERNAL_PORT')
    host = socket.gethostname()
    data = f'{{"name": "{app.name}", "location": "http://{host}:{port}"}}'
    try:
        requests.post(f"{ROUTER_URL}/{action}", json=data)
    except Exception as e:
        app.logger.error(f"Couldn't {action} app {app.name} because: {e}")
