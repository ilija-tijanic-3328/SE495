import re

from flask import abort

from app import bcrypt
from app.data import user_auth_repo
from app.data.models import UserAuth

password_pattern = re.compile('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')


def get_by_user(user_id) -> UserAuth:
    return user_auth_repo.get_by_user(user_id)


def create(user_id, password):
    if not password_pattern.match(password):
        abort(400, 'Password must contain at least eight characters, one uppercase letter, one lowercase letter and '
                   'one number.')
    hashed_password = bcrypt.generate_password_hash(password)
    user_auth: UserAuth = UserAuth(user_id=user_id, password=hashed_password)
    return user_auth_repo.create(user_auth)
