from flask import request, jsonify, Blueprint

from app.api.decorators import current_user_required
from app.service import user_service

users = Blueprint('users', __name__)


@users.route('/', methods=['GET'])
def get_filtered():
    return jsonify([user.to_dict() for user in user_service.get_filtered(request.args)])


@users.route('/config', methods=['GET'])
def get_with_config():
    return jsonify(user_service.get_with_config(request.args.get('email')))


@users.route('/<int:user_id>', methods=['GET'])
def get_by_id(user_id):
    return jsonify(user_service.get_by_id(user_id).to_dict())


@users.route('/', methods=['POST'])
def create():
    return jsonify(user_service.create(request.json).to_dict())


@users.route('/<int:user_id>/confirm', methods=['PUT'])
def confirm_user(user_id):
    return user_service.confirm_user(user_id)


@users.route('/<int:user_id>', methods=['PUT'])
@current_user_required()
def update(user_id):
    user_service.update(user_id, request.json)
    return {"message": "OK"}, 200


@users.route('/<int:user_id>', methods=['DELETE'])
@current_user_required()
def delete(user_id):
    user_service.delete(user_id)
    return {"message": "OK"}, 200


@users.route('/active', methods=['GET'])
def get_active_users():
    return jsonify(user_service.get_active_users())


@users.route('/names', methods=['GET'])
def get_names_by_ids():
    return jsonify(user_service.get_names_by_ids(request.args.getlist('ids')))


@users.route('/<int:user_id>/lock', methods=['PUT'])
def lock_user_account(user_id):
    user_service.lock_user_account(user_id)
    return {"message": "OK"}, 200


@users.route('/<int:user_id>/unlock', methods=['PUT'])
def unlock_user_account(user_id):
    user_service.unlock_user_account(user_id)
    return {"message": "OK"}, 200
