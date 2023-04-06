from flask import request, jsonify, Blueprint

from app.service import user_service

users = Blueprint('users', __name__)


@users.route('/', methods=['GET'])
def get_filtered():
    return jsonify([user.to_dict() for user in user_service.get_filtered(request.args)])


@users.route('/<int:user_id>', methods=['GET'])
def get_by_id(user_id):
    return jsonify(user_service.get_by_id(user_id).to_dict())
