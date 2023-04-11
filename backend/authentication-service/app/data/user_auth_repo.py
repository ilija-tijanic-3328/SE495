from app import db
from app.data.models import UserAuth


def get_by_user(user_id) -> UserAuth:
    return db.session.scalar(db.select(UserAuth).filter_by(user_id=user_id))


def create(user_auth: UserAuth) -> UserAuth:
    db.session.add(user_auth)
    db.session.commit()
    return user_auth


def set_password(user_id, hashed_password):
    user_auth = get_by_user(user_id)
    user_auth.password = hashed_password
    db.session.commit()
