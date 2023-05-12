from flask import Blueprint, jsonify, request, g

from app.api.decorators import jwt_required
from app.service import notification_client

notifications = Blueprint('notifications', __name__)


@notifications.route('/', methods=['GET'])
@jwt_required()
def get_by_user():
    return jsonify(notification_client.get_by_user())


@notifications.route('/', methods=['PUT'])
@jwt_required()
def mark_as_seen():
    return jsonify(notification_client.mark_as_seen(request.json))


@notifications.route('/unseen-count', methods=['GET'])
@jwt_required()
def get_unseen_count():
    return jsonify(notification_client.get_unseen_count())


@notifications.route('/', methods=['POST'])
@jwt_required(role='ADMIN')
def send_notification():
    return jsonify(notification_client.send(request.json))
