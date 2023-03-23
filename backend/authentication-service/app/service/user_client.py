import requests

from app import ROUTER_URL

HEADERS = {"service_name": "user-service"}


def send_request(path, method='GET', params=None, body=None):
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=HEADERS)


def get_user_by_email(email):
    return send_request('/users', params={"email": email})


def get_by_id(user_id):
    return send_request(f'/users/{user_id}')
