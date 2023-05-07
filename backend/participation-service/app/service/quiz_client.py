import requests
from flask import g, abort

from app import ROUTER_URL

SERVICE_HEADERS = {"X-Service-Name": "quiz-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    if g is not None and g.get('current_user_id') is not None:
        headers.update({"X-Current-User-Id": str(g.current_user_id)})
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def get_questions_for_quiz(quiz_id):
    response = send_request(f'/quizzes/{quiz_id}/questions/grouped')

    if response.status_code != 200:
        abort(500, "Couldn't fetch questions for checking answers")

    return response.json()
