from app.data import user_repo


def get_filtered(args):
    return user_repo.get_filtered(args)


def get_by_id(user_id):
    return user_repo.get_by_id(user_id)
