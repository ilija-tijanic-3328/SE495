import os

from sqlalchemy import text
from app import db, bcrypt


class UserAuth(db.Model):
    __tablename__ = "user_auth"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    user_id = db.Column(db.Integer, nullable=False, unique=True, index=True)
    password = db.Column(db.String(255), nullable=False)
    failed_login_count = db.Column(db.Integer, default=0)
    failed_login_time = db.Column(db.DateTime)
    last_logged_in = db.Column(db.DateTime)

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}


class Token(db.Model):
    __tablename__ = "token"
    id = db.Column(db.Integer, db.Identity(), primary_key=True)
    user_id = db.Column(db.Integer, nullable=False, index=True)
    value = db.Column(db.String(150), nullable=False, index=True)
    type = db.Column(db.String(25), nullable=False)
    expiration_time = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}


@db.event.listens_for(UserAuth.__table__, 'after_create')
def initial_data(target, connection, **kw):
    init_data = os.getenv('INIT_DATA')
    password = os.getenv('AUTH_ADMIN_PASSWORD')
    init_data = init_data.replace('{{password}}', bcrypt.generate_password_hash(password).decode('utf-8'))
    connection.execute(text(init_data))
