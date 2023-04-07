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
