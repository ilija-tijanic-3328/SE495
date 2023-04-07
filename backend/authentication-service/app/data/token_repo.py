from app import db
from app.data.models import Token


def create(token: Token) -> Token:
    db.session.add(token)
    db.session.commit()
    return token


def get_token(value, token_type):
    return db.session.scalar(db.select(Token).filter_by(value=value, type=token_type))
