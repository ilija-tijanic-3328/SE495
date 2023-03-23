from app.data import user_repo


def get_all(sort, search):
    return user_repo.get_all(sort, search)


def get_by_id(user_id):
    return user_repo.get_by_id(user_id)


def get_by_email(email):
    return user_repo.get_by_email(email)