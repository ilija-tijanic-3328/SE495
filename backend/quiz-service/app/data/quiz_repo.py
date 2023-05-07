import datetime

from app import db
from app.data.models import Quiz


def get_by_user_and_status(user_id, status):
    return db.session.query(Quiz).filter_by(user_id=user_id, status=status).all()


def get_by_id(quiz_id):
    return db.get_or_404(Quiz, quiz_id)


def update_status(quiz: Quiz, status: str):
    quiz.status = status
    db.session.commit()


def delete(quiz: Quiz):
    db.session.delete(quiz)
    db.session.commit()


def create(quiz: Quiz):
    db.session.add(quiz)
    db.session.commit()


def update(quiz: Quiz, title, description, time_allowed, start_time, end_time):
    quiz.title = title
    quiz.description = description
    quiz.time_allowed = time_allowed
    quiz.start_time = start_time
    quiz.end_time = end_time
    db.session.commit()


def get_unfinished_by_ids(quiz_ids):
    return db.session.query(Quiz).filter(Quiz.id.in_(quiz_ids), Quiz.status == 'PUBLISHED',
                                         Quiz.end_time > datetime.datetime.now()).all()


def get_by_ids(quiz_ids):
    return db.session.query(Quiz).filter(Quiz.id.in_(quiz_ids)).all()
