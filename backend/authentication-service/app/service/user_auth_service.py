from app.data import user_auth_repo
from app.data.models import UserAuth


def get_by_user(user_id) -> UserAuth:
    return user_auth_repo.get_by_user(user_id)
