from app import db
from app.data.models import UserAuth


def get_by_user(user_id) -> UserAuth:
    return db.session.scalar(db.select(UserAuth).filter_by(user_id=user_id))
