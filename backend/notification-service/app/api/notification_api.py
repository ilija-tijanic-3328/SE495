from flask import Blueprint, jsonify, g, request

from app.api.decorators import current_user_required
from app.service import notification_service

notifications = Blueprint('notifications', __name__)


@notifications.route('/', methods=['POST'])
def create():
    notification_service.create(request.json)
    return {"message": "OK"}, 201


@notifications.route('/', methods=['GET'])
@current_user_required()
def get_by_user():
    return jsonify([n.to_dict() for n in notification_service.get_by_user(g.current_user_id)])


@notifications.route('/unseen-count', methods=['GET'])
@current_user_required()
def count_unseen_by_user():
    return jsonify(notification_service.count_unseen_by_user(g.current_user_id))


@notifications.route('/', methods=['PUT'])
@current_user_required()
def mark_as_seen():
    seen_notifications = notification_service.mark_as_seen(g.current_user_id, request.json.get('ids'))
    return jsonify([n.to_dict() for n in seen_notifications])
