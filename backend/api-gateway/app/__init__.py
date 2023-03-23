import os

from flask import Flask
from flask_caching import Cache

cache = Cache()
ROUTER_URL = f"http://{os.getenv('ROUTER_URI')}"


def create_app():
    app = Flask("api-gateway")
    app.config['CACHE_TYPE'] = "SimpleCache"
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300

    cache.init_app(app)

    from .api.user_api import user as user_blueprint
    app.register_blueprint(user_blueprint)

    from .api.auth_api import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    return app
