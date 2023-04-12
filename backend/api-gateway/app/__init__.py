import os

from flask import Flask
from flask_caching import Cache
from flask_cors import CORS

cache = Cache()
cors = CORS()
ROUTER_URL = f"http://{os.getenv('ROUTER_URI')}"


def create_app():
    app = Flask("api-gateway")
    app.config['CACHE_TYPE'] = "SimpleCache"
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300
    app.config['CORS_ORIGINS'] = os.getenv('CORS_ORIGINS')
    app.url_map.strict_slashes = False

    cache.init_app(app)
    cors.init_app(app)

    from .api.user_api import users as user_blueprint
    app.register_blueprint(user_blueprint, url_prefix='/users')

    from .api.user_api import user_app_configs
    app.register_blueprint(user_app_configs, url_prefix='/user-app-configs')

    from .api.auth_api import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    from .api.notification_api import notifications
    app.register_blueprint(notifications, url_prefix='/notifications')

    with app.app_context():
        from .api import error_handler

    return app
