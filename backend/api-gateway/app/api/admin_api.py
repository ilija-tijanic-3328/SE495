from flask import Blueprint, jsonify, request

from app.api.decorators import jwt_required
from app.service import quiz_client, user_client

admin = Blueprint('admin', __name__)


@admin.route('/quizzes', methods=['GET'])
@jwt_required(role='ADMIN')
def get_quizzes():
    return jsonify(quiz_client.get_all())


@admin.route('/users', methods=['GET'])
@jwt_required(role='ADMIN')
def get_all():
    return jsonify(user_client.get_all())


@admin.route('/users/<user_id>/status', methods=['PUT'])
@jwt_required(role='ADMIN')
def set_status(user_id):
    return jsonify(user_client.set_status(user_id, request.json))
