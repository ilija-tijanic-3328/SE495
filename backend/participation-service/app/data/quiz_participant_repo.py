from sqlalchemy import func

from app import db
from app.data.models import Participant


def get_counts(quiz_ids: list) -> dict:
    # query = '''
    # SELECT quiz_id, COUNT(id) AS participants, COUNT(end_time) AS submitted
    # FROM quiz_participant
    # WHERE quiz_id IN (:quiz_ids)
    # GROUP BY quiz_id
    # '''
    # rows = db.session.execute(text(query), {'quiz_ids': quiz_ids}).all()
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
