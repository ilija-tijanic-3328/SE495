from app import db
from app.data.models import UserAuth


def get_by_user(user_id) -> UserAuth:
    return db.session.scalar(db.select(UserAuth).filter_by(user_id=user_id))


def create(user_auth: UserAuth) -> UserAuth:
    db.session.add(user_auth)
    db.session.commit()
    return user_auth


def set_password(user_id, hashed_password):
    user_auth = get_by_user(user_id)
    user_auth.password = hashed_password
    db.session.commit()


def delete(user_auth: UserAuth):
    db.session.delete(user_auth)
    db.session.commit()


def set_last_logged_in(user_auth: UserAuth, time):
    user_auth.last_logged_in = time
    db.session.commit()


def set_failed_login_count(user_auth: UserAuth, failed_login_count):
    user_auth.failed_login_count = failed_login_count
    db.session.commit()


def set_failed_login_time(user_auth: UserAuth, failed_login_time):
    user_auth.failed_login_time = failed_login_time
    db.session.commit()
