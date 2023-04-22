from datetime import datetime, timezone

from flask import abort

from app.data import quiz_repo
from app.data.models import Quiz
from app.service import participation_client, quiz_config_service, question_service

DATE_TIME_FORMAT = '%Y-%m-%dT%H:%M:%S.%f%z'


def get_by_user_and_status(user_id, status='PUBLISHED'):
    quizzes = quiz_repo.get_by_user_and_status(user_id, status)

    quiz_dtos = []

    if len(quizzes) > 0:
        try:
            participation_counts = participation_client.get_participation_count([q.id for q in quizzes])
        except:
            participation_counts = {}

        for quiz in quizzes:
            counts = participation_counts.get(str(quiz.id))
            quiz_dto = quiz.to_dict()

            if counts is None:
                quiz_dto['submitted_count'] = 0
                quiz_dto['participants_count'] = 0
            else:
                quiz_dto['submitted_count'] = counts.get('submitted') or 0
                quiz_dto['participants_count'] = counts.get('participants') or 0

            quiz_dtos.append(quiz_dto)

    return quiz_dtos


def delete(user_id, quiz_id):
    quiz = quiz_repo.get_by_id(quiz_id)

    if quiz.user_id != int(user_id):
        abort(403)

    participation_counts = participation_client.get_participation_count([quiz_id])

    if str(quiz_id) in participation_counts and participation_counts.get(str(quiz_id)).get('submitted') > 0:
        quiz_repo.update_status(quiz, 'ARCHIVED')
    else:
        quiz_config_service.delete_for_quiz(quiz_id)
        quiz_repo.delete(quiz)


def validate_new(title: str, time_allowed: int, start_time: datetime, end_time: datetime):
    if title is None or len(title) > 150:
        abort(400, 'Title is invalid')

    if time_allowed is None or time_allowed < 1 or time_allowed > 300:
        abort(400, 'Time allowed is invalid')

    now: datetime = datetime.now(timezone.utc)
    if start_time is None or start_time < now:
        abort(400, 'Start time must be in the future')

    if end_time is None or end_time < now:
        abort(400, 'End time must be in the future')

    if start_time > end_time:
        abort(400, 'End time must be after start time')


def validate_status(quiz: Quiz):
    if quiz.status == 'ARCHIVED':
        abort(400, 'Cannot edit archived quiz')

    now = datetime.now(timezone.utc)
    if quiz.status == 'PUBLISHED' and now > quiz.end_time.replace(tzinfo=timezone.utc):
        abort(400, 'Cannot edit finished quiz')


def validate_existing(quiz: Quiz, title: str, time_allowed: int, start_time: datetime,
                      end_time: datetime):
    validate_status(quiz)

    now = datetime.now(timezone.utc)
    if quiz.status == 'PUBLISHED' and now > quiz.start_time.replace(tzinfo=timezone.utc) != start_time:
        abort(400, 'Cannot change start time after quiz has started')

    validate_new(title, time_allowed, start_time, end_time)


def create(user_id, data: dict) -> Quiz:
    title: str = data.get('title')
    description: str = data.get('description')
    time_allowed = get_int(data.get('time_allowed'), 'Time allowed is invalid')
    start_time: datetime = get_date(data.get('start_time'), 'Start time is invalid')
    end_time: datetime = get_date(data.get('end_time'), 'End time is invalid')

    validate_new(title, time_allowed, start_time, end_time)

    quiz: Quiz = Quiz(user_id=user_id, title=title, description=description, status='DRAFT', time_allowed=time_allowed,
                      start_time=start_time, end_time=end_time)

    quiz_repo.create(quiz)

    return quiz


def get_by_id(user_id, quiz_id):
    quiz = quiz_repo.get_by_id(quiz_id)

    if quiz.user_id != int(user_id):
        abort(403)

    return quiz


def update(user_id, quiz_id, data):
    quiz: Quiz = quiz_repo.get_by_id(quiz_id)

    if quiz.user_id != int(user_id):
        abort(403)

    title: str = data.get('title')
    description: str = data.get('description')
    time_allowed = get_int(data.get('time_allowed'), 'Time allowed is invalid')
    start_time: datetime = get_date(data.get('start_time'), 'Start time is invalid')
    end_time: datetime = get_date(data.get('end_time'), 'End time is invalid')

    validate_existing(quiz, title, time_allowed, start_time, end_time)

    quiz_repo.update(quiz, title, description, time_allowed, start_time, end_time)

    return quiz


def get_int(number: str, msg: str):
    try:
        return int(number)
    except ValueError:
        abort(400, msg)


def get_date(date: str, msg: str):
    try:
        return datetime.strptime(date, DATE_TIME_FORMAT)
    except ValueError:
        abort(400, msg)


def get_quiz_configs(user_id, quiz_id):
    get_by_id(user_id, quiz_id)
    return quiz_config_service.get_by_quiz(quiz_id)


def update_configs(user_id, quiz_id, configs):
    quiz: Quiz = get_by_id(user_id, quiz_id)

    validate_status(quiz)

    quiz_config_service.update(quiz_id, configs)


def get_questions(user_id, quiz_id) -> list[dict]:
    get_by_id(user_id, quiz_id)
    questions = question_service.get_by_quiz(quiz_id)
    question_dtos = []

    for question in questions:
        dto = question.to_dict()
        dto['answers'] = [a.to_dict() for a in question.answers]
        question_dtos.append(dto)

    return question_dtos


def update_questions(user_id, quiz_id, questions):
    quiz: Quiz = get_by_id(user_id, quiz_id)

    validate_status(quiz)

    question_service.update(quiz_id, questions)


def publish_quiz(user_id, quiz_id):
    quiz: Quiz = get_by_id(user_id, quiz_id)
    quiz_repo.update_status(quiz, 'PUBLISHED')
