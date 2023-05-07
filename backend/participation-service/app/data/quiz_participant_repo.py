from datetime import datetime

from sqlalchemy import func

from app import db
from app.data.models import Participant, ParticipantAnswer


def get_counts(quiz_ids: list) -> dict:
    rows = db.session.execute(
        db.select(Participant.quiz_id, func.count(Participant.id), func.count(Participant.end_time))
        .where(Participant.quiz_id.in_(quiz_ids))
        .group_by(Participant.quiz_id)
    ).all()
    counts = {}
    for row in rows:
        counts[row[0]] = {'participants': row[1], 'submitted': row[2]}

    return counts


def get_by_quiz(quiz_id):
    return db.session.query(Participant).filter_by(quiz_id=quiz_id).order_by(Participant.name).all()


def delete(existing_participant):
    db.session.delete(existing_participant)
    db.session.commit()


def create(participant):
    db.session.add(participant)
    db.session.commit()


def get_unfinished_by_user(user_id):
    return db.session.query(Participant).filter(Participant.user_id == user_id, Participant.end_time.is_(None)).all()


def get_by_code(code):
    return db.session.query(Participant).filter_by(code=code).first()


def set_start_time(participant: Participant, start_time: datetime):
    participant.start_time = start_time
    db.session.commit()


def get_by_id(participant_id):
    return db.get_or_404(Participant, participant_id)


def set_end_time(participant: Participant, end_time: datetime):
    participant.end_time = end_time
    db.session.commit()


def set_answers(participant: Participant, answers: list[ParticipantAnswer]):
    participant.answers = answers
    db.session.commit()


def get_finished_by_user(user_id):
    return db.session.query(Participant).filter(Participant.user_id == user_id, Participant.end_time.is_not(None)).all()
