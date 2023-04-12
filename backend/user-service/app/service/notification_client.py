import requests
from flask import g, abort

from app import ROUTER_URL

SERVICE_HEADERS = {"service_name": "notification-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    if g is not None and g.get('current_user_id') is not None:
        headers.update({"current_user_id": str(g.current_user_id)})
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def create_account_confirmed_notification(user):
    response = send_request(f'/notifications', 'POST', body={
        "user_id": user.id,
        "type": "ACCOUNT_CONFIRMED",
        "content": {
            "name": user.name
        }
    })
    if response.status_code != 201:
        abort(response.status_code, response.json().get('error'))
    return response
