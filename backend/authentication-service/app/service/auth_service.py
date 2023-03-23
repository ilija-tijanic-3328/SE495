import bcrypt as bcrypt
from flask import current_app
from flask_jwt import JWT

from app.data.models import UserAuth
from app.service import user_client, user_auth_service


def authentication_handler(email, password):
    try:
        user = user_client.get_user_by_email(email).json()
        user_auth: UserAuth = user_auth_service.get_by_user(user.id)
        if user and bcrypt.checkpw(password, user_auth.password) and user.status == 'ACTIVE':
            # TODO add 2-factor auth
            return user
    except:
        return None


def identity_handler(payload):
    user_id = payload['identity']
    return user_client.get_by_id(user_id)


jwt = JWT(current_app, authentication_handler, identity_handler)
