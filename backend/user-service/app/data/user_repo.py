from app.api.main_api import db
from app.data.models import User


def get_all(sort, search):
    query = db.select(User)
    if search:
        term = f'%{search}%'
        query = query.filter_by(User.name.ilike(term) or User.email.ilike(term))
    return db.paginate(query.order_by(sort or User.name))


def get_by_id(user_id):
    return db.select(User).filter_by(id=user_id).first()


def get_by_email(email):
    return db.select(User).filter_by(email=email).first()