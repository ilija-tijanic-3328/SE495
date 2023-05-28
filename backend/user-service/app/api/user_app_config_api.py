from flask import Blueprint, jsonify, g, request

from app.api.decorators import current_user_required
from app.service import user_app_config_service

user_app_configs = Blueprint('user_app_configs', __name__)


@user_app_configs.route('/', methods=['GET'])
@current_user_required()
def get_user_configs():
    return jsonify([config.to_dict() for config in user_app_config_service.get_by_user(g.current_user_id)])


@user_app_configs.route('/', methods=['PUT'])
@current_user_required()
def update_user_config():
    user_app_config_service.update(g.current_user_id, request.json.get('config'), request.json.get('value'))
    return {"message": "OK"}, 200
