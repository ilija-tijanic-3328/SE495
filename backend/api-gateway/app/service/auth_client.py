import requests

from app import ROUTER_URL

HEADERS = {"service_name": "authentication-service"}


def send_request(path, method='GET', params=None, body=None):
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=HEADERS)


def authenticate(data):
    return send_request('/auth', 'POST', body=data)
