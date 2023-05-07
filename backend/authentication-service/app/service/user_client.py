import requests
from flask import abort, current_app as app, g

from app import ROUTER_URL

SERVICE_HEADERS = {"X-Service-Name": "user-service"}


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


def get_account_with_config(email):
    json_headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    response = send_request('/users/config', params={"email": email}, headers=json_headers)
    if response.status_code == 200:
        return response.json()
    elif 400 <= response.status_code <= 499:
        return None
    else:
        abort(response.status_code, response.json().get('error'))


def get_by_id(user_id):
    return send_json_request(f'/users/{user_id}')


def create(user_request):
    return send_json_request('/users', method='POST', body=user_request)


def confirm_user(user_id):
    response = send_request(f'/users/{user_id}/confirm', method='PUT')
    if response.status_code != 200:
        app.logger.warning(f'Confirmation failed {user_id}')
        abort(500, 'Confirmation failed')
    return response.json().get('email')


def delete_account(user_id):
    response = send_request(f'/users/{user_id}', method='DELETE')
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))
