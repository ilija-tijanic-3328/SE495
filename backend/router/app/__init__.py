import atexit
import os

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask
from flask_caching import Cache

cache = Cache()


def create_app():
    app = Flask("router")
    app.config['CACHE_TYPE'] = "FileSystemCache"
    app.config['CACHE_DEFAULT_TIMEOUT'] = 0
    app.config['CACHE_THRESHOLD'] = 100
    app.config['CACHE_DIR'] = os.getenv('CACHE_DIR')
    app.config['CACHE_IGNORE_ERRORS'] = True

    cache.init_app(app)

    from .api.main_api import main
    app.register_blueprint(main)

    with app.app_context():
        from .api import error_handler
        from .service.registry_service import check_health
        scheduler = BackgroundScheduler(daemon=True)
        scheduler.add_job(func=lambda: log_func_call(app, check_health), trigger="interval", seconds=30)
        scheduler.start()
        atexit.register(lambda: scheduler.shutdown())

    return app


def log_func_call(app, func):
    # app.logger.debug(f'Calling {func.__name__}')
    return_value = func()
    # app.logger.debug(f'Returned {return_value}')
