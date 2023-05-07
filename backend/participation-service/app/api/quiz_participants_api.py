from flask import Blueprint, jsonify, request, g, current_app

from app.api.decorators import current_user_required
from app.service import quiz_participant_service

quiz_participants = Blueprint('quiz_participants', __name__)


@quiz_participants.route('/count', methods=['GET'])
def get_counts():
    quiz_ids = request.args.getlist('quiz_ids')
    return jsonify(quiz_participant_service.get_counts(quiz_ids))


@quiz_participants.route('/', methods=['GET'])
def get_participants():
    quiz_id = request.args.get('quiz_id')
    return jsonify([p.to_dict() for p in quiz_participant_service.get_by_quiz(quiz_id)])


@quiz_participants.route('/', methods=['PUT'])
def update_participants():
    return jsonify(quiz_participant_service.update_participants(request.json))


@quiz_participants.route('/unfinished', methods=['GET'])
@current_user_required()
def get_user_unfinished_participants():
    return jsonify([p.to_dict() for p in quiz_participant_service.get_unfinished_by_user(g.current_user_id)])


@quiz_participants.route('/unfinished/<code>', methods=['GET'])
@current_user_required(optional=True)
def get_unfinished_participant_by_code(code):
    return jsonify(quiz_participant_service.get_unfinished_by_code(code).to_dict())


@quiz_participants.route('/<participant_id>/start', methods=['PUT'])
@current_user_required(optional=True)
def start_attempt(participant_id):
    allowed_time = int(request.json.get('time_allowed'))
    return jsonify(quiz_participant_service.start_attempt(participant_id, allowed_time))


@quiz_participants.route('/<participant_id>/answers', methods=['PUT'])
@current_user_required(optional=True)
def submit_answers(participant_id):
    quiz_participant_service.submit_answers(participant_id, request.json)
    return {'message': 'OK'}, 200


@quiz_participants.route('/<code>/results', methods=['GET'])
@current_user_required(optional=True)
def get_results(code):
    return jsonify(quiz_participant_service.get_results(code))


@quiz_participants.route('/finished', methods=['GET'])
@current_user_required()
def get_user_finished_participants():
    return jsonify(quiz_participant_service.get_finished_by_user(g.current_user_id))


@quiz_participants.route('/<participant_id>', methods=['GET'])
@current_user_required(optional=True)
def get_by_id(participant_id):
    return jsonify(quiz_participant_service.get_by_id(participant_id).to_dict())
