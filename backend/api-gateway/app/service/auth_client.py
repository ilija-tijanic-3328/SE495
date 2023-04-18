import requests
from flask import abort, g

from app import ROUTER_URL

SERVICE_HEADERS = {"service_name": "authentication-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    if g is not None and g.get('current_user_id') is not None:
        headers.update({"current_user_id": str(g.current_user_id)})
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def send_json_request(path, method='GET', params=None, body=None, acceptable_code=200):
    json_headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    response = send_request(path, method, params=params, body=body, headers=json_headers)
    if response.status_code == acceptable_code:
        return response.json()
    else:
        abort(response.status_code, response.json().get('error'))


def authenticate(data):
    return send_json_request('/auth/login', 'POST', body=data)


def register(data):
    response = send_request('/auth/register', 'POST', body=data)
    if response.status_code != 201:
        abort(response.status_code, response.json().get('error'))
    return response


def authenticate_two_factor(data):
    return send_json_request('/auth/login/two-factor', 'POST', body=data)


def confirm_email(data):
    response = send_request('/auth/confirm', 'PUT', body=data)
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))
    return response


def forgot_password(data):
    response = send_request('/auth/forgot-password', 'POST', body=data)
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))
    return response


def reset_password(data):
    response = send_request('/auth/reset-password', 'PUT', body=data)
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))
    return response


def validate_reset_password_token(data):
    response = send_request('/auth/reset-password/validate', 'POST', body=data)
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))
    return response


def get_current_user(jwt_header):
    response = send_request('/auth/current-user', headers={"Authorization": jwt_header})
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))
    return response.json().get('user_id')


def change_password(data):
    response = send_request('/auth/change-password', 'PUT', body=data)
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))
    return response


def delete_account(data):
    response = send_request('/auth/delete-account', 'DELETE', body=data)
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))
    return response
