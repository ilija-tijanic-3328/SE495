import re

import phonenumbers
from flask import abort

from app.data import user_repo, user_app_config_repo
from app.data.models import User

email_pattern = re.compile('^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$')


def get_filtered(args):
    return user_repo.get_filtered(args)


def get_by_id(user_id):
    return user_repo.get_by_id(user_id)


def create(user_request):
    name = user_request.get('name')
    email = user_request.get('email')
    phone_number = user_request.get('phone_number')

    validate(name, email, phone_number)

    user: User = User(name=name, email=email, phone_number=phone_number, status='UNCONFIRMED', role='USER')

    return user_repo.create(user)


def validate(name, email, phone_number):
    if name is None or len(name) < 2:
        abort(400, 'Name must be at least 2 characters')

    if email is None or len(email) < 8 or not email_pattern.match(email):
        abort(400, 'Invalid email')

    if user_repo.get_by_email(email) is not None:
        abort(400, 'An account with that email is already registered')

    if phone_number is not None:
        parsed_number = phonenumbers.parse(phone_number)
        if not phonenumbers.is_valid_number(parsed_number):
            abort(400, 'Invalid phone number')


def get_with_config(email):
    user = user_repo.get_by_email(email)
    configs = user_app_config_repo.get_by_user(user.id)
    user_config = {"user": user.to_dict(), "configs": [config.to_dict() for config in configs]}
    return user_config
