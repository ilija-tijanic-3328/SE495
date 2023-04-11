from app import db
from app.data.models import UserAppConfig


def get_by_user(user_id):
    return db.session.scalars(db.select(UserAppConfig).filter_by(user_id=user_id)).all()


def get_by_user_and_config(user_id, config):
    return db.session.scalar(db.select(UserAppConfig).filter_by(user_id=user_id, config=config))


def set_value(user_config: UserAppConfig, value: str):
    if user_config.id is None:
        db.session.add(user_config)
    user_config.value = value
    db.session.commit()
