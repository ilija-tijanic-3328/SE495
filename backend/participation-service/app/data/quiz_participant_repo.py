from sqlalchemy import func

from app import db
from app.data.models import QuizParticipant


def get_counts(quiz_ids: list) -> dict:
    # query = '''
    # SELECT quiz_id, COUNT(id) AS participants, COUNT(end_time) AS submitted
    # FROM quiz_participant
    # WHERE quiz_id IN (:quiz_ids)
    # GROUP BY quiz_id
    # '''
    # rows = db.session.execute(text(query), {'quiz_ids': quiz_ids}).all()
    rows = db.session.execute(
        db.select(QuizParticipant.quiz_id, func.count(QuizParticipant.id), func.count(QuizParticipant.end_time))
        .where(QuizParticipant.quiz_id.in_(quiz_ids))
        .group_by(QuizParticipant.quiz_id)
    ).all()
    counts = {}
    for row in rows:
        counts[row[0]] = {'participants': row[1], 'submitted': row[2]}
    return counts
