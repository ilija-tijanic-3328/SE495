from flask import Blueprint, jsonify, request

from app.api.decorators import jwt_required
from app.service import participation_client

participation = Blueprint('participation', __name__)


@participation.route('/invitations', methods=['GET'])
@jwt_required()
def get_invitations():
    return jsonify(participation_client.get_invitations())


@participation.route('/<code>', methods=['GET'])
@jwt_required(optional=True)
def get_quiz_by_code(code):
    return jsonify(participation_client.get_unfinished_by_code(code))


@participation.route('/start', methods=['PUT'])
@jwt_required(optional=True)
def start_quiz():
    return jsonify(participation_client.start_quiz(request.json.get('code')))


@participation.route('/<participant_id>/submit', methods=['PUT'])
@jwt_required(optional=True)
def submit_answers(participant_id):
    return jsonify(participation_client.submit_answers(participant_id, request.json))


@participation.route('/<code>/results', methods=['GET'])
@jwt_required(optional=True)
def get_results(code):
    return jsonify(participation_client.get_results(code))


@participation.route('/attempts', methods=['GET'])
@jwt_required()
def get_attempts():
    return jsonify(participation_client.get_attempts())


@participation.route('/report-quiz', methods=['POST'])
@jwt_required(optional=True)
def report_quiz():
    participation_client.report_quiz(request.json)
    return {"message": "OK"}, 200
