import datetime
import random
import uuid

from app.data import token_repo
from app.data.models import Token


def create_registration_token(user_id):
    expiration = datetime.datetime.now() + datetime.timedelta(days=1)
    token: Token = Token(user_id=user_id, type='REGISTRATION', expiration_time=expiration, value=str(uuid.uuid4()))
    return token_repo.create(token)


def create_two_factor_token(user_id):
    expiration = datetime.datetime.now() + datetime.timedelta(minutes=30)
    token: Token = Token(user_id=user_id, type='TWO_FACTOR_TOKEN', expiration_time=expiration, value=str(uuid.uuid4()))
    return token_repo.create(token)


def create_two_factor_code(user_id):
    expiration = datetime.datetime.now() + datetime.timedelta(minutes=30)
    token: Token = Token(user_id=user_id, type='TWO_FACTOR_CODE', expiration_time=expiration,
                         value=random.randint(1111, 9999))
    return token_repo.create(token)


def get_token(value, token_type) -> Token:
    return token_repo.get_token(value, token_type)


def delete_token(token):
    return token_repo.delete(token)


def create_forgot_password_token(user_id):
    expiration = datetime.datetime.now() + datetime.timedelta(hours=1)
    token: Token = Token(user_id=user_id, type='FORGOT_PASSWORD_TOKEN', expiration_time=expiration,
                         value=str(uuid.uuid4()))
    return token_repo.create(token)
