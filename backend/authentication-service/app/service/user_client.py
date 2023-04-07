import requests
from flask import abort

from app import ROUTER_URL

SERVICE_HEADERS = {"service_name": "user-service"}


def send_request(path, method='GET', params=None, body=None, headers=None, acceptable_code=200):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    response = requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)
    if response.status_code == acceptable_code:
        return response.json()
    else:
        abort(response.status_code, response.json().get('error'))


def get_account_by_email(email):
    return send_request('/users/config', params={"email": email})


def get_by_id(user_id):
    return send_request(f'/users/{user_id}')


def create(user_request):
    return send_request('/users', method='POST', body=user_request)
