from datetime import timezone, datetime

import requests
from flask import g, abort

from app import ROUTER_URL
from app.service import quiz_client

SERVICE_HEADERS = {"service_name": "participation-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    if g is not None and g.get('current_user_id') is not None:
        headers.update({"current_user_id": str(g.current_user_id)})
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def send_json_request(path, method='GET', params=None, body=None, acceptable_code=200):
    json_headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    response = send_request(path, method, params=params, body=body, headers=json_headers)
    if response.status_code == acceptable_code:
        return response.json()
    else:
        abort(response.status_code, response.json().get('error'))


def get_participants(quiz_id):
    quiz_client.get_by_id(quiz_id)

    return send_json_request('/quiz-participants', params={'quiz_id': quiz_id})


def update_participants(quiz_id, participants):
    quiz = quiz_client.get_by_id(quiz_id)
    status = quiz.get('status')

    if status == 'ARCHIVED':
        abort(400, 'Cannot edit archived quiz')

    now = datetime.now(timezone.utc)
    end_time = datetime.strptime(quiz.get('end_time'), '%Y-%m-%dT%H:%M:%S%z')
    if status and now > end_time.replace(tzinfo=timezone.utc):
        abort(400, 'Cannot edit finished quiz')

    response = send_request('/quiz-participants', method='PUT', body={
        'quiz_id': quiz_id,
        'quiz_title': quiz.get('title'),
        'participants': participants
    })

    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))

    quiz_client.publish_quiz(quiz_id)

    return response.json()
