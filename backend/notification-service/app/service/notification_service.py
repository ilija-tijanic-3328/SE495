import datetime
import os

from flask import abort

from app.data import notification_repo
from app.data.models import Notification

APP_BASE_URL = os.getenv('APP_BASE_URL')

TEMPLATES = {
    "ACCOUNT_CONFIRMED": {
        "content": "Welcome {name}, start your ninja journey by creating a quick quiz!",
        "deep_link": "{base_url}/quizzes/create"
    }
}


def get_by_user(user_id):
    return notification_repo.get_by_user(user_id)


def mark_as_seen(user_id, notification_ids):
    notifications = notification_repo.get_by_ids(notification_ids)

    for notification in notifications:
        if notification.user_id != int(user_id):
            abort(403)

    seen_time = datetime.datetime.now()
    seen_notifications = notification_repo.set_seen_time(notifications, seen_time)

    return seen_notifications


def create(data):
    content_values = data.get('content')
    notification_type = data.get('type')
    user_id = data.get('user_id')
    template = TEMPLATES.get(notification_type)

    if content_values is None or notification_type is None or user_id is None or template is None:
        abort(400, 'Invalid notification data')

    deep_link_values = data.get('deep_link', dict())
    deep_link_values.update({'base_url': APP_BASE_URL})

    deep_link = None
    deep_link_template = template.get('deep_link')
    if deep_link_template is not None:
        deep_link = deep_link_template.format(**deep_link_values)

    content = template.get('content').format(**content_values)

    notification = Notification(user_id=user_id, content=content, type=notification_type,
                                deep_link=deep_link)
    notification_repo.create(notification)


def count_unseen_by_user(user_id):
    unseen_count = notification_repo.count_unseen_by_user(user_id)
    return {"unseen_count": unseen_count}
