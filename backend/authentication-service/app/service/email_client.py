import requests
from flask import current_app as app, abort

from app import ROUTER_URL

SERVICE_HEADERS = {"service_name": "email-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def send_registration_email(user, token):
    content = {
        "type": 'REGISTRATION',
        "email": user.get('email'),
        "content": {
            "name": user.get('name'),
            "token": token.value
        }
    }
    response = send_request('/send', method='POST', body=content)
    if response.status_code != 200:
        app.logger.warning(f'Registration email failed {token.id}')
        abort(500)


def send_forgot_password_email(user, token):
    content = {
        "type": 'FORGOT_PASSWORD',
        "email": user.get('email'),
        "content": {
            "name": user.get('name'),
            "token": token.value
        }
    }
    response = send_request('/send', method='POST', body=content)
    if response.status_code != 200:
        app.logger.warning(f'Registration email failed {token.id}')
        abort(500)
