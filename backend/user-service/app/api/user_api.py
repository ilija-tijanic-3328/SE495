from flask import request, jsonify, Blueprint

from app.service import user_service

user = Blueprint('user', __name__)


@user.route('/', methods=['GET'])
def get_all():
    args = request.args
    sort = args.get('sort', type=str)
    search = args.get('search', type=str)
    return jsonify(user_service.get_all(sort, search))


@user.route('/<int:user_id>', methods=['GET'])
def get_by_id(user_id):
    return jsonify(user_service.get_by_id(user_id))


@user.route('/', methods=['GET'])
def get_by_email():
    email = request.args.get('email', type=str)
    return jsonify(user_service.get_by_email(email))
