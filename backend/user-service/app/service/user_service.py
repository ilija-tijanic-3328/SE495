import re

import phonenumbers
from flask import abort, g

from app.data import user_repo
from app.data.models import User
from app.service import user_app_config_service, notification_client

email_pattern = re.compile('^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,24}$')


def get_filtered(args):
    return user_repo.get_filtered(args)


def get_by_id(user_id):
    return user_repo.get_by_id(user_id)


def create(user_request):
    name = user_request.get('name')
    email = user_request.get('email')
    phone_number: str | None = user_request.get('phone_number')

    validate(name, phone_number)
    validate_email(email)

    if phone_number is not None:
        phone_number = phone_number.replace(' ', '').strip()

    user: User = User(name=name.strip(), email=email.strip(), phone_number=phone_number or None, status='UNCONFIRMED',
                      role='USER')

    return user_repo.create(user)


def validate(name, phone_number, user_id=None):
    if name is None or len(name) < 2:
        abort(400, 'Name must be at least 2 characters')

    if phone_number:
        try:
            parsed_number = phonenumbers.parse(phone_number)
            if len(phone_number) > 20 or not phonenumbers.is_valid_number(parsed_number):
                abort(400)
        except Exception as e:
            abort(400, 'Invalid phone number')
    elif user_id is not None and user_app_config_service.is_two_factor_auth_enabled(user_id):
        abort(400, 'Phone number is mandatory when two-factor authentication is enabled')


def validate_email(email):
    if email is None or len(email) < 8 or not email_pattern.match(email):
        abort(400, 'Invalid email')

    if user_repo.get_by_email(email) is not None:
        abort(400, 'An account with that email is already registered')


def get_with_config(email):
    user = user_repo.get_by_email(email)
    if user is not None:
        configs = user_app_config_service.get_by_user(user.id)
        user_config = {"user": user.to_dict(), "configs": [config.to_dict() for config in configs]}
        return user_config
    else:
        abort(404)


def confirm_user(user_id):
    user: User = user_repo.get_by_id(user_id)
    if user is not None and user.status == 'UNCONFIRMED':
        user_repo.update_status(user, 'ACTIVE')
        notification_client.create_account_confirmed_notification(user)
        return {'email': user.email}
    else:
        abort(400, 'Cannot confirm this user')


def update(user_id, user_request):
    if user_id != int(g.current_user_id):
        abort(403)

    user: User = user_repo.get_by_id(user_id)

    if user is not None:
        name = user_request.get('name')
        phone_number: str | None = user_request.get('phone_number')

        validate(name, phone_number, user_id)

        if phone_number is not None:
            phone_number = phone_number.replace(' ', '').strip()

        user_repo.update(user, name, phone_number)
    else:
        abort(404)


def delete(user_id):
    if user_id != int(g.current_user_id):
        abort(403)

    user: User = user_repo.get_by_id(user_id)

    if user.status == 'DELETED':
        abort(400, 'Account is already deleted')

    if user.role == 'ADMIN':
        abort(400, 'Cannot delete admin account')

    user_repo.delete_data(user)
    user_app_config_service.delete_for_user(user_id)


def hide_email(email) -> str:
    at_index: int = email.find('@')

    if at_index > 0:
        mask_count = len(email[2:at_index])
        return f'{email[0:2]}{"*" * mask_count}{email[at_index:]}'
    else:
        return email


def get_active_users():
    users: list[User] = user_repo.get_active()
    user_dtos = []

    for user in users:
        masked_email = hide_email(user.email)
        dto = {'id': user.id, 'name': user.name, 'email': masked_email}
        user_dtos.append(dto)

    return user_dtos


def get_names_by_ids(user_ids):
    if user_ids is None or len(user_ids) == 0:
        return {}

    user_names = {}
    for user in user_repo.get_names_by_ids(user_ids):
        user_names[user.id] = user.name

    return user_names


def lock_user_account(user_id):
    user: User = user_repo.get_by_id(user_id)
    if user is not None:
        user_repo.update_status(user, 'LOCKED')
    else:
        abort(400, 'Cannot lock user account')


def unlock_user_account(user_id):
    user: User = user_repo.get_by_id(user_id)
    if user is not None:
        user_repo.update_status(user, 'ACTIVE')
    else:
        abort(400, 'Cannot unlock user account')


def get_all():
    return user_repo.get_all()


def set_status(user_id, data):
    user = get_by_id(user_id)

    if user.role == 'ADMIN':
        abort(400, 'Cannot change status of admin account')

    user_repo.update_status(user, data.get('status'))
