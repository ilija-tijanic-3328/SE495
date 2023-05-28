from unittest import TestCase

from app.service import quiz_participant_service


class ParticipantServiceTest(TestCase):
    def test_count_correct_answers(self):
        answers = [{'correct': True}, {'correct': False}, {'correct': True}]
        correct_count = quiz_participant_service.count_correct_answers(answers)
        assert correct_count == 2


