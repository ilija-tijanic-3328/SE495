from flask import Blueprint, jsonify, request

from app.api.decorators import jwt_required
from app.service import participation_client

participation = Blueprint('participation', __name__)


@participation.route('/invitations', methods=['GET'])
@jwt_required()
def get_invitations():
    return jsonify(participation_client.get_invitations())


@participation.route('/quiz-participants/<code>', methods=['GET'])
@jwt_required(optional=True)
def get_quiz_by_code(code):
    return jsonify(participation_client.get_quiz_by_code(code))


@participation.route('/start', methods=['PUT'])
@jwt_required(optional=True)
def start_quiz():
    return jsonify(participation_client.start_quiz(request.json.get('code')))


@participation.route('/<participant_id>/submit', methods=['PUT'])
@jwt_required(optional=True)
def submit_answers(participant_id):
    return jsonify(participation_client.submit_answers(participant_id, request.json))
