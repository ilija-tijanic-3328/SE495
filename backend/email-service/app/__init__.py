import atexit
import os
import socket

import requests
from flask import Flask

ROUTER_URL = f"http://{os.getenv('ROUTER_URI')}"


def create_app():
    app = Flask("email-service")

    from .api.main_api import main as main_blueprint
    app.register_blueprint(main_blueprint)

    with app.app_context():
        from .api import error_handler
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
