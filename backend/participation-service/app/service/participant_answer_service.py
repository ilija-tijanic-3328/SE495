from app.data import participant_answer_repo


def count_by_participant(participant_id) -> int:
    return participant_answer_repo.count_by_participant(participant_id)
