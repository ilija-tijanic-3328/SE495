from app.api.main_api import db
from app.data.models import User


def get_filtered(args):
    query = db.select(User)

    email = args.get('email')
    search = args.get('search')
    if email:
        query = query.filter_by(email=email)
    elif search:
        term = f'%{search}%'
        query = query.filter_by(User.name.ilike(term) or User.email.ilike(term))

    if args.get('page') and args.get('per_page'):
        return db.paginate(query.order_by(args.get('sort') or User.name))

    return db.session.scalars(query).all()


def get_by_id(user_id):
    return db.get_or_404(User, user_id)


def create(user: User) -> User:
    db.session.add(user)
    db.session.commit()
    return user


def get_by_email(email):
    return db.session.scalar(db.select(User).filter_by(email=email))


def update_status(user: User, status: str):
    user.status = status
    db.session.commit()


def update(user: User, name: str, phone_number: str):
    user.name = name
    user.phone_number = phone_number
    db.session.commit()


def delete_data(user: User):
    user.name = '[Deleted User]'
    user.email = '[Deleted User]'
    user.phone_number = None
    user.status = 'DELETED'
    db.session.commit()


def get_active():
    return db.session.query(User).filter_by(status='ACTIVE', role='USER').order_by(User.name, User.email).all()
