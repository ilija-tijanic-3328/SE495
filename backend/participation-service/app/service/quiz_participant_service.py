import datetime

from flask import abort, g, current_app

from app import scheduler
from app.data import quiz_participant_repo
from app.data.models import Participant, ParticipantAnswer
from app.service import email_client, notification_client, participant_answer_service, quiz_client

INVITATION_TYPES = ['NOTIFICATION', 'EMAIL', 'MANUAL']


def get_counts(quiz_ids: list):
    return quiz_participant_repo.get_counts(quiz_ids)


def get_by_quiz(quiz_id):
    return quiz_participant_repo.get_by_quiz(quiz_id)


def validate(quiz_id, quiz_title, participants):
    if quiz_id is None or quiz_title is None:
        abort(400, 'Quiz is mandatory')

    for participant in participants:
        name = participant.get('name')

        if name is None or 150 < len(name) < 1:
            abort(400, f'Invalid name for participant with code: {participant.get("code")}')

        invitation_type = participant.get('invitation_type')

        if invitation_type is None or invitation_type not in INVITATION_TYPES:
            abort(400, f'Invalid notification type for participant: {name}')

        code = participant.get('code')

        if code is None or len(code) != 5:
            abort(400, f'Invalid code for participant: {name}')

        if invitation_type == 'NOTIFICATION':
            if participant.get('user_id') is None:
                abort(400, f'Missing user id for participant: {name}')
        elif invitation_type == 'EMAIL':
            if participant.get('email') is None:
                abort(400, f'Missing email for participant: {name}')


def update_participants(data):
    quiz_id = data.get('quiz_id')
    quiz_title = data.get('quiz_title')
    participants = data.get('participants')

    validate(quiz_id, quiz_title, participants)

    existing_participants: list[Participant] = quiz_participant_repo.get_by_quiz(quiz_id)

    not_sent = []
    not_deleted = []

    for existing_participant in existing_participants:
        same = [p for p in participants if p.get('id') is not None and int(p.get('id') == existing_participant.id)]

        if len(same) == 0:
            answers_count: int = participant_answer_service.count_by_participant(existing_participant.id)
            if answers_count == 0:
                quiz_participant_repo.delete(existing_participant)
            else:
                email = ' - ' + existing_participant.email if existing_participant.email is not None else ''
                not_deleted.append(f'{existing_participant.name}{email}')

    new_participants = [p for p in participants if p.get('id') is None]
    for participant in new_participants:
        user_id = participant.get('user_id')
        email = participant.get('email')
        name = participant.get('name')
        code = participant.get('code')
        invitation_type = participant.get('invitation_type')

        new_participant: Participant = Participant(quiz_id=quiz_id, user_id=user_id, name=name, code=code,
                                                   invitation_type=invitation_type, email=email)

        quiz_participant_repo.create(new_participant)

        if invitation_type == 'EMAIL':
            sent = email_client.send_participant_invitation_email(name, email, quiz_title, code)
            if not sent:
                quiz_participant_repo.delete(new_participant)
                not_sent.append(f'{name} - {email}')
        elif invitation_type == 'NOTIFICATION':
            sent = notification_client.send_participant_invitation_notification(user_id, name, quiz_title, code)
            if not sent:
                quiz_participant_repo.delete(new_participant)
                not_sent.append(f'{name} - {email}')

    if 0 < len(new_participants) == len(not_sent):
        abort(400, "Couldn't send invitation to any participants")

    return {'not_sent': not_sent, 'not_deleted': not_deleted}


def get_unfinished_by_user(user_id):
    return quiz_participant_repo.get_unfinished_by_user(user_id)


def get_unfinished_by_code(code):
    participant: Participant = quiz_participant_repo.get_by_code(code)

    if participant is None:
        abort(404, "That code doesn't exist")

    if participant.end_time is not None:
        abort(418, "That code has already been used")

    current_user_id = g.get('current_user_id')
    if current_user_id is not None and participant.user_id is not None and int(current_user_id) != participant.user_id:
        abort(403)

    return participant


def end_attempt(participant_id, app_context):
    with app_context:
        participant: Participant = quiz_participant_repo.get_by_id(participant_id)
        if participant.end_time is None:
            end_time = datetime.datetime.now()
            quiz_participant_repo.set_end_time(participant, end_time)


