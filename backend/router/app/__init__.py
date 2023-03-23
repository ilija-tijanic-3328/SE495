from flask import Flask
from flask_caching import Cache

cache = Cache()


def create_app():
    app = Flask("router")
    app.config['CACHE_TYPE'] = "SimpleCache"
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300

    cache.init_app(app)

    from .api.main import main
    app.register_blueprint(main)

    return app
