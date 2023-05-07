from flask import abort, current_app as app

from app.data import question_repo
from app.data.models import Answer, Question

QUESTION_TYPES = ['Single choice', 'Multiple choice']


def get_by_quiz(quiz_id):
    return question_repo.get_by_quiz(quiz_id)


def map_to_answers(dtos, question_id=None):
    answers = []

    for dto in dtos:
        answer = Answer(id=dto.get('id'), question_id=question_id, text=dto.get('text').strip(),
                        correct=bool(dto.get('correct')), order=dto.get('order'))
        answers.append(answer)

    return answers


def validate(questions):
    if len(questions) < 1:
        abort(400, 'At least one question must be added')

    for question in questions:
        text = question.get('text')
        if text is None or 150 < len(text.strip()) < 1:
            abort(400, f'Text is invalid for question: {text}')

        question_type = question.get('type')
        if question_type is None or question_type not in QUESTION_TYPES:
            abort(400, f'Type is invalid for question: {text}')

        try:
            int(question.get('order'))
        except:
            abort(400, f'Order is invalid for question: {text}')

        answers = question.get('answers')

        if answers is None or len(answers) == 0:
            abort(400, f'Answers are invalid for question: {text}')

        for answer in answers:
            answer_text = answer.get('text')
            if answer_text is None or 150 < len(answer_text.strip()) < 1:
                abort(400, f'Text is invalid for answer in question: {text}')

            try:
                int(answer.get('order'))
            except:
                abort(400, f'Order is invalid for answer in question: {text}')

        correct_count = len([a for a in answers if bool(a.get('correct')) is True])
        incorrect_count = len([a for a in answers if bool(a.get('correct')) is False])

        if correct_count < 1 or incorrect_count < 1:
            abort(400, f'At least one correct and one incorrect answer is needed for question: {text}')

        if question_type == 'Single choice' and correct_count > 1:
            abort(400, f'Only one correct answer is allowed for question: {text}')

        if question_type == 'Multiple choice' and correct_count < 2:
            abort(400, f'At least two correct answers are needed for question: {text}')


def update(quiz_id, questions):
    validate(questions)

    existing_questions = question_repo.get_by_quiz(quiz_id)

    for existing_question in existing_questions:
        same = [q for q in questions if q.get('id') is not None and int(q.get('id')) == existing_question.id]
        if len(same) == 0:
            question_repo.delete(existing_question)
        else:
            text = same[0].get('text').strip()
            question_type = same[0].get('type')
            order = same[0].get('order')
            answers = map_to_answers(same[0].get('answers'), existing_question.id)
            question_repo.update(existing_question, text, question_type, order, answers)

    for question in [q for q in questions if q.get('id') is None]:
        text = question.get('text').strip()
        question_type = question.get('type')
        order = question.get('order')
        answers = map_to_answers(question.get('answers'))
        new_question: Question = Question(quiz_id=quiz_id, text=text, type=question_type, order=order,
                                          answers=answers)
        question_repo.create(new_question)
