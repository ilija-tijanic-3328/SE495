from datetime import timezone, datetime

import requests
from flask import g, abort

from app import ROUTER_URL
from app.service import quiz_client, user_client, notification_client

SERVICE_HEADERS = {"X-Service-Name": "participation-service"}


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


def get_participants(quiz_id):
    quiz_client.get_by_id_and_check_user(quiz_id)

    return send_json_request('/quiz-participants', params={'quiz_id': quiz_id})


def update_participants(quiz_id, participants):
    quiz = quiz_client.get_by_id_and_check_user(quiz_id)
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


def get_user_unfinished_participants():
    response = send_request('/quiz-participants/unfinished')

    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))

    return response.json()


def get_invitations():
    invitations = []

    user_unfinished_participants = get_user_unfinished_participants()

    quiz_ids = [p.get('quiz_id') for p in user_unfinished_participants]
    unfinished_quizzes = quiz_client.get_unfinished_by_ids(quiz_ids)

    inviter_ids = [q.get('user_id') for q in unfinished_quizzes.values()]
    inviters = user_client.get_names_by_ids(inviter_ids)

    for participant in user_unfinished_participants:
        dto = {'participant_id': participant.get('id'), 'code': participant.get('code')}

        quiz = unfinished_quizzes.get(str(participant.get('quiz_id')))

        if quiz is not None:
            dto['quiz_title'] = quiz.get('title')
            dto['quiz_start_time'] = quiz.get('start_time')
            dto['quiz_end_time'] = quiz.get('end_time')
            dto['quiz_time_allowed'] = quiz.get('time_allowed')
            dto['inviter'] = inviters.get(str(quiz.get('user_id')))

            invitations.append(dto)

    invitations.sort(key=lambda x: x.get('quiz_start_time'))

    return invitations


def get_unfinished_participant_by_code(code):
    response = send_request(f'/quiz-participants/unfinished/{code}')

    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))

    return response.json()


def get_unfinished_by_code(code):
    participant = get_unfinished_participant_by_code(code)

    participant['quiz'] = quiz_client.get_unfinished(participant.get('quiz_id'))

    return participant


def start_quiz(code):
    participant = get_unfinished_by_code(code)

    questions = quiz_client.get_attempt_questions(participant.get('quiz_id'))

    start_time = participant.get('start_time')
    if start_time is None:
        response = send_json_request(f'/quiz-participants/{participant.get("id")}/start', method='PUT',
                                     body={'time_allowed': participant.get('quiz').get('time_allowed')})
        start_time = response.get('start_time')

    return {'start_time': start_time, 'questions': questions}


def submit_answers(participant_id, answers):
    return send_json_request(f'/quiz-participants/{participant_id}/answers', method='PUT', body=answers)


def get_results(code):
    return send_json_request(f'/quiz-participants/{code}/results')


def get_user_finished_participants():
    response = send_request('/quiz-participants/finished')

    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))

    return response.json()


def get_attempts():
    attempts = []

    user_finished_participants = get_user_finished_participants()

    quiz_ids = [p.get('quiz_id') for p in user_finished_participants]
    quizzes = quiz_client.get_by_ids(quiz_ids)

    inviter_ids = [q.get('user_id') for q in quizzes.values()]
    inviters = user_client.get_names_by_ids(inviter_ids)

    for participant in user_finished_participants:
        quiz = quizzes.get(str(participant.get('quiz_id')))

        if quiz is not None:
            quiz['inviter'] = inviters.get(str(quiz.get('user_id')))
            participant['quiz'] = quiz
            attempts.append(participant)

    attempts.sort(key=lambda x: x.get('start_time'))

    return attempts


def get_by_id(participant_id):
    response = send_request(f'/quiz-participants/{participant_id}')

    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))

    return response.json()


def report_quiz(data):
    participant = get_by_id(data.get('participant_id'))

    message = data.get('message')
    if message is None or message == '':
        abort(400, 'Report cannot be empty')

    notification_client.report_quiz(message, participant.get('quiz_id'), participant.get('code'),
                                    participant.get('name'))


def get_leaderboard_participants(quiz_id):
    response = send_request(f'/quiz-participants/leaderboard/{quiz_id}')

    if response.status_code != 200:
        abort(response.status_code, response.json().get('error'))

    return response.json()


def get_leaderboard(quiz_id):
    quiz = quiz_client.get_by_id(quiz_id)

    quiz['participants'] = get_leaderboard_participants(quiz_id)

    return quiz
