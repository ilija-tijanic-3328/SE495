import requests

from app import ROUTER_URL

SERVICE_HEADERS = {"service_name": "user-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def get_user_by_email(email):
    users = send_request('/users', params={"email": email}).json()
    return users[0] if len(users) > 0 else None


def get_by_id(user_id):
    return send_request(f'/users/{user_id}')
