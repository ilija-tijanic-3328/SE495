from flask import Blueprint, jsonify, request

from app.api.decorators import jwt_required
from app.service import quiz_client, participation_client

quizzes = Blueprint('quizzes', __name__)
quiz_configs = Blueprint('quiz_configs', __name__)


@quizzes.route('/', methods=['GET'])
@jwt_required()
def get_by_user():
    return jsonify(quiz_client.get_by_user(request.args.get('status')))


@quizzes.route('/<quiz_id>', methods=['DELETE'])
@jwt_required()
def delete(quiz_id):
    quiz_client.delete(quiz_id)
    return {"message": "OK"}, 200


@quizzes.route('/<quiz_id>', methods=['GET'])
@jwt_required()
def get_by_id(quiz_id):
    return jsonify(quiz_client.get_by_id(quiz_id))


@quizzes.route('/', methods=['POST'])
@jwt_required()
def create():
    return jsonify(quiz_client.create(request.json))


@quizzes.route('/<quiz_id>', methods=['PUT'])
@jwt_required()
def update(quiz_id):
    return jsonify(quiz_client.update(quiz_id, request.json))


@quizzes.route('/<quiz_id>/quiz-configs', methods=['GET'])
@jwt_required()
def get_quiz_configs(quiz_id):
    return jsonify(quiz_client.get_quiz_configs(quiz_id))


@quizzes.route('/<quiz_id>/quiz-configs', methods=['PUT'])
@jwt_required()
def update_quiz_config(quiz_id):
    return quiz_client.update_configs(quiz_id, request.json)


@quiz_configs.route('/', methods=['GET'])
@jwt_required()
def get_default_configs():
    return jsonify(quiz_client.get_default_configs())


@quizzes.route('/<quiz_id>/questions', methods=['GET'])
@jwt_required()
def get_questions(quiz_id):
    return jsonify(quiz_client.get_questions(quiz_id))


@quizzes.route('/<quiz_id>/questions', methods=['PUT'])
@jwt_required()
def update_questions(quiz_id):
    quiz_client.update_questions(quiz_id, request.json)
    return {"message": "OK"}, 200


@quizzes.route('/<quiz_id>/participants', methods=['GET'])
@jwt_required()
def get_participants(quiz_id):
    return jsonify(participation_client.get_participants(quiz_id))


@quizzes.route('/<quiz_id>/participants', methods=['PUT'])
@jwt_required()
def update_participants(quiz_id):
    return jsonify(participation_client.update_participants(quiz_id, request.json))
