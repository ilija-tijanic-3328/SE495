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
