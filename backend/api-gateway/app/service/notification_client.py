import requests
from flask import abort, g, current_app

from app import ROUTER_URL

SERVICE_HEADERS = {"X-Service-Name": "notification-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    if g is not None and g.get('current_user_id') is not None:
        headers.update({"X-Current-User-Id": str(g.current_user_id)})
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def send_json_request(path, method='GET', params=None, body=None, headers=None, acceptable_code=200):
    json_headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    response = send_request(path, method, params=params, body=body, headers=json_headers)
    if response.status_code == acceptable_code:
        return response.json()
    else:
        abort(response.status_code, response.json().get('error'))


def mark_as_seen(data):
    return send_json_request('/notifications', method='PUT', body=data)


def get_by_user():
    return send_json_request('/notifications')


def get_unseen_count():
    return send_json_request('/notifications/unseen-count')


def report_quiz(message, quiz_id, code, name):
    response = send_request(f'/notifications', 'POST', body={
        "user_id": 1,
        "type": "REPORT_QUIZ",
        "content": {
            "name": name,
            "code": code,
            "message": message
        },
        "deep_link": {
            "quiz_id": quiz_id
        }
    })
    if response.status_code != 201:
        current_app.logger.warning(f'Report quiz notification failed {code}')
        abort(response.status_code, response.json())
