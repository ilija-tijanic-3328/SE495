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

    from .api.quiz_api import quizzes
    app.register_blueprint(quizzes, url_prefix='/quizzes')

    from .api.quiz_api import quiz_configs
    app.register_blueprint(quiz_configs, url_prefix='/quiz-configs')

    from .api.participation_api import participation
    app.register_blueprint(participation, url_prefix='/participation')

    from .api.admin_api import admin
    app.register_blueprint(admin, url_prefix='/admin')

    with app.app_context():
        from .api import error_handler

    return app
