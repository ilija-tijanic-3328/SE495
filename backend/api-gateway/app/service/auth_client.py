import requests
from flask import abort

from app import ROUTER_URL

SERVICE_HEADERS = {"service_name": "authentication-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def authenticate(data):
    json_headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    response = send_request('/auth/login', 'POST', body=data, headers=json_headers)
    if response.status_code == 200:
        return response.json()
    else:
        abort(response.status_code, response.json()['error'])
