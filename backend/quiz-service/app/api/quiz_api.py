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
def get_by_id(quiz_id):
    return jsonify(quiz_service.get_by_id(quiz_id).to_dict())


@quizzes.route('/<quiz_id>/check-user', methods=['GET'])
@current_user_required()
def get_by_id_and_user(quiz_id):
    return jsonify(quiz_service.get_by_id_and_user(quiz_id, g.get('current_user_id')).to_dict())


@quizzes.route('/<quiz_id>', methods=['PUT'])
@current_user_required()
def update(quiz_id):
    return jsonify(quiz_service.update(g.current_user_id, quiz_id, request.json).to_dict())


@quizzes.route('/<quiz_id>/quiz-configs', methods=['GET'])
@current_user_required(optional=True)
def get_quiz_configs(quiz_id):
    quiz_configs = quiz_service.get_quiz_configs(quiz_id)
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


@quizzes.route('/<quiz_id>/publish', methods=['PUT'])
@current_user_required()
def publish_quiz(quiz_id):
    quiz_service.publish_quiz(g.current_user_id, quiz_id)
    return {"message": "OK"}, 200


@quizzes.route('/unfinished', methods=['GET'])
@current_user_required()
def get_unfinished_by_ids():
    return jsonify(quiz_service.get_unfinished_by_ids(request.args.getlist('ids')))


@quizzes.route('/<quiz_id>/unfinished', methods=['GET'])
def get_unfinished(quiz_id):
    return jsonify(quiz_service.get_unfinished(quiz_id).to_dict())


@quizzes.route('/<quiz_id>/unfinished/questions', methods=['GET'])
def get_attempt_questions(quiz_id):
    return jsonify(quiz_service.get_attempt_questions(quiz_id))


@quizzes.route('/<quiz_id>/questions/grouped', methods=['GET'])
@current_user_required(optional=True)
def get_questions_grouped(quiz_id):
    include_configs = request.args.get('include_configs', type=bool)
    return jsonify(quiz_service.get_questions_grouped(quiz_id, include_configs))


@quizzes.route('/grouped', methods=['GET'])
def get_grouped():
    return jsonify(quiz_service.get_grouped(request.args.getlist('ids')))
