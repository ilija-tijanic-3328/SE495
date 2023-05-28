import atexit
import os
import socket
from datetime import date, datetime

import requests
from flask import Flask
from flask.json.provider import DefaultJSONProvider
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

ROUTER_URL = f"http://{os.getenv('ROUTER_URI')}"


def create_app():
    app = Flask("notification-service")
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.url_map.strict_slashes = False
    app.json = CustomJSONProvider(app)

    db.init_app(app)

    from .api.main_api import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .api.notification_api import notifications
    app.register_blueprint(notifications, url_prefix='/notifications')

    with app.app_context():
        from .api import error_handler
        from .data.models import Notification
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


class CustomJSONProvider(DefaultJSONProvider):
    def default(self, o):
        if isinstance(o, date) or isinstance(o, datetime):
            result = o.isoformat()
            if o.tzinfo is None and o.utcoffset() is None:
                result += 'Z'
            return result
        return super().default(o)
