from flask import abort, current_app as app
from flask_jwt_extended import create_access_token
from werkzeug.exceptions import Unauthorized, BadRequest

from app import bcrypt
from app.data.models import UserAuth
from app.service import user_client, user_auth_service, token_service, email_client, sms_service


def check_password(hashed, password):
    return bcrypt.check_password_hash(hashed, password)


def is_two_factor_enabled(configs) -> bool:
    two_factor_config = [config for config in configs if
                         config.get('config') == 'AUTH_2_FACTOR' and config.get('value') == 'true']
    return len(two_factor_config) > 0


def two_factor_auth(user):
    code = token_service.create_two_factor_code(user.get('id'))
    sms_service.send_code(user.get('phone_number'), code.value)
    return token_service.create_two_factor_token(user.get('id'))


def authenticate(email, password):
    try:
        if email is not None and password is not None:
            account = user_client.get_account_by_email(email)
            if account is not None:
                user = account.get('user')
                user_id = user.get('id')
                user_auth: UserAuth = user_auth_service.get_by_user(user_id)

                if user_auth is not None and check_password(user_auth.password, password):
                    status = user.get('status')
                    if status == 'ACTIVE':
                        configs = account.get('configs')
                        if is_two_factor_enabled(configs):
                            token = two_factor_auth(user)
                            return {"two_factor_token": token.value}
                        else:
                            token = create_access_token(identity=user_id)
                            return {"access_token": token, "user_name": user.get('name')}
                    elif status == 'DISABLED':
                        abort(401, 'Account is disabled')
                    elif status == 'UNCONFIRMED':
                        abort(401, 'Account is not confirmed, please check your email for account confirmation '
                                   'instructions')

        abort(401, 'Invalid email or password')
    except Unauthorized as e:
        abort(401, e.description)
        # TODO increment failed login count
    except Exception as e:
        app.logger.warning(f'Login error {e}')
        abort(500)


def register(account_request):
    try:
        user_request = {"name": account_request.get('name'),
                        "email": account_request.get('email'),
                        "phone_number": account_request.get('phone_number')}

        user = user_client.create(user_request)

        user_auth_service.create(user.get('id'), account_request.get('password'))

        token = token_service.create_registration_token(user.get('id'))

        email_client.send_registration_email(user, token)
    except BadRequest as e:
        abort(400, e.description)
    except Exception as e:
        app.logger.warning(f'Registration error {e}')
        abort(500)


def check_two_factor(token, code):
    if token is not None and code is not None:
        two_factor_token = token_service.get_token(token, 'TWO_FACTOR_TOKEN')
        two_factor_code = token_service.get_token(code, 'TWO_FACTOR_CODE')

        if two_factor_token is not None and two_factor_code is not None \
                and two_factor_code.user_id == two_factor_code.user_id:
            user = user_client.get_by_id(two_factor_token.user_id)
            token = create_access_token(identity=two_factor_token.user_id)
            token_service.delete_token(two_factor_token)
            token_service.delete_token(two_factor_code)
            return {"access_token": token, "user_name": user.get('name')}

    abort(401, 'Invalid verification code')


def confirm_email(data):
    try:
        token: str = data.get('token')
        if token is not None:
            registration_token = token_service.get_token(token, 'REGISTRATION')
            if registration_token is not None:
                user_client.confirm_user(registration_token.user_id)
                token_service.delete_token(registration_token)
            else:
                abort(400, 'Invalid verification token')
        else:
            abort(400, 'Missing verification token')
    except BadRequest as e:
        abort(400, e.description)
    except Exception as e:
        app.logger.warning(f'Confirmation error {e}')
        abort(500)
