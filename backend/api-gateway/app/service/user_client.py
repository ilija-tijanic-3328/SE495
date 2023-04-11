import requests
from flask import abort, g

from app import ROUTER_URL

SERVICE_HEADERS = {"service_name": "user-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    if g.current_user_id is not None:
        headers.update({"current_user_id": str(g.current_user_id)})
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def send_json_request(path, method='GET', params=None, body=None, headers=None, acceptable_code=200):
    json_headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    response = send_request(path, method, params=params, body=body, headers=json_headers)
    if response.status_code == acceptable_code:
        return response.json()
    else:
        abort(response.status_code, response.json().get('error'))


def get_user_configs():
    return send_json_request('/user-app-configs')


def update_user_config(data):
    response = send_request('/user-app-configs', 'PUT', body=data)
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))
    return response


def get_by_id(user_id):
    return send_json_request(f'/users/{user_id}')


def update_user(data):
    response = send_request(f'/users/{g.current_user_id}', 'PUT', body=data)
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))
    return response
