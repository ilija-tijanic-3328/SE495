from unittest import TestCase


class QuizClientTest(TestCase):
    def test_get_questions_for_quiz(self):
        quiz_id = 1
        response = self.client.get(f'/quizzes/{quiz_id}/questions/grouped')
        self.assert200(response)
        self.assertEqual(response.json.values().length, 3)


