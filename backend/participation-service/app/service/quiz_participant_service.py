from app.data import quiz_participant_repo


def get_counts(quiz_ids: list):
    return quiz_participant_repo.get_counts(quiz_ids)
