from flask import Blueprint, request, jsonify, g

from app.api.decorators import current_user_required
from app.service import quiz_service

quizzes = Blueprint('quizzes', __name__)


@quizzes.route('/', methods=['GET'])
@current_user_required()
def get_by_user():
    return jsonify(quiz_service.get_by_user_and_status(g.current_user_id, request.args.get('status')))


@quizzes.route('/<quiz_id>', methods=['DELETE'])
@current_user_required()
def delete(quiz_id):
    return jsonify(quiz_service.delete(g.current_user_id, quiz_id))


@quizzes.route('/', methods=['POST'])
@current_user_required()
def create():
    return jsonify(quiz_service.create(g.current_user_id, request.json).to_dict()), 201


@quizzes.route('/<quiz_id>', methods=['GET'])
@current_user_required()
def get_by_id(quiz_id):
    return jsonify(quiz_service.get_by_id(g.current_user_id, quiz_id).to_dict())


@quizzes.route('/<quiz_id>', methods=['PUT'])
@current_user_required()
def update(quiz_id):
    return jsonify(quiz_service.update(g.current_user_id, quiz_id, request.json).to_dict())


@quizzes.route('/<quiz_id>/quiz-configs', methods=['GET'])
@current_user_required()
def get_quiz_configs(quiz_id):
    quiz_configs = quiz_service.get_quiz_configs(g.current_user_id, quiz_id)
    return jsonify([q.to_dict() for q in quiz_configs])


@quizzes.route('/<quiz_id>/quiz-configs', methods=['PUT'])
@current_user_required()
def update_quiz_config(quiz_id):
    quiz_service.update_configs(g.current_user_id, quiz_id, request.json)
    return {"message": "OK"}, 200


@quizzes.route('/<quiz_id>/questions', methods=['GET'])
@current_user_required()
def get_questions(quiz_id):
    return jsonify(quiz_service.get_questions(g.current_user_id, quiz_id))


@quizzes.route('/<quiz_id>/questions', methods=['PUT'])
@current_user_required()
def update_questions(quiz_id):
    quiz_service.update_questions(g.current_user_id, quiz_id, request.json)
    return {"message": "OK"}, 200
