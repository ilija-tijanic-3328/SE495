from flask import Blueprint, jsonify, request

from app.api.decorators import jwt_required
from app.service import user_client

users = Blueprint('users', __name__)
user_app_configs = Blueprint('user_app_configs', __name__)


@user_app_configs.route('/', methods=['GET'])
@jwt_required()
def get_user_configs():
    return jsonify(user_client.get_user_configs())


@user_app_configs.route('/', methods=['PUT'])
@jwt_required()
def update_user_config():
    response = user_client.update_user_config(request.json)
    return {"message": response.text}, response.status_code
