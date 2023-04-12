import datetime

from app import db
from app.data.models import Notification


def get_by_ids(notification_ids) -> list[Notification]:
    return db.session.scalars(db.select(Notification).filter(Notification.id.in_(notification_ids))).all()


def set_seen_time(notifications: list[Notification], seen_time) -> list[Notification]:
    seen_notifications = []
    for notification in notifications:
        if notification.seen_time is None:
            notification.seen_time = seen_time
            seen_notifications.append(notification)
    db.session.commit()
    return seen_notifications


def get_by_user(user_id) -> list[Notification]:
    return db.session.scalars(db.select(Notification).filter_by(user_id=user_id)).all()


def create(notification):
    notification.seen_time = None
    notification.creation_time = datetime.datetime.now()
    db.session.add(notification)
    db.session.commit()


def count_unseen_by_user(user_id):
    return db.session.query(Notification).filter(Notification.user_id == user_id,
                                                 Notification.seen_time.is_(None)).count()
