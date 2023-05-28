from app import db
from app.data.models import ParticipantAnswer


def count_by_participant(participant_id) -> int:
    return db.session.query(ParticipantAnswer).filter_by(quiz_participant_id=participant_id).count()
