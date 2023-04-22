from flask import Blueprint, jsonify, request

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
