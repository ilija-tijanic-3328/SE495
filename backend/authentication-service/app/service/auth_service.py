from flask import abort, current_app as app, g
from flask_jwt_extended import create_access_token
from werkzeug.exceptions import Unauthorized, BadRequest, NotFound

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


def lock_user_account(user):
    token = token_service.create_unlock_account_token(user.get('id'))
    user_client.lock_user_account(user.get('id'))
    email_client.send_account_locked_email(user, token)


def authenticate(user_auth, user_id, user_name):
    token = create_access_token(identity=user_id)
    user_auth_service.set_last_logged_in(user_auth)
    user_auth_service.reset_failed_login_count(user_auth)
    return {"access_token": token, "user_name": user_name, "last_logged_in": user_auth.last_logged_in}


def login(email, password):
    try:
        if email is not None and password is not None:
            account = user_client.get_account_with_config(email)
            if account is not None:
                user = account.get('user')
                user_id = user.get('id')
                user_auth: UserAuth = user_auth_service.get_by_user(user_id)

                if user_auth is not None:
                    status = user.get('status')

                    if status == 'ACTIVE':
                        if check_password(user_auth.password, password):
                            configs = account.get('configs')
                            if is_two_factor_enabled(configs):
                                token = two_factor_auth(user)
                                return {"two_factor_token": token.value}
                            else:
                                return authenticate(user_auth, user_id, user.get('name'))
                        else:
                            attempts_left = user_auth_service.increment_failed_login(user_auth)

                            if attempts_left <= 0:
                                lock_user_account(user)
                                info = f'Account locked due to too many failed login attempts.'
                            else:
                                info = f'Login attempts left: {attempts_left}'

                            abort(401, f'Invalid email or password. {info}')
                    elif status == 'DISABLED':
                        abort(401, 'Account is disabled')
                    elif status == 'LOCKED':
                        abort(401, 'Account is locked due to too many failed login attempts')
                    elif status == 'UNCONFIRMED':
                        abort(401, 'Account is not confirmed, please check your email for account confirmation '
                                   'instructions')

        abort(401, 'Invalid email or password')
    except Unauthorized as e:
        abort(401, e.description)
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
            user_auth = user_auth_service.get_by_user(two_factor_token.user_id)
            token_service.delete_token(two_factor_token)
            token_service.delete_token(two_factor_code)
            return authenticate(user_auth, user.get('id'), user.get('name'))

    abort(401, 'Invalid verification code')


def confirm_email(data):
    try:
        token: str = data.get('token')
        if token is not None:
            registration_token = token_service.get_token(token, 'REGISTRATION')
            if registration_token is not None:
                email = user_client.confirm_user(registration_token.user_id)
                token_service.delete_token(registration_token)
                return {'email': email}
            else:
                abort(400, 'Invalid verification token')
        else:
            abort(400, 'Missing verification token')
    except BadRequest as e:
        abort(400, e.description)
    except Exception as e:
        app.logger.warning(f'Confirmation error {e}')
        abort(500)


def forgot_password(data):
    try:
        email: str = data.get('email')
        if email is not None:
            account = user_client.get_account_with_config(email)
            if account is not None:
                user = account.get('user')
                if user.get('status') == 'ACTIVE':
                    token = token_service.create_forgot_password_token(user.get('id'))
                    email_client.send_forgot_password_email(user, token)
    except Exception as e:
        app.logger.warning(f'Forgot password error {e}')
        abort(500)


def reset_password(data):
    try:
        token: str = data.get('token')
        if token is not None:
            forgot_password_token = token_service.get_token(token, 'FORGOT_PASSWORD_TOKEN')
            if forgot_password_token is not None:
                user = user_client.get_by_id(forgot_password_token.user_id)
                if user is not None and user.get('status') == 'ACTIVE':
                    user_auth_service.set_password(forgot_password_token.user_id, data.get('password'))
                    token_service.delete_token(forgot_password_token)
                    return
                else:
                    abort(400, 'Account is not active')
        abort(400, 'Invalid token')
    except BadRequest as e:
        abort(400, e.description)
    except Exception as e:
        app.logger.warning(f'Reset password error {e}')
        abort(500)


def validate_reset_password_token(data):
    try:
        token: str = data.get('token')
        if token is not None:
            reset_password_token = token_service.get_token(token, 'FORGOT_PASSWORD_TOKEN')
            if reset_password_token is None:
                abort(400, 'Invalid verification token')
        else:
            abort(400, 'Missing verification token')
    except BadRequest as e:
        abort(400, e.description)
    except Exception as e:
        app.logger.warning(f'Reset password validation error {e}')
        abort(500)


def change_password(data):
    user_id = g.current_user_id
    user_auth = user_auth_service.get_by_user(user_id)
    current_password = data.get('currentPassword')

    if check_password(user_auth.password, current_password):
        new_password = data.get('newPassword')
        user_auth_service.set_password(user_id, new_password)
    else:
        abort(400, 'Incorrect current password')


def delete_account(data):
    user_id = g.current_user_id
    password = data.get('password')

    user_auth = user_auth_service.get_by_user(user_id)

    if password is None or not check_password(user_auth.password, password):
        abort(400, 'Incorrect password')

    user_client.delete_account(user_id)
    user_auth_service.delete(user_auth)
    token_service.delete_for_user(user_id)


def unlock_account(data):
    try:
        token: str = data.get('token')
        if token is not None:
            unlock_token = token_service.get_token(token, 'UNLOCK_ACCOUNT_TOKEN')
            if unlock_token is not None:
                user_client.unlock_user_account(unlock_token.user_id)
                token_service.delete_token(unlock_token)
                user_auth = user_auth_service.get_by_user(unlock_token.user_id)
                user_auth_service.reset_failed_login_count(user_auth)
            else:
                abort(400, 'Invalid unlock token')
        else:
            abort(400, 'Missing unlock token')
    except BadRequest as e:
        abort(400, e.description)
    except Exception as e:
        app.logger.warning(f'Account unlock error {e}')
        abort(500)
