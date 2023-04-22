import requests
from flask import g, current_app

from app import ROUTER_URL

SERVICE_HEADERS = {"service_name": "email-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    if g is not None and g.get('current_user_id') is not None:
        headers.update({"current_user_id": str(g.current_user_id)})
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def send_participant_invitation_email(name, email, quiz_title, code):
    content = {
        "type": 'PARTICIPANT_INVITATION',
        "email": email,
        "content": {
            "name": name,
            "quiz_title": quiz_title,
            "code": code
        }
    }
    response = send_request('/send', method='POST', body=content)
    if response.status_code != 200:
        current_app.logger.warning(f'Participant invitation email failed {code}')
        return False
    return True
