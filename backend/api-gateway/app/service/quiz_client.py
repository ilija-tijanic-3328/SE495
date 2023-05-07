import requests
from flask import abort, g, current_app

from app import ROUTER_URL

SERVICE_HEADERS = {"X-Service-Name": "quiz-service"}


def send_request(path, method='GET', params=None, body=None, headers=None):
    if headers is None:
        headers = dict()
    headers.update(SERVICE_HEADERS)
    if g is not None and g.get('current_user_id') is not None:
        headers.update({"X-Current-User-Id": str(g.current_user_id)})
    return requests.request(method, f"{ROUTER_URL}{path}", params=params, json=body, headers=headers)


def send_json_request(path, method='GET', params=None, body=None, acceptable_code=200):
    json_headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    response = send_request(path, method, params=params, body=body, headers=json_headers)
    if response.status_code == acceptable_code:
        return response.json()
    else:
        abort(response.status_code, response.json().get('error'))


def get_by_user(status: str):
    return send_json_request('/quizzes', params={'status': status})


def delete(quiz_id):
    response = send_request(f'/quizzes/{quiz_id}', method='DELETE')
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))


def get_by_id(quiz_id):
    return send_json_request(f'/quizzes/{quiz_id}')


def create(data):
    return send_json_request(f'/quizzes', method='POST', body=data, acceptable_code=201)


def update(quiz_id, data):
    return send_json_request(f'/quizzes/{quiz_id}', method='PUT', body=data)


def get_quiz_configs(quiz_id):
    return send_json_request(f'/quizzes/{quiz_id}/quiz-configs')


def update_configs(quiz_id, data):
    return send_json_request(f'/quizzes/{quiz_id}/quiz-configs', method='PUT', body=data)


def get_default_configs():
    return send_json_request('/quiz-configs')


def get_questions(quiz_id):
    return send_json_request(f'/quizzes/{quiz_id}/questions')


def update_questions(quiz_id, data):
    response = send_request(f'/quizzes/{quiz_id}/questions', method='PUT', body=data)
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))


def publish_quiz(quiz_id):
    response = send_request(f'/quizzes/{quiz_id}/publish', method='PUT')
    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))


def get_unfinished_by_ids(quiz_ids) -> dict:
    response = send_request(f'/quizzes/unfinished', params={'ids': quiz_ids})

    if response.status_code != 200:
        current_app.logger.warning(f"Fetching unfinished quizzes failed for ids: {quiz_ids}")
        return {}

    return response.json()


def get_unfinished(quiz_id):
    return send_json_request(f'/quizzes/{quiz_id}/unfinished')


def get_attempt_questions(quiz_id):
    return send_json_request(f'/quizzes/{quiz_id}/unfinished/questions')


def get_by_ids(quiz_ids):
    response = send_request(f'/quizzes/grouped', params={'ids': quiz_ids})

    if response.status_code != 200:
        current_app.logger.warning(f"Fetching grouped quizzes failed for ids: {quiz_ids}")
        return {}

    return response.json()
