import datetime
import re

from flask import abort

from app import bcrypt
from app.data import user_auth_repo
from app.data.models import UserAuth

password_pattern = re.compile('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,150}$')


def get_by_user(user_id) -> UserAuth:
    return user_auth_repo.get_by_user(user_id)


def hash_password(password):
    if not password_pattern.match(password):
        abort(400, 'Password must contain at least eight characters, one uppercase letter, one lowercase letter and '
                   'one number.')
    return bcrypt.generate_password_hash(password).decode('utf-8')


def create(user_id, password):
    hashed_password = hash_password(password)
    user_auth: UserAuth = UserAuth(user_id=user_id, password=hashed_password)
    return user_auth_repo.create(user_auth)


def set_password(user_id, password):
    hashed_password = hash_password(password)
    user_auth_repo.set_password(user_id, hashed_password)


def delete(user_auth: UserAuth):
    user_auth_repo.delete(user_auth)


def set_last_logged_in(user_auth: UserAuth):
    user_auth_repo.set_last_logged_in(user_auth, datetime.datetime.now())


def reset_failed_login_count(user_auth: UserAuth):
    if user_auth.failed_login_count > 0:
        user_auth_repo.set_failed_login_count(user_auth, 0)


def last_failed_login_was_in_previous_hour(user_auth):
    time_since_last_failed_login = datetime.datetime.now() - user_auth.failed_login_time
    return time_since_last_failed_login.total_seconds() / 60 <= 60


def increment_failed_login(user_auth: UserAuth):
    if user_auth.failed_login_count == 0:
        user_auth_repo.set_failed_login_time(user_auth, datetime.datetime.now())

    if user_auth.failed_login_time is None or last_failed_login_was_in_previous_hour(user_auth):
        user_auth_repo.set_failed_login_count(user_auth, user_auth.failed_login_count + 1)

    return 5 - user_auth.failed_login_count
