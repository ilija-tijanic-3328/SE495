from flask import abort, current_app as app
from flask_jwt_extended import create_access_token
from werkzeug.exceptions import HTTPException

from app import bcrypt
from app.data.models import UserAuth
from app.service import user_client, user_auth_service


def check_password(hashed, password):
    return bcrypt.check_password_hash(hashed, password)


def authenticate(email, password):
    if email is not None and password is not None:
        try:
            user = user_client.get_user_by_email(email)
            if user is not None:
                user_auth: UserAuth = user_auth_service.get_by_user(user['id'])
                if user_auth is not None and check_password(user_auth.password, password):
                    if user['status'] == 'ACTIVE':
                        # TODO add 2-factor auth
                        return create_access_token(identity=email)
                    else:
                        abort(401, 'Account is disabled')
        except HTTPException:
            pass
        except Exception as e:
            app.logger.warning(f'Login error {e}')
            abort(500)

    abort(401, 'Invalid email or password')
