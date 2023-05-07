import requests
from flask import current_app as app, abort, g

from app import ROUTER_URL

SERVICE_HEADERS = {"X-Service-Name": "email-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    if g is not None and g.get('current_user_id') is not None:
        headers.update({"current_user_id": str(g.current_user_id)})
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
