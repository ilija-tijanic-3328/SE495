from flask import jsonify, Blueprint

from app.api.decorators import current_user_required
from app.service import quiz_config_service

quiz_configs = Blueprint('quiz_configs', __name__)


@quiz_configs.route('/', methods=['GET'])
@current_user_required()
def get_default():
    return jsonify(quiz_config_service.get_default())
