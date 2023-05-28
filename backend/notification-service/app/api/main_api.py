from flask import Blueprint, current_app as app
from sqlalchemy import text

from app import db

main = Blueprint('main', __name__)


@main.route('/health', methods=['GET'])
def health():
    try:
        db.session.execute(text('SELECT 1'))
    except Exception as e:
        app.logger.error(f'Unhealthy because: {e}')
        return "Error", 503

    return "OK", 200
