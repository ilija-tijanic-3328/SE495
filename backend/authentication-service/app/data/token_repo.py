import datetime

from app import db
from app.data.models import Token


def create(token: Token) -> Token:
    db.session.add(token)
    db.session.commit()
    return token


def get_token(value, token_type) -> Token:
    return db.session.scalar(db.select(Token).filter(Token.value == value, Token.type == token_type,
                                                     Token.expiration_time > datetime.datetime.now()))


def delete(token):
    db.session.delete(token)
    db.session.commit()
