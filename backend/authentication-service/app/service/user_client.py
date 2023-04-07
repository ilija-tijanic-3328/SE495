import requests
from flask import abort, current_app as app

from app import ROUTER_URL

SERVICE_HEADERS = {"service_name": "user-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def send_json_request(path, method='GET', params=None, body=None, acceptable_code=200):
    json_headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    response = send_request(path, method, params=params, body=body, headers=json_headers)
    if response.status_code == acceptable_code:
        return response.json()
    else:
        abort(response.status_code, response.json().get('error'))


def get_account_by_email(email):
    return send_json_request('/users/config', params={"email": email})


def get_by_id(user_id):
    return send_json_request(f'/users/{user_id}')


def create(user_request):
    return send_json_request('/users', method='POST', body=user_request)


def confirm_user(user_id):
    response = send_request(f'/users/{user_id}/confirm', method='PUT')
    if response.status_code != 200:
        app.logger.warning(f'Confirmation failed {user_id}')
