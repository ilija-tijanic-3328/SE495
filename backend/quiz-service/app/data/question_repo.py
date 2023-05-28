from app import db
from app.data.models import Question


def get_by_quiz(quiz_id):
    return db.session.query(Question).filter_by(quiz_id=quiz_id).order_by(Question.order).all()


def update(question: Question, text, question_type, order, answers):
    question.text = text
    question.type = question_type
    question.order = order
    question.answers = answers
    db.session.commit()


def delete(question: Question):
    db.session.delete(question)
    db.session.commit()


def create(question):
    db.session.add(question)
    db.session.commit()
