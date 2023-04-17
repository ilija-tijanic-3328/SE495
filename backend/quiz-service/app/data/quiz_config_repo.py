from app import db
from app.data.models import QuizConfig


def get_by_quiz(quiz_id) -> list[QuizConfig]:
    return db.session.query(QuizConfig).filter_by(quiz_id=quiz_id).all()


def get_by_quiz_and_config(quiz_id, config) -> QuizConfig:
    return db.session.query(QuizConfig).filter_by(quiz_id=quiz_id, config=config).first()


def set_value(quiz_config: QuizConfig, config_value: str):
    if quiz_config.id is None:
        db.session.add(quiz_config)
    quiz_config.value = config_value
    db.session.commit()
