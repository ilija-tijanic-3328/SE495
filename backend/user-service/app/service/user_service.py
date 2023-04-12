import re

import phonenumbers
from flask import abort

from app.data import user_repo
from app.data.models import User
from app.service import user_app_config_service, notification_client

email_pattern = re.compile('^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$')


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


def validate(name, phone_number):
    if name is None or len(name) < 2:
        abort(400, 'Name must be at least 2 characters')

    if phone_number:
        try:
            parsed_number = phonenumbers.parse(phone_number)
            if len(phone_number) > 20 or not phonenumbers.is_valid_number(parsed_number):
                abort(400)
        except Exception as e:
            abort(400, 'Invalid phone number')


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


def update(user_id, user_request):
    user: User = user_repo.get_by_id(user_id)

    if user is not None:
        name = user_request.get('name')
        phone_number: str | None = user_request.get('phone_number')

        validate(name, phone_number)

        if phone_number is not None:
            phone_number = phone_number.replace(' ', '').strip()

        user_repo.update(user, name, phone_number)
    else:
        abort(404)
