from flask import Blueprint, current_app as app, jsonify, request
from sqlalchemy import text

from app import db
from app.service import quiz_participant_service

quiz_participants = Blueprint('quiz_participants', __name__)


@quiz_participants.route('/count', methods=['GET'])
def get_counts():
    quiz_ids = request.args.getlist('quiz_ids')
    return jsonify(quiz_participant_service.get_counts(quiz_ids))
