from flask import abort

from app.data import quiz_participant_repo
from app.data.models import Participant
from app.service import email_client, notification_client, participant_answer_service

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
