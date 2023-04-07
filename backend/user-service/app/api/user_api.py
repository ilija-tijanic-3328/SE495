from flask import request, jsonify, Blueprint

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