def start_attempt(participant_id, allowed_time: int):
    participant: Participant = quiz_participant_repo.get_by_id(participant_id)
    start_time = datetime.datetime.now()
    quiz_participant_repo.set_start_time(participant, start_time)

    scheduler.add_job(func=end_attempt, args=[participant_id, current_app.app_context()],
                      run_date=start_time + datetime.timedelta(minutes=allowed_time, seconds=10))

    return {'start_time': start_time}


def submit_answers(participant_id, attempt: dict):
    participant: Participant = quiz_participant_repo.get_by_id(participant_id)

    if participant.start_time is None:
        abort(400, 'Quiz not started')

    if participant.end_time is not None:
        abort(400, 'Answers already submitted')

    quiz_participant_repo.set_end_time(participant, datetime.datetime.now())

    answers: list[ParticipantAnswer] = []

    quiz = quiz_client.get_questions_for_quiz(participant.quiz_id)
    actual_question_answers = quiz.get('questions')

    for attempt_question in attempt.keys():
        actual_question = actual_question_answers.get(str(attempt_question))

        if actual_question is None:
            continue

        attempt_answers = attempt.get(str(attempt_question))

        if attempt_answers is None or len(attempt_answers) == 0:
            continue

        actual_answers = actual_question.get('answers')

        if actual_question.get('type') != 'Multiple choice':
            attempt_answers = [attempt_answers]

        filtered_answers = set()
        for attempt_answer in attempt_answers:
            actual_answer = actual_answers.get(str(attempt_answer))
            if actual_answer is not None:
                filtered_answers.add(str(attempt_answer))

        answers.append(ParticipantAnswer(quiz_participant_id=participant.id, question_id=attempt_question,
                                         value=','.join(filtered_answers)))

    quiz_participant_repo.set_answers(participant, answers)


def get_results(code):
    participant: Participant = quiz_participant_repo.get_by_code(code)

    if participant.start_time is None:
        abort(400, 'Quiz not started')

    if participant.end_time is None:
        abort(400, 'Answers not submitted')

    quiz = quiz_client.get_questions_for_quiz(participant.quiz_id, include_configs=True)
    actual_question_answers = quiz.get('questions')

    question_dtos = []

    for question_id in actual_question_answers:
        question = actual_question_answers.get(question_id)
        question_dto = {'id': question_id, 'text': question.get('text'), 'type': question.get('type')}
        answer_dtos = []

        answer_attempt = [a for a in participant.answers if a.question_id == int(question_id)]
        answers = question.get('answers')

        for answer_id in answers:
            answer = answers.get(answer_id)
            values = answer_attempt[0].value.split(',') if answer_attempt else []

            answer_dtos.append({'id': answer_id, 'text': answer.get('text'), 'correct': answer.get('correct'),
                                'selected': values.count(answer_id) > 0})

        question_dto['answers'] = answer_dtos
        question_dtos.append(question_dto)

    results = participant.to_dict()
    counts = get_correct_count(participant)
    results['correct_count'] = counts[0]
    results['total_questions'] = counts[1]
    results['percentage'] = counts[0] / counts[1] * 100
    results['quiz'] = {'id': quiz.get('id'), 'title': quiz.get('title'), 'configs': quiz.get('configs')}
    results['questions'] = question_dtos

    return results


def get_correct_count(participant: Participant):
    quiz = quiz_client.get_questions_for_quiz(participant.quiz_id)
    actual_question_answers = quiz.get('questions')
    correct_count = 0

    for question_id in actual_question_answers:
        question = actual_question_answers.get(question_id)

        answer_attempt = [a for a in participant.answers if a.question_id == int(question_id)]
        answers = question.get('answers')
        correct_answers = len([a for a in answers.values() if a.get('correct')])

        for answer_id in answers:
            answer = answers.get(answer_id)
            values = answer_attempt[0].value.split(',') if answer_attempt else []

            if answer.get('correct') and values.count(answer_id) > 0:
                correct_count += 1 / correct_answers

    return correct_count, len(actual_question_answers)


def get_finished_by_user(user_id):
    participant_dtos = []

    for participant in quiz_participant_repo.get_finished_by_user(user_id):
        dto = participant.to_dict()
        counts = get_correct_count(participant)
        dto['correct_count'] = counts[0]
        dto['total_questions'] = counts[1]
        dto['percentage'] = counts[0] / counts[1] * 100
        participant_dtos.append(dto)

    return participant_dtos


def get_by_id(participant_id):
    return quiz_participant_repo.get_by_id(participant_id)
