import requests
from flask import g, current_app

from app import ROUTER_URL

SERVICE_HEADERS = {"X-Service-Name": "notification-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    if g is not None and g.get('current_user_id') is not None:
        headers.update({"X-Current-User-Id": str(g.current_user_id)})
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def send_participant_invitation_notification(user_id, name, quiz_title, code):
    response = send_request(f'/notifications', 'POST', body={
        "user_id": user_id,
        "type": "PARTICIPANT_INVITATION",
        "content": {
            "name": name,
            "quiz_title": quiz_title
        },
        "deep_link": {
            "code": code
        }
    })
    if response.status_code != 201:
        current_app.logger.warning(f'Participant invitation notification failed {code}')
        return False
    return True
